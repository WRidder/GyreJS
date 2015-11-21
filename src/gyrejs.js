// Import sub libraries
import Store from "./store";
import GyreFactoryFactory from "./gyreFactory";

// Private variables
const gyres = new Map();
const store = Store();

// Public functions
/**
 * createGyre()
 *
 * @param {String} id Id of a registered gyre factory.
 * @param {Object} [options] Options object for gyre.
 * @returns {Object} Gyre instance.
 */
const createGyre = (id, options) => {
  if (!gyres.has(id)) {
    console.warn(`>> GyreJS: Error on create - Gyre factory '${id}' not registered.`); // eslint-disable-line no-console
  }
  const newNameSpace = `${id}-${Date.now()}`;
  store.setState({
    data: {}
  }, newNameSpace);

  return gyres.get(id)(store, Object.assign({}, {NS: newNameSpace}, options));
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

/**
 * unRegisterGyreFactory()
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
  GyreFactoryFactory
};
