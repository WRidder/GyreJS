/**
 * Create commands and events
 * @param {Object} aggregateCache Object containing the aggregates.
 * @param {Object} dispatcher Dispatcher instance.
 * @returns {Function} Command factory function.
 */
const commandFactory = ({dispatcher, aggregateCache}) => {
  const {getAggregate} = aggregateCache;

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

        const aggregate = getAggregate(aName, options);
        if (!aggregate) {
          throw new Error(`GyreJS (Command): Cannot find aggregate ${aName}; needed for command ${id}`);
        }
        if (Object.prototype.hasOwnProperty.call(aggregate, id) && typeof aggregate[id] === "function") {
          return aggregate[id](...args);
        }
        throw new Error(`GyreJS (addCommand): Method ${func} does not exist on aggregate ${id}`);
      };
    }

    return (...args) => {
      return func.apply(null, [{
        getAggregate,
        issue: dispatcher.issueCommand,
        trigger: dispatcher.triggerEvent
      }, ...args]);
    };
  };
};

export default commandFactory;
