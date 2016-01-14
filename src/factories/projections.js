/**
 * Projection factory
 *
 * @param {Object} _internal Object with gyre internal instances.
 * @param {Function} reducer Object
 * @returns {{addSelector: Function, getState: Function, setState: Function, setTicker: Function, update: Function}} API
 */
const projectionFactory = (_internal, reducer = (state) => state) => {
  // Private variables
  let state;
  const listeners = [];
  listeners.ticker = (cb) => cb();
  listeners.updateRequested = false;

  const setInitialState = () => {
    state = reducer(void(0), {type: null});
    return state;
  };
  setInitialState();

  /**
   * Send update to all registered selectors.
   *
   * @param {Function} [scb] Specific callback to solely invoke.
   * @returns {Function} sendUpdate function for a namespace.
   */
  const sendUpdate = (scb) => () => {
    listeners.updateRequested = false;
    return scb
      ? scb(state)
      : listeners.forEach(listener => listener(state));
  };

  /**
   * Request to issue update to filters of a given namespace.
   *
   * @param {Function} [scb] Specific callback to solely invoke.
   * @returns {void}
   */
  const requestUpdate = (scb) => {
    if (!listeners.updateRequested) {
      listeners.updateRequested = true;
      listeners.ticker(sendUpdate(scb));
    }
  };

  /**
   * Remove selector from the store
   *
   * @param {Function} cb Selector callback.
   * @returns {Function} removal function.
   */
  const removeListener = (cb) =>
    () =>
      listeners
        .splice(listeners.indexOf(cb), 1);

  /**
   * Overwrite the current state in the store.
   * Use for setting an initial state or debugging.
   *
   * @param {Immutable.Map} newState New state.
   * @returns {Immutable.Map} state Current state
   */
  const setNewState = (newState) => {
    if (state !== newState) {
      state = newState;
      requestUpdate();
    }
    return state;
  };

  // Public methods
  /**
   * Register a selector with the store and send initial data.
   *
   * @param {Function} cb callback.
   * @returns {Function} un-register function.
   */
  const addListener = (cb) => {
    // Save to local register
    listeners.push(cb);

    // Request update to make sure the new filter gets data asap.
    requestUpdate(cb);

    // Return function to remove selector from store.
    return removeListener(cb);
  };

  /**
   * Set tick function for a given namespace.
   *
   * The tick function is added as a property to the selector array for given namespace.
   *
   * @param {Function} ticker Store update tick function for given namespace.
   * @returns {void}
   */
  const setTicker = (ticker) => {
    if (typeof ticker !== "function") {
      throw new Error("GyreJS (setTicker): Ticker should be a function.");
    }
    listeners.ticker = ticker;
  };

  /**
   * Applies a given reducer function to the state, which
   * is supposed to return a new Immutable state.
   * If nothing is returned, the original state is kept.
   *
   * @param {String} evt Event name.
   * @returns {Object} state New state.
   */
  const update = (evt) => {
    if (evt.type === "__RESET__") {
      return setNewState(reducer(void(0), evt));
    }
    return setNewState(reducer(state, evt));
  };

  /**
   *
   * @type {Function}
   */
  const destroy = ((removeProjectionFromBus) => (id) => {
    // Check if no more listeners are present on projection
    const lCount = listeners.length;
    if (lCount > 0) {
      console.warn(`>> GyreJS: (removeProjection) Projection with id:'${id}' connot be removed; still ${lCount} listeners attached;`); // eslint-disable-line no-console
      return false;
    }
    return removeProjectionFromBus() && true;
  })(_internal.bus.addProjection(update));

  return {
    addListener,
    destroy,
    setTicker,
    update
  };
};

export default projectionFactory;
