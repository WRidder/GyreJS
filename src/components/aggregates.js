const aggregateFactory = (_internal, {reducer, eventFilter, methods = {}}) =>
  (options) => {
    const API = {};
    let state = reducer.initialValue();
    let evtOffset = 0;

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
      let events = _internal.bus.getEvents(evtOffset);
      evtOffset += events.length;

      if (eventFilter) {
        events = events.filter((event) => {
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

    const update = () => {
      getEventsFromBus().forEach(evt => applyEvent(evt));
      return API;
    };

    /*
     Setup
     */
    update();

    // Methods for internal use
    Object.defineProperty(API, "__update", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: update
    });

    // Bind provided methods to aggregate
    Object.keys(methods).reduce((prev, key) => {
      prev[key] = (...args) => {
        methods[key].apply(null, [state, {trigger, issue: _internal.dispatcher.issue}, ...args, options]);
      };
      return prev;
    }, API);

    return API;
  };

export default aggregateFactory;
