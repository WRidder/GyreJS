// Import sub libraries
import Store from "./store";
import createGyreFactory from "./gyreFactory";

// Private variables
const gyres = new Map();
const store = Store();

// Public functions
/**
 * Create a new gyre instance. Based on a factory function by id.
 *
 * @param {String} id Id of a registered gyre factory.
 * @param {Object} [options] Options object for gyre.
 * @returns {Object} Gyre instance.
 */
const createGyre = (id, options) => {
  if (!gyres.has(id)) {
    console.warn(`>> GyreJS: Error on create - Gyre factory '${id}' not registered.`); // eslint-disable-line no-console
  }

  // Generate a unique namespace.
  const NS = `${id}-${Date.now()}`;
  store.setState({}, NS);

  // Return gyre instance object.
  return gyres.get(id)(store, Object.assign({}, options, {NS: NS}));
};

/**
 * Register a gyre factory function.
 *
 * @param {String} id Id of to register gyre.
 * @param {Function} factory Gyre factory function.
 * @returns {void}
 */
const registerGyreFactory = (id, factory) => {
  gyres.set(id, factory);
};

/**
 * Un-register a gyre factory function.
 *
 * @param {String} id Id of a registered gyre factory.
 * @returns {boolean} Whether the factory has been un-registered.
 */
const unRegisterGyreFactory = (id) => {
  if (!gyres.has(id)) {
    console.warn(`>> GyreJS: Error on unregister - Gyre factory '${id}' not registered.`); // eslint-disable-line no-console
    return false;
  }
  return gyres.delete(id) && true;
};

export default {
  createGyre,
  registerGyreFactory,
  unRegisterGyreFactory,
  createGyreFactory
};
