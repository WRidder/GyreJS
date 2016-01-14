/**
 * Create events
 * @param {String} id Id of event.
 * @param {Function} func Event factory function.
 * @returns {Function} Event factory function.
 */
const eventFactory = (id, func) => {
  /**
   * @param {Object} props Properties
   * @returns {Object} Event object
   */
  return (...values) => Object.freeze(Object.assign({}, func(...values), {type: id}));
};

export default eventFactory;
