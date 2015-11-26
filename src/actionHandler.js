/**
 * Action creator and dispatcher.
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
   * Dispatch a registered action by ID.
   *
   * @param {String} id Id
   * @param {Array} args Function arguments.
   * @returns {void}
   */
  const dispatch = (id, ...args) => {
    if (actionMap.has(id)) {
      // Invoke all registered middleWare before running the final action.
      // First call functions which have been added first.
      middleWare.reduce((nextToCall, firstToCall) =>
          () => firstToCall(options.NS, id, args, nextToCall, dispatch),
        () => actionMap.get(id)(args.push(dispatch) && args))();
    }
    else {
      console.warn(`>> GyreJS-'${options.NS}'-gyre: Unregistered action dispatched: '${id}' with arguments:`, args, ". (This is a no-op)"); // eslint-disable-line no-console
    }
  };

  /**
   * Add a single action.
   *
   * @param {String} id Action ID.
   * @param {Function} func Reducer function.
   * the actions.
   * @returns {void}
   */
  const addAction = (id, func) => {
    actionMap.set(id, (args) =>
        store.update(options.NS, func, args)
    );
  };

  /**
   * Add multiple actions.
   *
   * @param {Object} actions Key/func object of actions.
   * the actions.
   * @returns {void}
   */
  const addActions = (actions) => {
    Object.keys(actions).forEach(action => {
      addAction(action, actions[action]);
    });
  };

  /**
   * Apply middleware. Middleware is called in the order in which it's added.
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
