var test = require("tape");
var Immutable = require("immutable");
var {Store, LocalFactory} = require("../src/index");

test("LocalFactory: factory should return a function", function (t) {
  t.plan(1);
  t.equal(typeof LocalFactory, "function");
});

test("LocalFactory: should expose an API", function (t) {
  t.plan(2);

  const store = Store();
  const localGyre = LocalFactory(store, "anotherNS");
  const localGyreKeys = Object.keys(localGyre);
  t.assert(localGyreKeys.length === 4, "Exposes 4 methods.");
  t.equal(localGyreKeys.toString(), "AH,getHoC,getReducer,setState", "Names the methods.");
});

test("LocalFactory: should be able to set its own state", function (t) {
  t.plan(1);

  const store = Store();
  const localGyre = LocalFactory(store, "anotherNS");

  const newState = Immutable.Map({
    test: "foo"
  });
  localGyre.setState(newState);

  t.equal(newState, store.getState().get("anotherNS"), "Initial state is stored in store.");
});
