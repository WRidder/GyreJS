const aggregateFactory = (_internal, {reducer, eventFilter, methods = {}}) => {
  return (options) => {
    let state;

    /*
      Private methods
     */
    const setInitialState = () => {
      state = reducer(void(0), {type: null});
    };

    /**
     *
     * @param evt
     */
    const applyEvent = (evt) => {
      if (evt.type === "__RESET__") {
        setInitialState();
      }
      else {
        state = Object.assign({}, reducer(state, evt));
      }
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
      return eventFilter ?
        _internal.bus.getEvents().filter((event) => {
          return (event.type === "__RESET__") ? true : eventFilter(event);
        }) :
        _internal.bus.getEvents();
    };

    /*
     Setup
     */
    setInitialState();
    getEventsFromBus().forEach(evt => applyEvent(evt));

    /*
     Setup
     */
    return Object.keys(methods).reduce((prev, key) => {
      prev[key] = (...args) => {
        methods[key].apply(null, [state, trigger, ...args, options]);
      };
      return prev;
    }, {});
  };
};

export default aggregateFactory;
