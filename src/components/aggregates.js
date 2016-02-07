const aggregateFactory = (_internal, {reducer, eventFilter, methods = {}}) => {
  return (options) => {
    let state = reducer.initialValue();

    /**
     *
     * @param evt
     */
    const applyEvent = (evt) => {
      state = reducer.applyEvent(state, evt);
    };

    /**
     *
     * @param id
     * @param args
     */
    const trigger = (id, ...args) => {
      _internal.dispatcher.triggerEvent(id, ...args);
    };

    const getEventsFromBus = () => {
      let events;
      if (eventFilter) {
        events = _internal.bus.getEvents().filter((event) => {
          // Always allow reset event
          if (event.type === "__RESET__") {
            return true;
          }

          // Support string (single event)
          if (typeof eventFilter === "string" || typeof eventFilter === "number") {
            return event.type === eventFilter;
          }

          // Support filter functions
          if (typeof eventFilter === "function") {
            return eventFilter(event);
          }

          // Support array of strings. Should be exact match
          if (Array.isArray(eventFilter)) {
            return eventFilter.indexOf(event.type) !== -1;
          }

          // Support regex
          if (eventFilter instanceof RegExp) {
            return event.type.match(eventFilter);
          }
          return true;
        });
      }
      else {
        events = _internal.bus.getEvents();
      }

      // Allow filtering by attribute. E.g.: Useful for aggregates for a single model.
      if (options.attributeFilter && options.attributeFilter.attributeName && options.attributeFilter.value) {
        const {attributeName, value} = options.attributeFilter;
        events = events.filter((event) => {
          if (Object.prototype.hasOwnProperty.call(event, attributeName)) {
            // Support string (single event)
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
              return event[attributeName] === value;
            }

            // Support filter functions
            if (typeof value === "function") {
              return value(event[attributeName]);
            }

            // Support array of strings. Should be exact match
            if (Array.isArray(value)) {
              return value.indexOf(event[attributeName]) !== -1;
            }

            // Support regex
            if (value instanceof RegExp) {
              return event[attributeName].match(value);
            }
          }
          return true;
        });
      }
      return events;
    };

    /*
     Setup
     */
    getEventsFromBus().forEach(evt => applyEvent(evt));

    /*
     Setup
     */
    return Object.keys(methods).reduce((prev, key) => {
      prev[key] = (...args) => {
        methods[key].apply(null, [state, {trigger, issue: _internal.dispatcher.issue}, ...args, options]);
      };
      return prev;
    }, {});
  };
};

export default aggregateFactory;
