var test = require("tape");
import GyreJS from "../src/index";

test("Main: Default export should return an object", function(t) {
  t.plan(1);
  t.equal(typeof GyreJS, "object");
});
