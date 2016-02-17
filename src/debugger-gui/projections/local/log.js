module.exports = {
  initialState: () => ({logLength: 0, unReadCount: 0}),
  events: {
    "logViewed": (state) => {
      return Object.assign({}, state, {
        unReadCount: 0
      });
    },
    "updateLogLength": (state, event) => {
      return Object.assign({}, state, {
        logLength: event.logLength,
        unReadCount: (event.logLength - state.logLength) + state.unReadCount
      });
    }
  }
};
