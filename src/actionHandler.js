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
   * addAction()
   *
   * @param {String} id Action ID.
   * @param {Function} func Reducer function.
   * @param {Boolean} passDispatch Whether to pass the dispatch method to
   * the actions.
   * @returns {void}
   */
  const addAction = (id, func, passDispatch) =>
    actionMap.set(id, (args) => {
      store.updateState(nameSpace, func, args, passDispatch ? dispatch : null);
    });

  /**
   * addActions()
   *
   * @param {Object} actions Key/func object of actions.
   * @param {Boolean} passDispatch Whether to pass the dispatch method to
   * the actions.
   * @returns {void}
   */
  const addActions = (actions, passDispatch) => {
    Object.keys(actions).forEach(action => {
      addAction(action, actions[action], passDispatch);
    });
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
