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
  let state = reducer.initialValue();

  /**
   * Overwrite the current state in the store.
   * Use for setting an initial state or debugging.
   *
   * @param {*} newState New state.
   * @returns {*} state Current state
   */
  const setNewState = (newState) => {
    state = newState;
    notifyStateUpdate(state);
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
  const update = (evt) => setNewState(reducer.applyEvent(state, evt));

  /**
   *
   * @type {Function}
   */
  const destroy = ((removeProjectionFromBus) => () =>
    removeProjectionFromBus() && true
  )(_internal.bus.addProjection(update, true));

  return {
    destroy,
    update,
    getState: () => state
  };
};

export default projectionFactory;
