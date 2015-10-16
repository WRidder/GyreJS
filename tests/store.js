var test = require("tape");
var Immutable = require("immutable");
var {Store} = require("../src/index");

test("Store: factory should return a function", function (t) {
  t.plan(1);
  t.equal(typeof Store, "function");
});

test("Store: when initialized should be an object", function (t) {
  t.plan(1);

  const store = Store();
  t.equal(typeof store, "object", "Store() returns an object.");
});

test("Store: should expose an API", function (t) {
  t.plan(2);

  const store = Store();
  t.assert(Object.keys(store).length === 4);
  t.equal(Object.keys(store).toString(), "addReducer,getState,setState,updateState");
});

test("Store: can add and remove a reducer", function (t) {
  t.plan(1);

  const store = Store();
  const reducer = {
    update: () => {}
  };

  const removeReducer = store.addReducer(reducer.update);
  t.equal(typeof removeReducer, "function");
  removeReducer();
});

test("Store: can set and get a state", function (t) {
  t.plan(2);

  const store = Store();
  const state = Immutable.Map({test: "foo"});

  // Set state and verify return value
  const returnState = store.setState(state);
  t.equal(state, returnState, "return state should equal given state.");
  t.equal(state, store.getState(), "getState() should now equal given state.");
});

test("Store: can set and get a state using plain JSON", function (t) {
  t.plan(2);

  const store = Store();
  const state = {test: "foo"};

  // Set state and verify return value
  const returnState = store.setState(state);
  t.equal(JSON.stringify(state), JSON.stringify(returnState.toJSON()), "return state should equal given state.");
  t.equal(JSON.stringify(state), JSON.stringify(store.getState().toJSON()), "getState() should now equal given state.");
});

test("Store: can set and get a namespaced state", function (t) {
  t.plan(2);

  const store = Store();
  const state = Immutable.Map({test: "foo"});

  // Set state and verify return value
  const returnState = store.setState(state, "foo");
  t.equal(returnState, store.getState(), "return state should equal getState().");
  t.equal(state, store.getState().get("foo"), "getState().get(namespace) should now equal given state.");
});

test("Store: an update function can alter the state", function (t) {
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
