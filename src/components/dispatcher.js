const dispatcherFactory = (_internal, commands, events) => {
  /*
    Public
   */
  const triggerEvent = (evtId, ...args) => {
    if (typeof events[evtId] !== "function") {
      console.error(`GyreJS [${_internal.id}] (triggerEvent): Event ${evtId} not registered.`); // eslint-disable-line no-console
      return false;
    }
    return _internal.bus.trigger(events[evtId](...args));
  };

  const issueCommand = (cmdId, ...args) => {
    if (typeof commands[cmdId] !== "function") {
      console.error(`GyreJS [${_internal.id}] (issueCommand): Command ${cmdId} not registered.`); // eslint-disable-line no-console
      return false;
    }
    commands[cmdId](...args);
  };

  const getEventInstance = (evtId, ...args) => {
    if (typeof events[evtId] !== "function") {
      console.error(`GyreJS [${_internal.id}] (getEventInstance): Event ${evtId} not registered.`); // eslint-disable-line no-console
      return false;
    }
    return events[evtId](...args);
  };

  return {
    getEventInstance,
    issueCommand,
    triggerEvent
  };
};

export default dispatcherFactory;
