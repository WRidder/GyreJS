import Immutable from "immutable";

/**
 * Store factory function
 *
 * @returns {{addSelector: Function, getState: Function, setState: Function, updateState: Function}} Store API
 */
const store = () => {
  // Private variables
  let state = Immutable.Map({});
  const selectorList = {};

  // Private methods
  /**
   * Send update to all registered selectors.
   *
   * @returns {void}
   */
  const sendUpdate = () => {
    Object.keys(selectorList).forEach(ns =>
      (selectorList[ns] || []).forEach(selector =>
        selector(ns === "all" ? state : state.get(ns)))
    );
  };

  /**
   * Remove selector from the store
   *
   * @param {String} ns Namespace.
   * @param {Function} cb Selector callback.
   * @returns {Function} removal function.
   */
  const removeSelector = (ns, cb) =>
    () =>
      selectorList[ns] = selectorList[ns]
        .filter(selector => selector !== cb);

  /**
   * Overwrite the current state in the store.
   * Use for setting an initial state or debugging.
   *
   * @param {Immutable.Map} newState New state.
   * @param {String} ns Namespace.
   * @returns {Immutable.Map} state Current state
   */
  const setNewState = (newState, ns) => {
    if (state.get(ns) !== newState) {
      state = state.set(ns, newState);
      sendUpdate(ns);
    }
    return state;
  };

  // Public methods
  /**
   * addSelector() Register a selector with the store and send initial data.
   *
   * @param {Function} cb callback.
   * @param {String} [ns] Namespace.
   * @returns {Function} un-register function.
   */
  const addSelector = (cb, ns = "all") => {
    if (!selectorList[ns]) {
      selectorList[ns] = [];
    }

    // Save to local register
    selectorList[ns].push(cb);

    // Request update to make sure the new filter gets data asap.
    cb(ns === "all" ? state : state.get(ns));

    // Return remover
    return removeSelector(ns, cb);
  };

  /**
   * getState() returns the current state.
   *
   * @returns {Immutable.Map} Current state
   */
  const getState = () => state;

  /**
   * setState()
   *
   * @param {Immutable.Map|Object} newState State.
   * @param {String} ns Namespace.
   * @returns {Immutable.Map} New state.
   */
  const setState = (newState, ns) =>
    setNewState(Immutable.Map.isMap(newState) ?
        newState :
        Immutable.Map(newState),
      ns);

  /**
   * Applies a given reducer function to the state, which
   * is supposed to return a new Immutable state.
   * If nothing is returned, the original state is kept.
   *
   * @param {String} ns Namespace.
   * @param {Function} func Reducer function.
   * @param {Array} args Reducer function arguments.
   * @returns {Immutable.Map} state New state.
   */
  const update = (ns, func, args) =>
    setNewState(func(...[state.get(ns)].concat(args)) || state.get(ns), ns);

  // API
  return {
    addSelector,
    getState,
    setState,
    update
  };
};

export default store;
