module.exports = {
  initialState: () => ({previousPath: "", path: ""}),
  events: {
    "routerDidChange": (state, event) => {
      return Object.assign({}, state, {
        path: event.path,
        previousPath: state.path
      });
    }
  }
};
