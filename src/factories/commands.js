/**
 * Create commands and events
 * @param {Object} aggregates Object containing the aggregates.
 * @param {Object} dispatcher Dispatcher instance.
 * @returns {Function} Command factory function.
 */
const commandFactory = (aggregates, {dispatcher}) => {
  /**
   * @param {Function|String} func Command function or aggregate method name.
   * @param {String} [id] Aggregate method name.
   * @returns {Object} Command object
   */
  return (func, id) => {
    /**
     * Allow direct method calling on aggregates.
     * Assumes a 1:1 mapping of command name -> aggregate method.
     */
    if (typeof func === "string" || Array.isArray(func)) {
      return (...args) => {
        const aName = Array.isArray(func) ? func[0] : func;
        const options = (Array.isArray(func) && func.length > 1) ? func[1] : void(0);

        if (!Object.prototype.hasOwnProperty.call(aggregates, aName)) {
          throw new Error(`GyreJS (Command): Cannot find aggregate ${aName}; needed for command ${id}`);
        }
        const aggregate = aggregates[aName](options);
        if (Object.prototype.hasOwnProperty.call(aggregate, id) && typeof aggregate[id] === "function") {
          return aggregate[id](...args);
        }
        throw new Error(`GyreJS (addCommand): Cannot find method ${func} on aggregate ${id}`);
      };
    }

    return (...args) => {
      return func.apply(null, [{
        getAggregate: (gId, options) => aggregates[gId](options),
        issue: dispatcher.issueCommand,
        trigger: dispatcher.triggerEvent
      }, ...args]);
    };
  };
};

export default commandFactory;
