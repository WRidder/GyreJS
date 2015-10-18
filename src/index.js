/**
 * Import libs
 */
import Store from "./store";
import LocalGyre from "./gyres/local/factory";
import SimpleRestGyre from "./gyres/simpleRest/factory";

// Middleware
import dispatchLogger from "./middleWare/dispatchLogger";
import injectDispatch from "./middleWare/injectDispatch";
const middleWare = {
  dispatchLogger,
  injectDispatch
};

// Private variables
const gyres = new Map();
const store = Store();
const usedNameSpaces = [];

// Public functions
/**
 * createGyre()
 *
 * @param {String} id Id of a registered gyre factory.
 * @param {String} [nameSpace] Namespace of new gyre.
 * @returns {Object} Gyre instance.
 */
const createGyre = (id, nameSpace) => {
  if (!gyres.has(id)) {
    console.warn(`>> GyreJS: Gyre factory '${id}' not registered.`);
  }
  if (usedNameSpaces.indexOf(nameSpace) !== -1) {
    throw new Error(`>> GyreJS ('${id}'): A gyre using the namespace '${nameSpace}' not registered.`);
  }
  usedNameSpaces.push(nameSpace);
  return gyres.get(id)(store, nameSpace);
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
registerGyreFactory("local", LocalGyre);
registerGyreFactory("simpleRest", SimpleRestGyre);

export {
  createGyre,
  middleWare,
  registerGyreFactory
};
