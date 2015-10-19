import ActionHandler from "./actionHandler";

/**
 * gyreFactory()
 *
 * @param {String} defaultNS Default namespace name.
 * @param {Function} Reducer Reducer factory.
 * @param {Function} ReactHoC React HoC factory.
 * @param {Object} [actions] Default actions object.
 * @param {Immutable.Map} [state] Initial state object.
 * @returns {Function} Gyre factory function.
 */
const gyreFactory = (defaultNS, Reducer, ReactHoC, actions, state) => (store, NS) => {
  // Private variables
  const nameSpace = NS || defaultNS;
  const AH = ActionHandler(store, nameSpace);

  // Public functions
  /**
   * getReducer() Getter for reducer
   *
   * @param {String} matcher Matcher
   * @param {Function} cb Callback
   * @returns {Function} Reducer factory
   */
  const getReducer = (matcher, cb) =>
    Reducer(store, AH.dispatch, matcher, cb, nameSpace);

  /**
   * setState()
   *
   * @param {Object|Immutable.Map} tState The state to set to this gyre.
   * @returns {Immutable.Map} Current store state.
   */
  const setState = (tState) =>
    store.setState(tState, nameSpace);

  /**
   * reactHoC()
   *
   * @param {Object} react React instance.
   * @return {Function} HoC factory function.
   */
  const reactHoC = ReactHoC(getReducer);

  // Setup
  if (actions) {
    console.log("add actions", actions);
    AH.addActions(actions);
  }
  if (state) {
    setState(state);
  }

  // API
  return {
    addAction: AH.addAction,
    addActions: AH.addActions,
    dispatch: AH.dispatch,
    getReducer,
    reactHoC,
    setState,
    use: AH.use
  };
};

export default gyreFactory;
