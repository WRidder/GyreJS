import LocalAH from "./localAH";
import LocalReducer from "./localReducer";
import LocalReactHoC from "./localReactHoC";

/**
 * localFactory()
 *
 * @param {Object} store
 * @param {String} nameSpace
 * @param {Boolean} [debugMode]
 * @returns {{AH: *, getHoC: Function, getReducer: Function}}
 */
const localFactory = (store, nameSpace, debugMode = false) => {
  nameSpace = nameSpace || "local";

  // Public functions
  /**
   * Getter for reducer
   *
   * @param matcher
   * @param cb
   * @returns {Function}
   */
  const getReducer = (matcher, cb) => {
    return LocalReducer(store, matcher, cb, nameSpace, debugMode);
  };

  /**
   * Getter for ReactJS HoC
   *
   * @returns {Function}
   */
  const getHoC = () => {
    return LocalReactHoC(getReducer);
  };

  // API
  return {
    AH: LocalAH(store, nameSpace, debugMode),
    getHoC,
    getReducer
  };
};

export default localFactory;
