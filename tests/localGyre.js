var test = require("tape");
var Immutable = require("immutable");
var dom = require("cheerio");
var reactDom = require("react-dom/server");
var render = reactDom.renderToStaticMarkup;
var Store = require("../src/store");
var LocalGyreFactory = require("../src/gyres/local/factory");

test("LocalGyre: factory should return a function", function (t) {
  t.plan(1);
  t.equal(typeof LocalGyreFactory, "function");
});

test.skip("LocalGyre: should expose an API", function (t) {
  t.plan(2);

  const store = Store();
  const localGyre = LocalGyreFactory(store, "anotherNS");
  const localGyreKeys = Object.keys(localGyre);
  t.assert(localGyreKeys.length === 5, "Exposes 5 methods.");
  t.equal(localGyreKeys.toString(), "addAction,dispatch,getReducer,getStateHistory,setState", "Names the methods.");
});

test.skip("LocalGyre: should be able to set its own state", function (t) {
  t.plan(1);

  const store = Store();
  const localGyre = LocalGyreFactory(store, "anotherNS");

  const newState = Immutable.Map({
    test: "foo"
  });
  localGyre.setState(newState);

  t.equal(newState, store.getState().get("anotherNS"), "Initial state is stored in store.");
});
