/**
 * Import libs
 */
import Store from "./store";
import LocalGyreFactory from "./gyres/local/localFactory";

// Middleware
import dispatchLogger from "./middleWare/dispatchLogger";
const middleWare = {
  dispatchLogger
};

// Private variables
const gyres = new Map();
const store = Store();

// Public functions
/**
 * createGyre()
 *
 * @param {String} id Id of a registered gyre.
 * @returns {Object} Gyre instance.
 */
const createGyre = (id) => {
  if (!gyres.has(id)) {
    console.warn(`GyreJS: Gyre '${id}' not registered.`);
  }
  return gyres.get(id)(store);
};

/**
 * registerGyreFactory()
 *
 * @param {String} id Id of to register gyre.
 * @param {Function} factory Gyre factory function.
 * @returns {void}
 */
const registerGyreFactory = (id, factory) => {
  gyres.set(id, factory);
};

// Register standard gyres
registerGyreFactory("local", LocalGyreFactory);

export {
  createGyre,
  middleWare,
  registerGyreFactory
};
