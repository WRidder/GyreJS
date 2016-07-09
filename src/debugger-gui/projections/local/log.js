module.exports = {
  initialState: () => ({logLength: 0, unReadCount: 0}),
  events: {
    "logViewed": (state) =>
      Object.assign({}, state, {
        unReadCount: 0
      }),
    "updateLogLength": (state, event) => Object.assign({}, state, {
      logLength: event.logLength,
      unReadCount: (event.logLength - state.logLength) + state.unReadCount
    })
  }
};
