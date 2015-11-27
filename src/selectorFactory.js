/**
 * Selector factory function
 *
 * @param {Object} store Store instance.
 * @param {String} NS Gyre namespace.
 * @param {Function} dispatch Gyre action dispatch function.
 * @returns {Function} Selector un-register function.
 */
const selectorFactory = (store, {NS}, dispatch) =>
  (selector, cb) => {
    // Check if the provided selector is either an object with the required api
    // or a function.
    if (typeof selector === "object" && typeof selector.onUpdate !== "function") {
      throw new Error("GyreJS: Selector object should expose an 'onUpdate' method.");
    }
    if (typeof selector !== "object" && typeof selector !== "function") {
      throw new Error("GyreJS: Selector should either be a function or an object with an 'onUpdate' method.");
    }

    // Invoke subscribe method if present.
    if (typeof selector.onSubscribe === "function") {
      selector.onSubscribe(dispatch);
    }

    // Register callback (update) function with the store.
    const update = typeof selector === "object" ? selector.onUpdate : selector;
    const unRegister = store.addSelector(NS, (state) => update(state, cb));

    // Return selector un-register function.
    // Invoke onUnsubscribe method if present.
    return () => {
      unRegister();
      if (typeof selector.onUnsubscribe === "function") {
        selector.onUnsubscribe(dispatch);
      }
    };
  };

export default selectorFactory;
