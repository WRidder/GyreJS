const GyreJS = require("../src/");
import GyreDebugger from "../src/debugger";
import GyreDebuggerGUI from "../src/debugger-gui";

const aggregates = {
  "counter": {
    eventFilter: (event) => event.type === "incremented" || event.type === "decremented",
    methods: {
      "increment": (state, gyre, byValue) => {
        gyre.trigger("incremented", state.count, state.count + byValue, byValue);
      },
      "decrement": (state, {trigger}, byValue) => {
        trigger("decremented", state.count, state.count - byValue, -1 * byValue);
      },
      "incrementIfOdd": (state, gyre, byValue) => {
        if (state.count % 2 !== 0 && state.count !== 0) {
          gyre.trigger("incremented", state.count, state.count + byValue, byValue);
        }
      }
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
  "incrementCounter": ({getAggregate}, value) => {
    getAggregate("counter")
      .increment(value);
  },
  "incrementCounterIfOdd": ({getAggregate}, value) => {
    getAggregate("counter")
      .incrementIfOdd(value);
  },
  "decrementCounter": ({getAggregate}, value) => {
    getAggregate("counter")
      .decrement(value);
  },
  loadUsers({fetch}) {
    console.log(">>> cmd loadUsers called"); // eslint-disable-line no-console

    fetch("http://jsonplaceholder.typicode.com/users")
      .then((response) => {
        console.log(">>> fetch response!", response); // eslint-disable-line no-console
        if (response.ok) {
          return response.json();
        }
        return false;
      })
      .then((data) => {
        console.log(">>> fetch data!", data); // eslint-disable-line no-console
      });
  }
};

// Events (as obj or array?)
const events = {
  "incremented": (oldValue, newValue, by) => ({oldValue, newValue, by}),
  "decremented": ["oldValue", "newValue", "by"],
  "usersLoaded": ["users"]
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

module.exports = () => {
  // Add debugger
  const debuggerInstance = new GyreDebugger();

  // Create gyre instance
  const gyre = GyreJS.createGyre({
    id: "simple",
    commands,
    events,
    aggregates,
    projections,
    ticker: "synchronous"
  });

  const gyre1 = GyreJS.createGyre({
    id: "simple-1",
    commands,
    events,
    aggregates,
    projections,
    ticker: "synchronous"
  });

  const gyre2 = GyreJS.createGyre({
    commands,
    events,
    aggregates,
    projections,
    ticker: "synchronous"
  });

  const gyre3 = GyreJS.createGyre({
    commands,
    events,
    aggregates,
    projections,
    ticker: "synchronous"
  });

  // Watch gyre
  const watchedGyre = debuggerInstance.watchGyre(gyre);
  debuggerInstance.watchGyre(gyre1);
  debuggerInstance.watchGyre(gyre2);
  debuggerInstance.watchGyre(gyre3);

  // Debugger GUI
  const debuggerGUI = new GyreDebuggerGUI(debuggerInstance);
  debuggerGUI.show();

  return watchedGyre;
};
