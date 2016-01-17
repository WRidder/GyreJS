/**
 * Reducer factory
 *
 * @param {Object|Function} reducer Reducer object or function.
 * @returns {{applyEvent, initialValue: Function}} Reducer API.
 */
module.exports = (reducer) => {
  const initialValue = () => {
    return typeof reducer === "function" ? reducer(void(0), {type: null}) : reducer.initialState;
  };

  const applyEvent = (() => {
    if (typeof reducer === "function") {
      return (state, evt) => (evt.type === "__RESET__") ? initialValue() : reducer(state, evt);
    }
    return (state, evt) => {
      // Reset returns the initial value of the reducer.
      if (evt.type === "__RESET__") {
        return initialValue();
      }

      // If there is a direct match between the event type and specified events; use that.
      if (typeof reducer.events[evt.type] === "function") {
        return reducer.events[evt.type](state, evt);
      }

      // If no match has been found yet, check for events specified as regex.
      for (let i = 0; i < Object.keys(reducer.events).length; i++) {
        const evtName = Object.keys(reducer.events)[i];
        const re = new RegExp(evtName);

        if (evt.type.match(re)) {
          return reducer.events[evtName](state, evt);
        }
      }
      return state;
    };
  })();

  return {
    applyEvent,
    initialValue
  };
};
