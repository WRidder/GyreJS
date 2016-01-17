import Reducer from "./reducers";
import Projection from "./projections";

module.exports = (_internal) => {
  const listeners = (() => {
    const list = {};

    return {
      get: id => (!list.hasOwnProperty(id)) ? (list[id] = []) && list[id] : list[id]
    };
  })();
  const projections = {};

  /**
   * Send update to all registered selectors.
   *
   * @param {String} id Id of projection.
   * @param {Function} [cb] Specific callback to solely invoke.
   * @returns {Function} sendUpdate function for a namespace.
   */
  const sendUpdate = (id, cb) => {
    return cb
      ? cb(projections[id].getState())
      : listeners.get(id).forEach(listener => listener(projections[id].getState()));
  };

  /**
   *
   * @type {Function}
   */
  const addProjection = (id, reducer, replace) => {
    // TODO: check for function or object. If object, should have initial state and events properties.
    if (!Object.prototype.hasOwnProperty.call(projections, id) || replace) {
      projections[id] = Projection(_internal, Reducer(reducer), () => {
        sendUpdate(id);
      });
    }
    else {
      console.warn(`>> GyreJS-gyre: addProjection -> Projection with id: '${id}' already exists.`); // eslint-disable-line no-console
    }
  };

  /**
   *
   * @type {Function}
   */
  const removeProjection = (id) => {
    if (!projections.hasOwnProperty(id)) {
      console.warn(`>> GyreJS: (removeProjection) A projection with id:'${id}' is not registered.`); // eslint-disable-line no-console
      return false;
    }

    if (projections[id].destroy(id)) {
      delete projections[id];
      return true;
    }
    return false;
  };

  /**
   * Remove selector from the store
   *
   * @param {String} id Id of projection.
   * @param {Function} cb Selector callback.
   * @returns {Function} removal function.
   */
  const removeListener = (id, cb) =>
    () =>
      listeners.get(id)
        .splice(listeners.get(id).indexOf(cb), 1);

  /**
   * Register a selector with the store and send initial data.
   *
   * @param {String} id Id of projection.
   * @param {Function} cb callback.
   * @returns {Function} un-register function.
   */
  const addListener = (id, cb) => {
    if (!projections.hasOwnProperty(id)) {
      console.warn(`>> GyreJS: (addListener) A projection with id:'${id}' is not registered.`); // eslint-disable-line no-conso     return false;
    }
    if (typeof cb !== "function") {
      throw new Error("GyreJS (addListener): The second argument, callback, should be a function.");
    }

    // Save to local register
    listeners.get(id).push(cb);

    // Request update to make sure the new filter gets data asap.
    sendUpdate(id, cb);

    // Return function to remove selector from store.
    return removeListener(id, cb);
  };

  return {
    addListener,
    addProjection,
    removeProjection,
    sendUpdate
  };
};
