/**
 * localAH()
 *
 * @param {Object} store instance.
 * @param {String} nameSpace state key.
 * @returns {{addAction: Function, dispatch: Function}} API.
 */
const localAH = (store, nameSpace) => {
  // Private variables
  const actionMap = new Map();
  const middleWare = [];

  // Public functions
  /**
   * addAction()
   *
   * @param {String} id Action ID.
   * @param {Function} func Reducer function.
   * @returns {void}
   */
  const addAction = (id, func) =>
    actionMap.set(id, (args) => {
      store.updateState(nameSpace, func, args, id);
    });

  /**
   * addActions()
   *
   * @param {Object} actions Key/func object of actions.
   * @returns {void}
   */
  const addActions = (actions) => {
    Object.keys(actions).forEach(action => {
      addAction(action, actions[action]);
    });
  };

  /**
   * dispatch()
   *
   * @param {String} id Id
   * @param {Array} args Function arguments.
   * @returns {void}
   */
  const dispatch = (id, ...args) => {
    if (actionMap.has(id)) {
      middleWare.reduce((prev, next) =>
        () => next(nameSpace, id, args, prev),
          () => actionMap.get(id)(args))();
    }
    else {
      console.warn(`GyreJS-'${nameSpace}'-AH: Unregistered action requested: '${id}' with arguments:`, args);
    }
  };

  /**
   * use()
   *
   * @param {Function} mware Middleware function.
   * @returns {void}
   */
  const use = (mware) => {
    middleWare.unshift(mware);
  };

  // API
  return {
    addAction,
    addActions,
    dispatch,
    use
  };
};

export default localAH;
