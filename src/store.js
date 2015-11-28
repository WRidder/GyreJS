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
  const getSelectorList = (ns) =>
    selectorList[ns] || (selectorList[ns] = []);

  /**
   * Send update to all registered selectors.
   *
   * @param {String} ns Namespace.
   * @param {Function} [scb] Specific callback to solely invoke.
   * @returns {Function} sendUpdate function for a namespace.
   */
  const sendUpdate = (ns, scb) => () => {
    const list = getSelectorList(ns);
    list.updateRequested = false;
    return scb
      ? scb(state.get(ns))
      : list.forEach(selector => selector(state.get(ns)));
  };

  /**
   * Request to issue update to filters of a given namespace.
   *
   * @param {String} ns Namespace.
   * @param {Function} [scb] Specific callback to solely invoke.
   * @returns {void}
   */
  const requestUpdate = (ns, scb) => {
    const nsList = getSelectorList(ns);
    if (!nsList.updateRequested) {
      nsList.updateRequested = true;
      nsList.ticker(sendUpdate(ns, scb));
    }
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
      selectorList[ns]
        .splice(selectorList[ns].indexOf(cb), 1);

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
      requestUpdate(ns);
    }
    return state;
  };

  // Public methods
  /**
   * addSelector() Register a selector with the store and send initial data.
   *
   * @param {String} ns Namespace.
   * @param {Function} cb callback.
   * @returns {Function} un-register function.
   */
  const addSelector = (ns, cb) => {
    // Save to local register
    getSelectorList(ns).push(cb);

    // Request update to make sure the new filter gets data asap.
    requestUpdate(ns, cb);

    // Return function to remove selector from store.
    return removeSelector(ns, cb);
  };

  /**
   * getState() returns the current state.
   *
   * @param {String} ns Namespace.
   * @returns {Immutable.Map} Current state
   */
  const getState = (ns) => state.has(ns) ? state.get(ns) : state;

  /**
   * setState()
   *
   * @param {Immutable.Map|Object} newState State.
   * @param {String} ns Namespace.
   * @returns {Immutable.Map} New state.
   */
  const setState = (newState, ns) => {
    if (typeof newState !== "object") {
      throw new Error("GyreJS (setState): New state should either be an object or an instance of Immutable.Map.");
    }

    return setNewState(Immutable.Map.isMap(newState) ? newState : Immutable.Map(newState), ns);
  };

  /**
   * Set tick function for a given namespace.
   *
   * The tick function is added as a property to the selector array for given namespace.
   *
   * @param {String} ns Namespace.
   * @param {Function} ticker Store update tick function for given namespace.
   * @returns {void}
   */
  const setTicker = (ns, ticker) => {
    if (typeof ticker !== "function") {
      throw new Error("GyreJS (setTicker): Ticker should be a function.");
    }

    getSelectorList(ns).ticker = ticker;
  };

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
    setTicker,
    update
  };
};

export default store;
