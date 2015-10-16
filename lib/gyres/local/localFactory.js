"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _localAH = require("./localAH");

var _localAH2 = _interopRequireDefault(_localAH);

var _localReducer = require("./localReducer");

var _localReducer2 = _interopRequireDefault(_localReducer);

var _localReactHoC = require("./localReactHoC");

var _localReactHoC2 = _interopRequireDefault(_localReactHoC);

/**
 * localFactory()
 *
 * @param {Object} store Store instance
 * @param {String} NS Namespace
 * @param {Boolean} [debugMode] Debug mode switch
 * @returns {{AH: *, getHoC: Function, getReducer: Function}} API
 */
var localFactory = function localFactory(store, NS) {
  var debugMode = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var nameSpace = NS || "local";

  // Public functions
  /**
   * Getter for reducer
   *
   * @param {String} matcher Matcher
   * @param {Function} cb Callback
   * @returns {Function} Reducer factory
   */
  var getReducer = function getReducer(matcher, cb) {
    return _localReducer2["default"](store, matcher, cb, nameSpace, debugMode);
  };

  /**
   * Getter for ReactJS HoC
   *
   * @returns {Function} HoC Factory
   */
  var getHoC = function getHoC() {
    return _localReactHoC2["default"](getReducer);
  };

  // API
  return {
    AH: _localAH2["default"](store, nameSpace, debugMode),
    getHoC: getHoC,
    getReducer: getReducer
  };
};

exports["default"] = localFactory;
module.exports = exports["default"];