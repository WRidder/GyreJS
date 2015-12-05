const test = require("tape");
import GyreJS from "../src/index";

test("Main: Default export should return an object", function(t) {
  t.plan(1);
  t.equal(typeof GyreJS, "object");
});

test("Main: Uses a correct singleton technique", function(t) {
  t.plan(4);
  let gyres;
  const getGyres = (() => {
    return () => gyres || (gyres = {});
  })();

  t.equal(typeof gyres, "undefined", "Gyres object should be empty before first use");
  t.equal(getGyres(), getGyres(), "Multiple calls should return the same object");
  t.equal(typeof gyres, "object", "After first use, gyres should be an object.");
  t.equal(getGyres(), gyres);
});


