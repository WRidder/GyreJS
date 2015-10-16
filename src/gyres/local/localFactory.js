import LocalAH from "./localAH";
import LocalReducer from "./localReducer";
import LocalReactHoC from "./localReactHoC";

/**
 * localFactory()
 *
 * @param {Object} store Store instance
 * @param {String} NS Namespace
 * @param {Boolean} [debugMode] Debug mode switch
 * @returns {{AH: *, getHoC: Function, getReducer: Function}} API
 */
const localFactory = (store, NS, debugMode = false) => {
  const nameSpace = NS || "local";

  // Public functions
  /**
   * Getter for reducer
   *
   * @param {String} matcher Matcher
   * @param {Function} cb Callback
   * @returns {Function} Reducer factory
   */
  const getReducer = (matcher, cb) => {
    return LocalReducer(store, matcher, cb, nameSpace, debugMode);
  };

  /**
   * Getter for ReactJS HoC
   *
   * @returns {Function} HoC Factory
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
