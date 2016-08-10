const busFactory = ({volatile}) => {
  let newEvents = [];
  let eventList = [];
  const projections = [];

  /**
   * Send update to all registered selectors.
   *
   * @param {Function} [cb] Specific callback to solely invoke.
   * @returns {Function} sendUpdate function for a namespace.
   */
  const sendUpdate = (cb) => {
    // After new evnets processed, concat to eventlist
    eventList = eventList.concat(newEvents);

    if (typeof cb === "function") {
      eventList.forEach(event => cb(event));
    }
    else {
      newEvents.forEach(event => {
        projections.forEach(projection =>
            projection(event)
        );
      });
      newEvents = [];
    }
  };

  /**
   * Remove selector from the store
   *
   * @param {Function} cb Selector callback.
   * @returns {Function} removal function.
   */
  const removeProjection = (cb) =>
    () =>
      projections.splice(projections.indexOf(cb), 1);

  /**
   * Register a selector with the store and send initial data.
   *
   * @param {Function} cb callback.
   * @param {Boolean} playAll Play all existing events to this topology.
   * @returns {Function} un-register function.
   */
  const addProjection = (cb, playAll) => {
    // Save to local register
    projections.push(cb);

    if (playAll) {
      sendUpdate(cb);
    }

    // Return function to remove selector from store.
    return removeProjection(cb);
  };

  /**
   * Triggers an event on the bus.
   *
   * @param {Object} evt Event.
   * @returns {Object}
   */
  const trigger = (evt) => {
    if (!volatile) {
      newEvents.push(evt);
    }
    sendUpdate();
    return evt;
  };

  /**
   * @returns {Array} Array of events.
   */
  const getEvents = (offset = 0) => (eventList.concat(newEvents)).slice(offset);

  return {
    addProjection,
    getEvents,
    trigger
  };
};

export default busFactory;
