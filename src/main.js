import Store from "./store";
import createGyreFactory from "./gyreFactory";

// Private variables
const API = {};

// Private methods
/**
 * Get store singleton.
 * Store is instantiated on first use instead of on library load.
 *
 * @returns {Store} Store singleton.
 */
const getStore = (() => {
  let store;
  return () => store || (store = Store());
})();

/**
 * Get registered gyres object singleton.
 * Gyres object is created on first use instead of on library load.
 *
 * @returns {Object} Gyres object.
 */
const getGyres = (() => {
  let gyres;
  return () => gyres || (gyres = { "empty": createGyreFactory() });
})();

// Public functions
/**
 * Create a new gyre instance. Based on a factory function by id.
 * If no id is provided, an empty gyre instance will be returned.
 *
 * @param {String} [id] Id of a registered gyre factory.
 * @param {Object} [options] Options object for gyre.
 * @returns {Object|void} Gyre instance.
 */
const createGyre = (id = "empty", options = {}) => {
  if (!getGyres.hasOwnProperty(id)) {
    // Return gyre instance object with a unique namespace.
    return getGyres()[id](getStore(), Object.assign({}, options, {NS: `${id}-${Date.now()}`}));
  }
  console.warn(`>> GyreJS: Error on create - Gyre factory '${id}' not registered.`); // eslint-disable-line no-console
};

/**
 * Register a gyre factory function. Overides any gyre factory which is already present at that ID.
 *
 * @param {String} id Id of to register gyre.
 * @param {Function} factory Gyre factory function.
 * @returns {Object} API Chainable GyreJS object.
 */
const registerGyreFactory = (id, factory) => {
  if (id === "empty") {
    throw new Error("GyreJS (registerGyreFactory): cannot use 'empty, it is a reserved id.");
  }

  getGyres()[id] = factory;
  return API;
};

/**
 * Un-register a gyre factory function.
 *
 * @param {String} id Id of a registered gyre factory.
 * @returns {boolean} Whether the factory has been un-registered.
 */
const unRegisterGyreFactory = (id) => {
  if (!getGyres.hasOwnProperty(id)) {
    console.warn(`>> GyreJS: (unRegisterGyreFactory) Cannot un-register - Gyre factory '${id}' not registered.`); // eslint-disable-line no-console
    return false;
  }
  return (delete getGyres()[id]) && true;
};

// GyreJS API
export default Object.assign(API, {
  createGyre,
  registerGyreFactory,
  unRegisterGyreFactory,
  createGyreFactory
});
