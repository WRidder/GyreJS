/**
 * localAH()
 *
 * @param {Object} store
 * @param {String} nameSpace
 * @param {Boolean} [debugMode]
 * @returns {{addAction: Function, dispatch: Function}}
 */
const localAH = (store, nameSpace, debugMode) => {
  // Private variables
  const actionMap = new Map();
  let stateHistory = [];

  // Public functions
  /**
   * addAction()
   *
   * @param id
   * @param func
   */
  const addAction = (id, func) => {
    actionMap.set(id, (args) => {
      const newState = store.updateState(nameSpace, func, args, id);
      if (debugMode) {
        stateHistory.push(newState);
        console.log(`>> GyreJS-'${nameSpace}'-store: Applying action '${id}'`, args, func);
      }
    });
  };

  /**
   * dispatch()
   *
   * @param id
   * @param args
   */
  const dispatch = (id, ...args) => {
    if (actionMap.has(id)) {
      actionMap.get(id)(args);
    }
    else {
      console.warn(`GyreJS-AH: Unregistered action requested: '${id}' with arguments:`, args);
    }
  };

  /**
   * getStateList() returns the state list.
   *
   * @returns {Array}
   */
  const getStateHistory = () => {
    return stateHistory;
  };

  // API
  return {
    addAction,
    dispatch,
    getStateHistory
  };
};

export default localAH;
