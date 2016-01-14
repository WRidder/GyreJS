let GyreJS = require("../src/");

const aggregates = {
  "counter": {
    eventFilter: (event) => event.type === "incremented" || event.type === "decremented",
    methods: {
      "increment": function(state, trigger, byValue) {
        /*if (
          state.count + byValue >= 0 &&
          state.count + byValue <= 5) {
          trigger("incremented", state.count, state.count + byValue, byValue);
        }*/
        trigger("incremented", state.count, state.count + byValue, byValue);
      },
      "decrement": function(state, trigger, byValue) {
        /*if (state.count - byValue >= 0) {
          trigger("decremented", state.count, state.count - byValue, -1 * byValue);
        }*/
        trigger("decremented", state.count, state.count - byValue, -1 * byValue);
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
  "incrementCounter": function(value) {
    this.getAggregate("counter")
      .increment(value);
  },
  "decrementCounter": function(value) {
    this.getAggregate("counter")
      .decrement(value);
  }
};

// Events (as obj or array?)
const events = {
  "incremented": (oldValue, newValue, by) => ({oldValue, newValue, by}),
  "decremented": (oldValue, newValue, by) => ({oldValue, newValue, by})
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

module.exports = () => GyreJS.instantiateGyre("simple");
