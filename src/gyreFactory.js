import ActionHandler from "./actionHandler";
import SelectorFactory from "./selectorFactory";
const defaultActions = () => ({});

/**
 * Gyre Factory
 *
 * @param {Function} [actions] Default actions object.
 * @param {Function} selectors Default selectors object.
 * @param {Immutable.Map|Object} [state] Initial state object.
 * @returns {Function} Gyre factory function.
 */
const gyreFactory = ({actions = defaultActions, selectors = {}, state = {}} = {}) =>
  (store, options) => {
    // Private variables
    const AH = ActionHandler(store, options);
    const selectorFactory = SelectorFactory(store, options, AH.dispatch);
    const selObj = {};

    // Public methods
    /**
     * Add a selector factory function.
     *
     * @param {String} id Id
     * @param {Function} selector Selector factory function.
     * @param {boolean} [replace] Whether to overwrite any existing selector registered by the id.
     * @returns {void}
     */
    const addSelector = (id, selector, replace) => {
      if (!Object.prototype.hasOwnProperty.call(selObj, id) || replace) {
        selObj[id] = selector;
      }
      else {
        console.warn(`>> GyreJS-'${options.NS}'-gyre: AddFilter -> Selector with id: '${id}' already exists.`); // eslint-disable-line no-console
      }
    };

    /**
     * Add multiple selectors.
     *
     * @param {Object} selectorsObj Key/func object of selector factory functions.
     * @param {boolean} [replace] Whether to overwrite any existing selector registered by the id.
     * @returns {void}
     */
    const addSelectors = (selectorsObj, replace) => {
      Object.keys(selectorsObj).forEach(selector => {
        addSelector(selector, selectorsObj[selector], replace);
      });
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
     * Set the gyre state. Overwrites the current state.
     *
     * @param {Object|Immutable.Map} tState The state to set to this gyre.
     * @returns {Immutable.Map} Current store state.
     */
    const setState = (tState) =>
      store.setState(tState, options.NS);

    /**
     * Get the current gyre state.
     *
     * @returns {Immutable.Map} Current gyre store state.
     */
    const getState = () =>
      store.getState().get(options.NS);

    // Setup
    AH.addActions(actions(options));
    addSelectors(selectors);
    setState(state);

    // Gyre API
    return {
      addAction: AH.addAction,
      addActions: AH.addActions,
      addSelector,
      addSelectors,
      createSelector,
      dispatch: AH.dispatch,
      getState,
      nameSpace: options.NS,
      setState,
      use: AH.use
    };
  };

export default gyreFactory;
