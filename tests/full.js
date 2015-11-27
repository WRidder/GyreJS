const test = require("tape");
import GyreJS from "../src/index";

function createSimpleGyreFactory() {
  return GyreJS.createGyreFactory();
}
function registerSimpleGyreFactory(gf) {
  GyreJS.registerGyreFactory("simple", gf);
  return GyreJS.createGyre("simple");
}

test("Full: Can create and register a gyre factory", function(t) {
  t.plan(2);
  const simpleGyreFactory = createSimpleGyreFactory();
  const simpleGyre = registerSimpleGyreFactory(simpleGyreFactory);

  t.equal(typeof simpleGyreFactory, "function", "Gyre factory should be of type function.");
  t.equal(typeof simpleGyre, "object", "Gyre instance should be of type object.");
});

test("Full: Can add and dispatch actions.", function(t) {
  t.plan(3);
  const simpleGyre = registerSimpleGyreFactory(createSimpleGyreFactory());

  // Set initial state
  simpleGyre.setState({
    counter: 0
  });

  // Create actions
  simpleGyre.addActions({
    "increment": (state) =>
      state.set("counter", state.get("counter") + 1),
    "decrement": (state) =>
      state.set("counter", state.get("counter") - 1)
  });

  // Initial state
  t.deepLooseEqual(simpleGyre.getState().toJSON(), {
    counter: 0
  }, "Initial state");

  // Single increment
  simpleGyre.dispatch("increment");

  t.deepLooseEqual(simpleGyre.getState().toJSON(), {
    counter: 1
  }, "State after single increment");

  // Double decrement
  simpleGyre
    .dispatch("decrement")
    .dispatch("decrement");

  t.deepLooseEqual(simpleGyre.getState().toJSON(), {
    counter: -1
  }, "State after double decrement");
});

test("Full: Can add and use selectors and use dispatcher middleware", function(t) {
  t.plan(2);
  const simpleGyre = registerSimpleGyreFactory(createSimpleGyreFactory());

  // Set initial state and create actions (chained)
  simpleGyre
    .setState({
      counter: 0
    })
    .addAction("increment", (state) =>
      state.set("counter", state.get("counter") + 1))
    .addAction("decrement", (state) =>
      state.set("counter", state.get("counter") - 1));

  // Create selector callback
  const selCountArray = [];
  const selectorCb = (count) => {
    selCountArray.push(count);
  };

  // Create selectors
  simpleGyre.createSelector((state, cb) => {
    cb(state.get("counter"));
  }, selectorCb);

  // Create middleware
  let logCount = 0;
  const mw = (nameSpace, id, args, next, dispatch) => {
    logCount++;
    next();
  };

  // Register selector and create it
  simpleGyre
    .use(mw)
    .addSelector("simple", () => (state, cb) => {
      cb(state.get("counter"));
    })
    .createSelector("simple", selectorCb);

  // Initial state
  // Single increment
  simpleGyre
    .dispatch("increment")
    .dispatch("decrement")
    .dispatch("decrement");

  // Test result
  t.deepLooseEqual(selCountArray, [0, 0, 1, 1, 0, 0, -1, -1], "Selector callback result compare.");
  t.equal(logCount, 3, "Middleware should be called once on every action.");
});
