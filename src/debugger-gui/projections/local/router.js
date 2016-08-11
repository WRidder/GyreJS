module.exports = {
  initialState: () => ({previousPath: "", path: ""}),
  events: {
    "routerDidChange": (state, event) =>
      Object.assign({}, state, {
        path: event.path,
        previousPath: state.path
      })
  }
};
