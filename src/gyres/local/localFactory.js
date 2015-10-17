import LocalAH from "./localAH";
import LocalReducer from "./localReducer";

// React components
import reactHoC from "./localReactHoC";

/**
 *  * localFactory()
 *
 * @param {Object} store Store instance
 * @param {String} NS Namespace
 * @param {Boolean} [debugMode] Debug mode switch
 * @returns {{addAction: Function, dispatch: Function, getHoC: Function, getStateHistory: Function, setState: Function}} API
 */
const localFactory = (store, NS, debugMode = false) => {
  const nameSpace = NS || "local";
  const AH = LocalAH(store, nameSpace, debugMode);

  // Public functions
  /**
   * Getter for reducer
   *
   * @param {String} matcher Matcher
   * @param {Function} cb Callback
   * @returns {Function} Reducer factory
   */
  const getReducer = (matcher, cb) =>
    LocalReducer(store, matcher, cb, nameSpace, debugMode);

  /**
   * setState()
   *
   * @param {Object|Immutable.Map} tState The state to set to this gyre.
   * @returns {Immutable.Map} Current store state.
   */
  const setState = (tState) =>
    store.setState(tState, nameSpace);

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

export default localFactory;
