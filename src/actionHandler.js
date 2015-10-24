/**
 * actionHandler()
 *
 * @param {Object} store instance.
 * @param {Object} options Options object.
 * @returns {{addAction: Function, dispatch: Function}} API.
 */
const actionHandler = (store, options) => {
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
      // Invoke all registered middleWare before running the final action.
      middleWare.reduce((prev, next) =>
          () => next(options.NS, id, args, prev, dispatch),
        () => actionMap.get(id)(args))();
    }
    else {
      console.warn(`>> GyreJS-'${options.NS}'-gyre: Unregistered action dispatched: '${id}' with arguments:`,
        args, ". (This is a no-op)");
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
      store.updateState(options.NS, func, args, passDispatch ? dispatch : null);
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

export default actionHandler;
