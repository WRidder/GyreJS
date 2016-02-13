const GyreJS = require("../src/").init();
import GyreDebugger from "../src/debugger";
import GyreDebuggerGUI from "../src/debugger-gui";

const aggregates = {
  "counter": {
    eventFilter: (event) => event.type === "incremented" || event.type === "decremented",
    methods: {
      "increment": function(state, gyre, byValue) {
        gyre.trigger("incremented", state.count, state.count + byValue, byValue);
      },
      "decrement": function(state, {trigger}, byValue) {
        trigger("decremented", state.count, state.count - byValue, -1 * byValue);
      },
      "incrementIfOdd": function(state, gyre, byValue) {
        if (state.count % 2 !== 0 && state.count !== 0) {
          gyre.trigger("incremented", state.count, state.count + byValue, byValue);
        }
      },
    },
    reducer: (state = {count: 0}, event) => {
      switch (event.type) {
        case "incremented":
        case "decremented":
          return Object.assign({}, state, {
            count: state.count + event.by
          });
        default:
          return state;
      }
    }
  }
};

// Commands
const commands = {
  "incrementCounter": function({getAggregate}, value) {
    getAggregate("counter")
      .increment(value);
  },
  "incrementCounterIfOdd": function({getAggregate}, value) {
    getAggregate("counter")
      .incrementIfOdd(value);
  },
  "decrementCounter": function({getAggregate}, value) {
    getAggregate("counter")
      .decrement(value);
  }
};

// Events (as obj or array?)
const events = {
  "incremented": (oldValue, newValue, by) => ({oldValue, newValue, by}),
  "decremented": ["oldValue", "newValue", "by"]
};

const projections = {
  test1: (state = {count: 0}, event) => {
    switch (event.type) {
      case "incremented":
      case "decremented":
        return Object.assign({}, state, {
          count: state.count + event.by
        });
      default:
        return state;
    }
  },
  test2: (state = {evtCount: 0, dCount: 0, iCount: 0}, event) => {
    switch (event.type) {
      case "incremented":
        return Object.assign({}, state, {
          evtCount: state.evtCount + 1,
          iCount: state.iCount + 1
        });
      case "decremented":
        return Object.assign({}, state, {
          evtCount: state.evtCount + 1,
          dCount: state.dCount + 1
        });
      default:
        return state;
    }
  },
  test3: (state = {absDistance: 0}, event) => {
    switch (event.type) {
      case "incremented":
      case "decremented":
        return Object.assign({}, state, {
          absDistance: state.absDistance + Math.abs(event.by)
        });
      default:
        return state;
    }
  }
};

// Create and register gyre factory
GyreJS.createGyre("simple", {
  commands,
  events,
  aggregates,
  projections,
  ticker: "synchronous"
});

module.exports = () => {
  // Add debugger
  const debuggerInstance = GyreJS.attachDebugger(GyreDebugger);

  // Debugger GUI
  const debuggerGUI = GyreDebuggerGUI(debuggerInstance);
  debuggerGUI.init();
  console.log("hi!");

  // Create gyre instance
  return GyreJS.instantiateGyre("simple");
};
