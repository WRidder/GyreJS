const test = require("tape");
const ActionHandler = require("../src/actionHandler").default;

function storeMock(updateCb) {
  return {
    update: updateCb || (() => {})
  };
}

test("ActionHandler: factory should return a function", function(t) {
  t.plan(1);
  t.equal(typeof ActionHandler, "function");
});

test("ActionHandler: when initialized should be an object", function(t) {
  t.plan(1);
  const store = storeMock();
  const actionHandler = ActionHandler(store, {NS: "test"});
  t.equal(typeof actionHandler, "object", "ActionHandler() returns an object.");
});

test("ActionHandler: manages and dispatches actions.", function(t) {
  t.plan(1);

  let storeUpdateCalled = 0;
  const store = storeMock(() => {
    storeUpdateCalled++;
  });
  const actionHandler = ActionHandler(store, {NS: "test"});

  // Add actions
  actionHandler.addAction("action1", () => {});
  actionHandler.addAction("action2", () => {});
  actionHandler.addActions({
    "action3": () => {},
    "action4": () => {}
  });

  // Dispatch actions
  actionHandler.dispatch("action1");
  actionHandler.dispatch("action2");
  actionHandler.dispatch("action3");
  actionHandler.dispatch("action4");

  t.equal(storeUpdateCalled, 4, "Store update function should be called once after every dispatch.");
});

test("ActionHandler: supports FSA actions", function(t) {
  t.plan(1);

  let storeUpdateCalled = 0;
  const store = storeMock(() => {
    storeUpdateCalled++;
  });
  const actionHandler = ActionHandler(store, {NS: "test"});

  // Add actions
  actionHandler.addAction("action1", () => {});

  // Dispatch actions; normal and FSA style.
  actionHandler.dispatch("action1");
  actionHandler.dispatch({
    type: "action1"
  });

  t.equal(storeUpdateCalled, 2, "Store update function should be called once after every dispatch.");
});
