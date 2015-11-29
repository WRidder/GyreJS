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

test("Full: Can overide a previous registered factory at a given ID", function(t) {
  t.plan(3);
  const gf = createSimpleGyreFactory();
  const simpleGyre1 = GyreJS.registerGyreFactory("simple2", gf);
  const simpleGyre2 = GyreJS.registerGyreFactory("simple2", gf);

  t.equal(typeof gf, "function", "Gyre factory should be of type function.");
  t.equal(typeof simpleGyre1, "object", "Gyre instance should be of type object.");
  t.equal(typeof simpleGyre2, "object", "Gyre instance should be of type object.");
});

test("Full: Can add and dispatch actions.", function(t) {
  t.plan(3);
  const simpleGyre = registerSimpleGyreFactory(createSimpleGyreFactory());

  // Set initial state
  simpleGyre.setState({
    counter: 0
  });

  // Create actions using an object
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
  t.plan(11);
  const simpleGyre = registerSimpleGyreFactory(createSimpleGyreFactory());

  // Set initial state and create actions (chained)
  simpleGyre
    .setState({
      counter: 0
    })
    .addAction("increment",
      (state) =>
        state.set("counter", state.get("counter") + 1))
    .addAction("decrement",
      (state) =>
        state.set("counter", state.get("counter") - 1))
    .addAction("no-op", () => {});

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
  const mw1 = (nameSpace, id, args, next) => {
    logCount++;
    next();
  };

  let correctOrder = true;
  let logCount2 = 0;
  const mw2 = (nameSpace, id, args, next) => {
    correctOrder = correctOrder && logCount2 < logCount;
    logCount2++;
    next();
  };

  // Register selector and create it
  simpleGyre
    .use(mw1)
    .use(mw2)
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
  t.equal(correctOrder, true, "Middleware should be called in order of addition.");

  // Middleware is called with (ns, id, action args, next, dispatch)
  const mw3 = (nameSpace, id, args, next, dispatch) => {
    // Check function arguments
    t.equal(typeof nameSpace, "string", "First argument of middleware invoked function should be of type string.");
    t.equal(typeof id, "string", "Second argument of middleware invoked function should be of type string.");
    t.equal(Object.prototype.toString.call(args), "[object Array]", "Third argument of middleware invoked function should be of type array.");
    t.equal(typeof next, "function", "Fourth argument of middleware invoked function should be of type function.");
    t.equal(typeof dispatch, "function", "Fifth argument of middleware invoked function should be of type function.");

    // Check contents of args array
    t.equal(args[0], "foo", "Action arguments are correctly passed.");
    t.equal(args[1], true, "Action arguments are correctly passed.");
    t.deepLooseEqual(args[2], {}, "Action arguments are correctly passed.");
    next();
  };

  simpleGyre
    .use(mw3)
    .dispatch("no-op", "foo", true, {});
});
