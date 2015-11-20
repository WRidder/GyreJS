var test = require("tape");
var Immutable = require("immutable");
var Store = require("../src/store");

test("Store: factory should return a function", function(t) {
  t.plan(1);
  t.equal(typeof Store, "function");
});

test("Store: when initialized should be an object", function(t) {
  t.plan(1);

  const store = Store();
  t.equal(typeof store, "object", "Store() returns an object.");
});

test("Store: can add and remove a filter", function(t) {
  t.plan(1);

  const store = Store();
  const filter = {
    update: () => {}
  };

  const removeFilter = store.addFilter(filter.update);
  t.equal(typeof removeFilter, "function");
  removeFilter();
});

test("Store: can set and get a state", function(t) {
  t.plan(2);

  const store = Store();
  const state = Immutable.Map({test: "foo"});

  // Set state and verify return value
  const returnState = store.setState(state, "foo");
  t.equal(state, returnState.get("foo"), "return state should equal given state.");
  t.equal(state, store.getState().get("foo"), "getState() should now equal given state.");
});

test("Store: can set and get a state using plain JSON", function(t) {
  t.plan(2);

  const store = Store();
  const state = {test: "foo"};

  // Set state and verify return value
  const returnState = store.setState(state, "foo");
  t.equal(JSON.stringify(state), JSON.stringify(returnState.get("foo").toJSON()), "return state should equal given state.");
  t.equal(JSON.stringify(state), JSON.stringify(store.getState().get("foo").toJSON()), "getState() should now equal given state.");
});

test.skip("Store: an update function can alter the state", function(t) {
  t.plan(1);

  const store = Store();
  const updateFunction = (state, value) => {
    return state.set("testValue", value);
  };
  store.updateState("testNS", updateFunction, [99]);

  // Set state and verify return value
  t.equal(store.getState().get("testNS").get("testValue"), 99,
    "update should have correctly altered the state");
});
