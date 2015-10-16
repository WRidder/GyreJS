"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var IMap = _immutable2["default"].Map;

/**
 * Store() Factory function
 *
 * @returns {{addReducer: Function, getState: Function, setState: Function, updateState: Function}} API
 */
var store = function store() {
  var state = IMap({});

  // Private variables
  var rId = 0;
  var reducerMap = new Map();

  // Private functions
  /**
   * Send update to all registered reducers
   *
   * @returns {void}
   */
  var sendUpdate = function sendUpdate() {
    reducerMap.forEach(function (reducer) {
      reducer(state);
    });
  };

  /**
   * removeReducer() - Factory
   * Remove reducer from the store
   *
   * @param {Number} id Reducer Id
   * @returns {Function} removal function.
   */
  var removeReducer = function removeReducer(id) {
    return function () {
      reducerMap["delete"](id);
    };
  };

  /**
   * setState() Overwrite the current state in the store.
   * Use for setting an initial state or debugging.
   *
   * @param {Immutable.Map|Object} newState New state
   * @param {String} [nameSpace] Namespace
   * @returns {Immutable.Map} state Current state
   */
  var setNewState = function setNewState(newState, nameSpace) {
    var tState = IMap.isMap(newState) ? newState : IMap(newState);
    state = nameSpace ? state.set(nameSpace, tState) : tState;
    sendUpdate();
    return state;
  };

  // Public functions
  /**
   * Register a faucet with the store and send initial data.
   *
   * @param {Function} cb callback
   * @returns {Function} un-register function
   */
  var addReducer = function addReducer(cb) {
    var id = rId++;

    // Save to local register
    reducerMap.set(id, cb);

    // Send state to reducer
    cb(state);

    // Return remover
    return removeReducer(id);
  };

  /**
   * getState() returns the current state.
   *
   * @returns {Immutable.Map} Current state
   */
  var getState = function getState() {
    return state;
  };

  /**
   * setState()
   *
   * @param {Immutable.Map|Object} newState State
   * @param {String} [nameSpace] Namespace
   * @returns {Immutable.Map} New state
   */
  var setState = function setState(newState, nameSpace) {
    return setNewState(newState, nameSpace);
  };

  /**
   * updateState() applies a given reducer function to the state, which
   * is supposed to return a new Immutable state.
   *
   * @param {String} nameSpace Namespace
   * @param {Function} func Reducer function
   * @param {Array} args Reducer function arguments
   * @returns {Immutable.Map} state New state
   */
  var updateState = function updateState(nameSpace, func, args) {
    setNewState(func.apply(undefined, [state.get(nameSpace) || IMap({})].concat(args)), nameSpace);
    return state;
  };

  // API
  return {
    addReducer: addReducer,
    getState: getState,
    setState: setState,
    updateState: updateState
  };
};

exports["default"] = store;
module.exports = exports["default"];