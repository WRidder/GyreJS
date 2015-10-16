import Immutable from "immutable";
const IMap = Immutable.Map;

/**
 * Store() Factory function
 *
 * @returns {{addReducer: Function, getState: Function, setState: Function, updateState: Function}}
 */
const store = () => {
  let state = IMap({});

  // Private variables
  let rId = 0;
  const reducerMap = new Map();

  // Private functions
  /**
   * Send update to all registered reducers
   */
  const sendUpdate = () => {
    reducerMap.forEach((reducer) => {
      reducer(state);
    });
  };

  /**
   * removeReducer() - Factory
   * Remove reducer from the store
   * @param {Number} id Reducer Id
   * @returns {Function} removal function.
   */
  const removeReducer = (id) => {
    return () => {
      reducerMap.delete(id);
    };
  };

  /**
   * setState() Overwrite the current state in the store.
   * Use for setting an initial state or debugging.
   *
   * @param {Immutable.Map|Object} newState
   * @param {String} [nameSpace]
   * @returns {Immutable.Map} state
   */
  const setNewState = (newState, nameSpace) => {
    newState = IMap.isMap(newState) ? newState : IMap(newState);
    state = nameSpace ? state.set(nameSpace, newState) : newState;
    sendUpdate();
    return state;
  };

  // Public functions
  /**
   * Register a faucet with the store and send initial data.
   * @param cb
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
   * @returns {Immutable.Map}
   */
  const getState = () => {
    return state;
  };

  /**
   * setState()
   *
   * @param {Immutable.Map|Object} newState
   * @param {String} [nameSpace]
   * @returns {Immutable.Map}
   */
  const setState = (newState, nameSpace) => {
    return setNewState(newState, nameSpace);
  };

  /**
   * updateState() applies a given reducer function to the state, which
   * is supposed to return a new Immutable state.
   *
   * @param {String} nameSpace
   * @param {Function} func
   * @param {Array} args
   * @returns {Immutable.Map} state
   */
  const updateState = (nameSpace, func, args) => {
    setNewState(func(state.get(nameSpace) || IMap({}), ...args), nameSpace);
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
