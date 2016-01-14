/**
 * Create commands and events
 * @param {Object} aggregates Object containing the aggregates.
 * @param {Object} dispatcher Dispatcher instance.
 * @returns {Function} Command factory function.
 */
const commandFactory = (aggregates, {dispatcher}) => {
  /**
   * @param {Function} func Command function.
   * @returns {Object} Event object
   */
  return (func) => {
    return func.bind({
      getAggregate: (id, options) => aggregates[id](options),
      issue: dispatcher.issueCommand,
      trigger: dispatcher.triggerEvent
    });
  };
};

export default commandFactory;
