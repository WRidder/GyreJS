/**
 * reducer()
 *
 * @param store
 * @param matcher
 * @param cb
 * @param nameSpace
 * @returns {*}
 */
const reducer = (store, matcher, cb, nameSpace) => {
  // Private functions
  const update = (state) => {
    state = nameSpace ? state.get(nameSpace) : state;

    if (state) {
      const data = state.get(matcher);
      if (data) {
        cb(true, data);
      }
      else {
        cb(false);
      }
    }
  };

  // Return the un-register function right away.
  return store.addReducer(update);
};

export default reducer;
