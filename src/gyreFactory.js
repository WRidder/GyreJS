import ActionHandler from "./actionHandler";

/**
 * gyreFactory()
 *
 * @param {Function} Reducer Reducer factory.
 * @param {Function} ReactHoC React HoC factory.
 * @param {Function} [actions] Default actions object.
 * @param {Immutable.Map|Object} [state] Initial state object.
 * @returns {Function} Gyre factory function.
 */
const gyreFactory = (Reducer, ReactHoC, actions = () => {}, state = {}) =>
  (store, options) => {
    // Private variables
    const AH = ActionHandler(store, options);

    // Public functions
    /**
     * getReducer() Getter for reducer
     *
     * @param {String} matcher Matcher
     * @param {Function} cb Callback
     * @returns {Function} Reducer factory
     */
    const getReducer = (matcher, cb) =>
      Reducer(store, AH.dispatch, matcher, cb, options);

    /**
     * setState()
     *
     * @param {Object|Immutable.Map} tState The state to set to this gyre.
     * @returns {Immutable.Map} Current store state.
     */
    const setState = (tState) =>
      store.setState(tState, options.NS);

    /**
     * getState()
     *
     * @returns {Immutable.Map} Current store state.
     */
    const getState = () =>
      store.getState.get(options.NS);

    /**
     * reactHoC()
     *
     * @param {Object} react React instance.
     * @return {Function} HoC factory function.
     */
    const reactHoC = ReactHoC(getReducer);

    // Setup
    AH.addActions(actions(options));
    setState(state);

    // API
    return {
      addAction: AH.addAction,
      addActions: AH.addActions,
      dispatch: AH.dispatch,
      getState,
      getReducer,
      reactHoC,
      setState,
      use: AH.use
    };
  };

export default gyreFactory;
