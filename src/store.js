import Immutable from "immutable";

/**
 * Store() Factory function
 *
 * @returns {{addFilter: Function, getState: Function, setState: Function, updateState: Function}} API
 */
const store = () => {
  // Private variables
  let state = Immutable.Map({});
  const filterList = {};
  const updateQueue = new Set();

  // Private functions
  /**
   * Send update to all registered reducers
   *
   * @returns {void}
   */
  const sendUpdate = () => {
    updateQueue.forEach(ns =>
      (filterList[ns] || []).forEach(filter =>
        filter(ns === "all" ? state : state.get(ns)))
    );
    updateQueue.clear();
  };

  /**
   * Request to issue update to filters of a given namespace.
   *
   * @param {String} ns Namespace.
   * @returns {void}
   */
  const requestUpdate = (ns) => {
    if (!updateQueue.size) {
      requestAnimationFrame(sendUpdate);
    }
    updateQueue.add("all").add(ns);
  };

  /**
   * removeFilter() - Factory
   * Remove filter from the store
   *
   * @param {String} ns Namespace.
   * @param {Function} cb Filter callback.
   * @returns {Function} removal function.
   */
  const removeFilter = (ns, cb) =>
    () =>
      filterList[ns] = filterList[ns]
        .filter(filter => filter !== cb);

  /**
   * setState() Overwrite the current state in the store.
   * Use for setting an initial state or debugging.
   *
   * @param {Immutable.Map} newState New state.
   * @param {String} ns Namespace.
   * @returns {Immutable.Map} state Current state
   */
  const setNewState = (newState, ns) => {
    if (state.get(ns) !== newState) {
      state = state.set(ns, newState);
      requestUpdate(ns);
    }
    return state;
  };

  // Public functions
  /**
   * addFilter() Register a faucet with the store and send initial data.
   *
   * @param {Function} cb callback.
   * @param {String} [ns] Namespace.
   * @returns {Function} un-register function.
   */
  const addFilter = (cb, ns = "all") => {
    if (!filterList[ns]) {
      filterList[ns] = [];
    }

    // Save to local register
    filterList[ns].push(cb);

    // Request update to make sure the new filter gets data asap.
    requestUpdate(ns);

    // Return remover
    return removeFilter(ns, cb);
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
   * updateState() applies a given reducer function to the state, which
   * is supposed to return a new Immutable state.
   *
   * @param {String} ns Namespace.
   * @param {Function} func Reducer function.
   * @param {Array} args Reducer function arguments.
   * @returns {Immutable.Map} state New state.
   */
  const updateState = (ns, func, args) =>
    setNewState(func(...[state.get(ns)].concat(args)) || state.get(ns), ns);

  // API
  return {
    addFilter,
    getState,
    setState,
    updateState
  };
};

export default store;
