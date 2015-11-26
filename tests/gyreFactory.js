var test = require("tape");
var GyreFactory = require("../src/gyreFactory").default;

test("GyreFactory: factory should return a function", function(t) {
  t.plan(1);
  t.equal(typeof GyreFactory, "function");
});

test("GyreFactory: when invoked should return a factory function.", function(t) {
  t.plan(1);
  const gyreFactory = GyreFactory();
  t.equal(typeof gyreFactory, "function");
});
