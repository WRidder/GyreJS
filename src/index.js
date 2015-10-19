// Import sub libraries
import Store from "./store";
import LocalGyre from "./gyres/local/factory";
import SmartRestGyre from "./gyres/smartRest/factory";

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
const usedNS = [];

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

  const newNS = id + "-" + (nameSpace || usedNS.length.toString());
  if (usedNS.indexOf(newNS) !== -1) {
    throw new Error(`>> GyreJS: A '${id}' gyre using the namespace '${nameSpace}' is already registered.`);
  }
  usedNS.push(newNS);
  return gyres.get(id)(store, newNS);
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
registerGyreFactory("smartRest", SmartRestGyre);

export {
  createGyre,
  middleWare,
  registerGyreFactory
};
