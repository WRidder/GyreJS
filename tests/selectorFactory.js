var test = require("tape");
var SelectorFactory = require("../src/selectorFactory").default;
var Store = require("../src/store").default;

test("SelectorFactory: factory should return a function", function(t) {
  t.plan(1);
  t.equal(typeof SelectorFactory, "function");
});

test("SelectorFactory: when invoked should return a factory function.", function(t) {
  t.plan(1);
  const store = Store();
  const selectorFactory = SelectorFactory(store, {NS: "test"}, () => {});
  t.equal(typeof selectorFactory, "function");
});
