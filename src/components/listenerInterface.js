module.exports = (projections) => {
  const listeners = (() => {
    const list = {};

    return {
      get: id => (!list.hasOwnProperty(id)) ? (list[id] = []) && list[id] : list[id]
    };
  })();

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
    // Save to local register
    listeners.get(id).push(cb);

    // Request update to make sure the new filter gets data asap.
    sendUpdate(id, cb);

    // Return function to remove selector from store.
    return removeListener(id, cb);
  };

  return {
    addListener,
    sendUpdate
  };
};
