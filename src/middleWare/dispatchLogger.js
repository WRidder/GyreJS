/**
 * dispatchLogger()
 *
 * @param {String} nameSpace Gyre namespace.
 * @param {String} id Action Id.
 * @param {Array} args Action arguments array.
 * @param {Function} next Call next function in chain.
 * @returns {void}
 */
const dispatchLogger = (nameSpace, id, args, next) => {
  console.log(`>> GyreJS-'${nameSpace}'-store: Applying action '${id}' with arguments: `, args);
  next();
};

export default dispatchLogger;
