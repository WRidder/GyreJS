/**
 * reducer()
 *
 * @param {Object} store Store instance
 * @param {Function} dispatch Dispatch
 * @param {Array|String} matcher Matcher
 * @param {Function} cb Callback
 * @param {Object} options Options object.
 * @returns {Function} Un-register function
 */
const reducer = (store, dispatch, matcher, cb, options) => {
  // Private functions
  const update = (stateVar) => {
    const state = stateVar.get(options.NS);
    const matchValue = Array.isArray(matcher) ? matcher : [matcher];

    if (state) {
      cb(matchValue.reduce((memo, val) => {
        memo[val] = state.get(val);
        return memo;
      }, {}));
    }
    else {
      cb(void(0));
    }
  };

  // Return the un-register function right away.
  return store.addReducer(update);
};

export default reducer;
