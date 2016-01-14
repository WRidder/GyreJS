const busFactory = () => {
  let newEvents = [];
  let eventList = [];
  const projections = [];
  projections.ticker = (cb) => cb();

  /**
   * Send update to all registered selectors.
   *
   * @param {Function} [cb] Specific callback to solely invoke.
   * @returns {Function} sendUpdate function for a namespace.
   */
  const sendUpdate = (cb) => () => {
    projections.updateRequested = false;

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
   * Request to issue update to filters of a given namespace.
   *
   * @param {Function} [cb] Specific callback to solely invoke.
   * @returns {void}
   */
  const requestUpdate = (cb) => {
    if (!projections.updateRequested) {
      projections.updateRequested = true;
      projections.ticker(sendUpdate(cb));
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
      requestUpdate(cb);
    }

    // Return function to remove selector from store.
    return removeProjection(cb);
  };

  /**
   * Triggers an event on the bus.
   *
   * @param {Object} evt Event.
   * @returns {void}
   */
  const trigger = (evt) => {
    newEvents.push(evt);
    requestUpdate();
    return evt;
  };

  /**
   * Set tick function
   *
   * The tick function is added as a property to the topology array.
   *
   * @param {Function} ticker Store update tick function.
   * @returns {void}
   */
  const setTicker = (ticker) => {
    if (typeof ticker !== "function") {
      throw new Error("GyreJS (setTicker): Ticker should be a function.");
    }

    projections.ticker = ticker;
  };

  /**
   * @returns {Array} Array of events.
   */
  const getEvents = () => eventList.concat(newEvents);

  return {
    addProjection,
    getEvents,
    setTicker,
    trigger
  };
};

export default busFactory;
