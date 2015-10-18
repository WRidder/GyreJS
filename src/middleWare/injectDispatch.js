/**
 * injectDispatch()
 *
 * @param {String} nameSpace Gyre namespace.
 * @param {String} id Action Id.
 * @param {Array} args Action arguments array.
 * @param {Function} next Call next function in chain.
 * @param {Function} dispatch Action handler dispatcher.
 * @returns {void}
 */
const injectDispatch = (nameSpace, id, args, next, dispatch) => {
  args.push(dispatch);
  next();
};

export default injectDispatch;
