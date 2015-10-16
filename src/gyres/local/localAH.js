/**
 * localAH()
 *
 * @param {Object} store instance
 * @param {String} nameSpace state key
 * @param {Boolean} [debugMode] Whether to enable debugging
 * @returns {{addAction: Function, dispatch: Function}} API
 */
const localAH = (store, nameSpace, debugMode) => {
  // Private variables
  const actionMap = new Map();
  const stateHistory = [];

  // Public functions
  /**
   * addAction()
   *
   * @param {String} id Action ID
   * @param {Function} func Reducer function
   * @returns {void}
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
   * @param {String} id Id
   * @param {Array} args Function arguments
   * @returns {void}
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
   * @returns {Array} Full state history
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
