import ActionHandler from "./actionHandler";
const defaultActions = () => ({});
/**
 * gyreFactory()
 *
 * @param {Function} [actions] Default actions object.
 * @param {Function} filters Reducer factory.
 * @param {Immutable.Map|Object} [state] Initial state object.
 * @returns {Function} Gyre factory function.
 */
const gyreFactory = ({actions = defaultActions, filters = {}, state = {}}) =>
  (store, options) => {
    // Private variables
    const AH = ActionHandler(store, options);

    // Public functions
    /**
     * getFilter() Getter for reducer
     *
     * @param {*} id Id
     * @param {Function} cb Callback
     * @param {Array} [args] Remaining arguments.
     * @returns {Function|void} Filter factory
     */
    const getFilter = (id, cb, ...args) => {
      if (Object.prototype.hasOwnProperty.call(filters, id)) {
        return filters[id](store, AH.dispatch, cb, options, ...args);
      }
      console.warn(`>> GyreJS-'${options.NS}'-gyre: Unregistered filter requested: '${id}' with arguments:`, args, "."); // eslint-disable-line no-console
    };


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
      store.getState().get(options.NS);

    // Setup
    AH.addActions(actions(options));
    setState(state);

    // API
    return {
      addAction: AH.addAction,
      addActions: AH.addActions,
      dispatch: AH.dispatch,
      getState,
      getFilter,
      nameSpace: options.NS,
      setState,
      use: AH.use
    };
  };

export default gyreFactory;
