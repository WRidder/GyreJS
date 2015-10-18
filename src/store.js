import Immutable from "immutable";
const IMap = Immutable.Map;

/**
 * Store() Factory function
 *
 * @returns {{addReducer: Function, getState: Function, setState: Function, updateState: Function}} API
 */
const store = () => {
  let state = IMap({});

  // Private variables
  let rId = 0;
  const reducerMap = new Map();

  // Private functions
  /**
   * Send update to all registered reducers
   *
   * @returns {void}
   */
  const sendUpdate = () =>
    reducerMap.forEach(reducer => reducer(state));

  /**
   * removeReducer() - Factory
   * Remove reducer from the store
   *
   * @param {Number} id Reducer Id
   * @returns {Function} removal function.
   */
  const removeReducer = (id) => () => reducerMap.delete(id);

  /**
   * setState() Overwrite the current state in the store.
   * Use for setting an initial state or debugging.
   *
   * @param {Immutable.Map|Object} newState New state
   * @param {String} [nameSpace] Namespace
   * @returns {Immutable.Map} state Current state
   */
  const setNewState = (newState, nameSpace) => {
    const tState = IMap.isMap(newState) ? newState : IMap(newState);
    state = nameSpace ? state.set(nameSpace, tState) : tState;
    sendUpdate();
    return state;
  };

  // Public functions
  /**
   * Register a faucet with the store and send initial data.
   *
   * @param {Function} cb callback
   * @returns {Function} un-register function
   */
  const addReducer = (cb) => {
    const id = rId++;

    // Save to local register
    reducerMap.set(id, cb);

    // Send state to reducer
    cb(state);

    // Return remover
    return removeReducer(id);
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
   * @param {Immutable.Map|Object} nState State.
   * @param {String} [nameSpace] Namespace.
   * @returns {Immutable.Map} New state.
   */
  const setState = (nState, nameSpace) => setNewState(nState, nameSpace);

  /**
   * updateState() applies a given reducer function to the state, which
   * is supposed to return a new Immutable state.
   *
   * @param {String} nameSpace Namespace.
   * @param {Function} func Reducer function.
   * @param {Array} args Reducer function arguments.
   * @param {Function} [dispatch] Dispatcher function.
   * @returns {Immutable.Map} state New state.
   */
  const updateState = (nameSpace, func, args, dispatch) => {
    var farg = [state.get(nameSpace) || IMap({})];
    if (dispatch) {
      farg.concat(dispatch);
    }
    setNewState(func(...farg.concat(args)), nameSpace);
    return state;
  };

  // API
  return {
    addReducer,
    getState,
    setState,
    updateState
  };
};

export default store;
