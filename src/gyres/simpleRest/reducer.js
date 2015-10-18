/**
 * reducer()
 *
 * @param {Object} store Store instance
 * @param {Array|String} matcher Matcher
 * @param {Function} cb Callback
 * @param {String} nameSpace Namespace
 * @returns {Function} Un-register function
 */
const reducer = (store, matcher, cb, nameSpace) => {
  // Private functions
  const update = (stateVar) => {
    const state = stateVar.get(nameSpace);
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
