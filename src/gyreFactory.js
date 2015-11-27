import ActionHandler from "./actionHandler";
import SelectorFactory from "./selectorFactory";
const defaultActions = () => ({});
const defaultTicker = (cb) => cb();

/**
 * Gyre Factory
 *
 * @param {Function} [actions] Default actions object.
 * @param {Function} [selectors] Default selectors object.
 * @param {Immutable.Map|Object} [state] Initial state object.
 * @param {Function} [ticker] Store update tick function.
 * @returns {Function} Gyre factory function.
 */
const gyreFactory = ({actions = defaultActions, selectors = {}, state = {}, ticker = defaultTicker} = {}) =>
  (store, options) => {
    // Private variables
    const API = {};
    const AH = ActionHandler(store, options);
    const selectorFactory = SelectorFactory(store, options, AH.dispatch);
    const selObj = {};

    // Public methods
    /**
     * Add a single action to gyre.
     *
     * @param {Array} args Arguments
     * @returns {Object} API Chainable gyre instance.
     */
    const addAction = (...args) => {
      AH.addAction(...args);
      return API;
    };

    /**
     * Add a multiple actions to gyre.
     *
     * @param {Array} args Arguments
     * @returns {Object} API Chainable gyre instance.
     */
    const addActions = (...args) => {
      AH.addActions(...args);
      return API;
    };

    /**
     * Add a selector factory function.
     *
     * @param {String} id Id
     * @param {Function} selector Selector factory function.
     * @param {boolean} [replace] Whether to overwrite any existing selector registered by the id.
     * @returns {Object} API Chainable gyre instance.
     */
    const addSelector = (id, selector, replace) => {
      if (!Object.prototype.hasOwnProperty.call(selObj, id) || replace) {
        selObj[id] = selector;
      }
      else {
        console.warn(`>> GyreJS-'${options.NS}'-gyre: AddFilter -> Selector with id: '${id}' already exists.`); // eslint-disable-line no-console
      }
      return API;
    };

    /**
     * Add multiple selectors.
     *
     * @param {Object} selectorsObj Key/func object of selector factory functions.
     * @param {boolean} [replace] Whether to overwrite any existing selector registered by the id.
     * @returns {Object} API Chainable gyre instance.
     */
    const addSelectors = (selectorsObj, replace) => {
      Object.keys(selectorsObj).forEach(selector => {
        addSelector(selector, selectorsObj[selector], replace);
      });
      return API;
    };

    /**
     * Selector factory.
     *
     * @param {Function|Object|String} sel Selector function, object or id.
     * @param {Function} cb Callback to invoke after selector update.
     * @param {Array} [args] Remaining arguments.
     * @returns {Function|void} Selector Un-subscribe function.
     */
    const createSelector = (sel, cb, ...args) => {
      if (typeof sel === "function" || typeof sel === "object") {
        return selectorFactory(sel, cb);
      }
      if (Object.prototype.hasOwnProperty.call(selObj, sel)) {
        return selectorFactory(selObj[sel](...args), cb);
      }
      console.warn(`>> GyreJS-'${options.NS}'-gyre: Unregistered selector requested: '${sel}' with arguments:`, args, "."); // eslint-disable-line no-console
    };

    /**
     * Dispatch a registered action.
     *
     * @param {Array} args Arguments
     * @returns {Object} API Chainable gyre instance.
     */
    const dispatch = (...args) => {
      AH.dispatch(...args);
      return API;
    };

    /**
     * Get the current gyre state.
     *
     * @returns {Immutable.Map} Current gyre store state.
     */
    const getState = () =>
      store.getState(options.NS);

    /**
     * Set the gyre state. Overwrites the current state.
     *
     * @param {Object|Immutable.Map} tState The state to set to this gyre.
     * @returns {Object} API Chainable gyre instance.
     */
    const setState = (tState) => {
      store.setState(tState, options.NS);
      return API;
    };

    /**
     * Set store tick function for this gyre.
     *
     * @param {Function} tickFunc Tick function. E.g. (cb) => setTimeout(() => cb(), 0).
     * @returns {Object} API Chainable gyre instance.
     */
    const setTicker = (tickFunc) => {
      store.setTicker(options.NS, tickFunc);
      return API;
    };

    /**
     * Add middleware to dispatcher
     *
     * @param {Array} args Arguments
     * @returns {Object} API Chainable gyre instance.
     */
    const use = (...args) => {
      AH.use(...args);
      return API;
    };

    // Setup
    addActions(actions(options));
    addSelectors(selectors);
    setTicker(ticker);
    setState(state);

    // Gyre API
    return Object.assign(API, {
      addAction,
      addActions,
      addSelector,
      addSelectors,
      createSelector,
      dispatch,
      getState,
      nameSpace: options.NS,
      setState,
      setTicker,
      use
    });
  };

export default gyreFactory;
