/**
 * Projection factory
 *
 * @param {Object} _internal Object with gyre internal instances.
 * @param {Function} reducer Object
 * @param {Function} notifyStateUpdate Listener update callback.
 * @returns {{addSelector: Function, getState: Function, setState: Function, setTicker: Function, update: Function}} API
 */
const projectionFactory = (_internal, reducer, notifyStateUpdate) => {
  // Private variables
  let state = typeof reducer === "function" ? reducer(void(0), {type: null}) : reducer.initialState;

  /**
   * Overwrite the current state in the store.
   * Use for setting an initial state or debugging.
   *
   * @param {*} newState New state.
   * @returns {*} state Current state
   */
  const setNewState = (newState) => {
    if (state !== newState) {
      state = newState;
      notifyStateUpdate();
    }
  };

  // Public methods
  /**
   * Applies a given reducer function to the state, which
   * is supposed to return a new Immutable state.
   * If nothing is returned, the original state is kept.
   *
   * @param {String} evt Event name.
   * @returns {Object} state New state.
   */
  const update = (() =>
    (typeof reducer === "function") ?
      (evt) => setNewState(reducer(evt.type === "__RESET__" ? void(0) : state, evt)) :
      (evt) => (evt.type === "__RESET__") ?
        setNewState(reducer.initialState) :
        setNewState(typeof reducer.events[evt.type] === "function" ? reducer.events[evt.type](state, evt) : state))();

  /**
   *
   * @type {Function}
   */
  const destroy = ((removeProjectionFromBus) => () => {
    return removeProjectionFromBus() && true;
  })(_internal.bus.addProjection(update));

  return Object.freeze({
    destroy,
    update,
    getState: () => state
  });
};

export default projectionFactory;
