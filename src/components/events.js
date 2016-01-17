/**
 * Create events
 * @param {String} id Id of event.
 * @param {Function} func Event factory function.
 * @returns {Function|Array} Event factory function.
 */
const eventFactory = (id, func) => {
  // TODO: allow func to be an array with event properties
  /**
   * @param {Object} props Properties
   * @returns {Object} Event object
   */
  return (...values) => {
    if (typeof func === "function") {
      return Object.freeze(Object.assign({}, func(...values), {type: id}));
    }

    // Assume func is an array
    if (values.length > func.length) {
      throw new Error(`GyreJS (Event creation): instantiated event ${id} is provided more values (${values.length}) than configured (${func.length}).`);
    }
    const eventProperties = values.reduce((obj, value, index) => {
      obj[func[index]] = value;
      return obj;
    }, {});
    return Object.freeze(Object.assign({}, eventProperties, {type: id}));
  };
};

export default eventFactory;
