// Import sub libraries
import Store from "./store";
import createGyreFactory from "./gyreFactory";

// Private variables
let gyres;
let store;

// Private methods
/**
 * Get store singleton
 *
 * @returns {Store} Store singleton.
 */
const getStore = () => store || (store = Store());

/**
 * Get gyre map
 *
 * @returns {Map} Gyre map.
 */
const getGyres = () => gyres || (gyres = new Map());

// Public functions
/**
 * Create a new gyre instance. Based on a factory function by id.
 *
 * @param {String} id Id of a registered gyre factory.
 * @param {Object} [options] Options object for gyre.
 * @returns {Object|void} Gyre instance.
 */
const createGyre = (id, options) => {
  if (getGyres().has(id)) {
    // Return gyre instance object with a unique namespace.
    return getGyres().get(id)(getStore(), Object.assign({}, options, {NS: `${id}-${Date.now()}`}));
  }
  console.warn(`>> GyreJS: Error on create - Gyre factory '${id}' not registered.`); // eslint-disable-line no-console
};

/**
 * Register a gyre factory function.
 *
 * @param {String} id Id of to register gyre.
 * @param {Function} factory Gyre factory function.
 * @returns {void}
 */
const registerGyreFactory = (id, factory) => {
  getGyres().set(id, factory);
};

/**
 * Un-register a gyre factory function.
 *
 * @param {String} id Id of a registered gyre factory.
 * @returns {boolean} Whether the factory has been un-registered.
 */
const unRegisterGyreFactory = (id) => {
  if (!getGyres().has(id)) {
    console.warn(`>> GyreJS: Error on unregister - Gyre factory '${id}' not registered.`); // eslint-disable-line no-console
    return false;
  }
  return getGyres().delete(id) && true;
};

export default {
  createGyre,
  registerGyreFactory,
  unRegisterGyreFactory,
  createGyreFactory
};
