import Immutable from "immutable";
const IMap = Immutable.Map;

/**
 * Store() Factory function
 *
 * @returns {{addReducer: Function, getState: Function, setState: Function, updateState: Function}} API
 */
const store = () => {
  // Private variables
  let state = IMap({});
  let reducerList = [];

  // Private functions
  /**
   * Send update to all registered reducers
   *
   * @returns {void}
   */
  const sendUpdate = () =>
    reducerList.forEach(reducer => reducer(state));

  /**
   * removeReducer() - Factory
   * Remove reducer from the store
   *
   * @param {Function} cb Reducer callback.
   * @returns {Function} removal function.
   */
  const removeReducer = (cb) =>
    () =>
      reducerList = reducerList.filter(reducer => reducer !== cb);

  /**
   * setState() Overwrite the current state in the store.
   * Use for setting an initial state or debugging.
   *
   * @param {Immutable.Map} newState New state.
   * @param {String} nameSpace Namespace.
   * @returns {Immutable.Map} state Current state
   */
  const setNewState = (newState, nameSpace) => {
    state = state.set(nameSpace, newState);
    sendUpdate();
    return state;
  };

  // Public functions
  /**
   * Register a faucet with the store and send initial data.
   *
   * @param {Function} cb callback.
   * @returns {Function} un-register function.
   */
  const addReducer = (cb) => {
    // Save to local register
    reducerList.push(cb);

    // Send state to reducer
    cb(state);

    // Return remover
    return removeReducer(cb);
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
  const setState = (nState, nameSpace) =>
    setNewState(IMap.isMap(nState) ? nState : IMap(nState), nameSpace);

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
    setNewState(func(...farg.concat(args)) || state.get(nameSpace), nameSpace);
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
