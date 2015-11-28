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

  // Private methods
  /**
   * Creates a higher order function to wrap the final action with any present middleware.
   * Adds a custom method 'dispatch' to the middleWare array.
   *
   * @param {Function} dp Dispatch function.
   * @returns {void}
   */
  const wrapDispatchMiddleware = (dp) => {
    // Invoke all registered middleWare before running the final action.
    // First call functions which have been added first.
    middleWare.dispatch = (id, args) =>
      middleWare.reduce((nextToCall, firstToCall) =>
          () => firstToCall(options.NS, id, args, nextToCall, dp),
        () => actionMap.get(id)(args.push(dp) && args))();
  };

  // Public methods
  /**
   * Dispatch a registered action by ID.
   * Uses a custom method 'dispatch' in the middleWare array created by parseMiddleware().
   *
   * @param {String|Object} action Id or FSA (Flux standard action). See: https://github.com/acdlite/flux-standard-action.
   * @param {Array} [args] Function arguments.
   * @returns {void}
   */
  const dispatch = (action, ...args) => {
    let payload = args;

    // Support FSA type actions. Use basic ducktyping to detect if the
    // provided action may be a FSA.
    if (typeof action === "object" && Object.prototype.hasOwnProperty.call(action, "type")) {
      payload = [action.payload];
      action = action.type;
    }

    // Dispatch action if the id is present in the action map.
    if (actionMap.has(action)) {
      middleWare.dispatch(action, payload);
    }
    else {
      console.warn(`>> GyreJS-'${options.NS}'-gyre: Unregistered action dispatched: '${action}' with arguments:`, payload, ". (This is a no-op)"); // eslint-disable-line no-console
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
    if (typeof id !== "string") {
      throw new Error("GyreJS (addAction): first argument (id) should be a string.");
    }
    if (typeof func !== "function") {
      throw new Error("GyreJS (addAction): second argument (reducer) should be a function.");
    }

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
    if (typeof actions !== "object") {
      throw new Error("GyreJS (addActions): first argument (actions object) should be an object.");
    }

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
    if (typeof mware !== "function") {
      throw new Error("GyreJS (use): first argument should be a function.");
    }

    middleWare.unshift(mware);
    wrapDispatchMiddleware(dispatch);
  };

  // Setup
  wrapDispatchMiddleware(dispatch);

  // API
  return {
    addAction,
    addActions,
    dispatch,
    use
  };
};

export default actionHandler;
