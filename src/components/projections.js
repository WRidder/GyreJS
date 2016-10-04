/**
 * Projection factory
 *
 * @param {Object} _internal Object with gyre internal instances.
 * @param {Function} reducer Object
 * @param {Function} notifyStateUpdate Listener update callback.
 * @param {String} id Id of the projection.
 * @returns {{addSelector: Function, getState: Function, setState: Function, setTicker: Function, update: Function}} API
 */
const projectionFactory = (_internal, reducer, notifyStateUpdate, id) => {
  // Private variables
  let state = reducer.initialValue();

  /**
   * Overwrite the current state in the store.
   *
   * @param {*} newState New state.
   * @returns {void}
   */
  const setNewState = (newState, evt) => {
    if (state !== newState) {
      state = newState;
      notifyStateUpdate(state);
    }
    if (ENV.dev) {
      if (state === newState) {
        if (_internal.options.dev.warnings.eventDidNotUpdateProjection) {
          console.warn(`GyreJS: State of projection '${id}' was not altered by event '${evt.type}'. Consider optimizing if possible.`);
        }
      }
    }
  };

  // Public methods
  /**
   * Applies a given reducer function to the state, which
   * is supposed to return a new immutable state.
   * If nothing is returned, the original state is kept.
   *
   * @param {String} evt Event name.
   * @returns {void}
   */
  const update = (evt) => setNewState(reducer.applyEvent(state, evt), evt);

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
