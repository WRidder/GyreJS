/**
 * localAH()
 *
 * @param {Object} store instance
 * @param {String} nameSpace state key
 * @param {Boolean} [debugMode] Whether to enable debugging
 * @returns {{addAction: Function, dispatch: Function}} API
 */
"use strict";

exports.__esModule = true;
var localAH = function localAH(store, nameSpace, debugMode) {
  // Private variables
  var actionMap = new Map();
  var stateHistory = [];

  // Public functions
  /**
   * addAction()
   *
   * @param {String} id Action ID
   * @param {Function} func Reducer function
   * @returns {void}
   */
  var addAction = function addAction(id, func) {
    actionMap.set(id, function (args) {
      var newState = store.updateState(nameSpace, func, args, id);
      if (debugMode) {
        stateHistory.push(newState);
        console.log(">> GyreJS-'" + nameSpace + "'-store: Applying action '" + id + "'", args, func);
      }
    });
  };

  /**
   * dispatch()
   *
   * @param {String} id Id
   * @param {Array} args Function arguments
   * @returns {void}
   */
  var dispatch = function dispatch(id) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (actionMap.has(id)) {
      actionMap.get(id)(args);
    } else {
      console.warn("GyreJS-AH: Unregistered action requested: '" + id + "' with arguments:", args);
    }
  };

  /**
   * getStateList() returns the state list.
   *
   * @returns {Array} Full state history
   */
  var getStateHistory = function getStateHistory() {
    return stateHistory;
  };

  // API
  return {
    addAction: addAction,
    dispatch: dispatch,
    getStateHistory: getStateHistory
  };
};

exports["default"] = localAH;
module.exports = exports["default"];