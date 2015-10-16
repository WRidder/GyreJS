/**
 * reducer()
 *
 * @param {Object} store Store instance
 * @param {String} matcher Matcher
 * @param {Function} cb Callback
 * @param {String} nameSpace Namespace
 * @returns {Function} Un-register function
 */
"use strict";

exports.__esModule = true;
var reducer = function reducer(store, matcher, cb, nameSpace) {
  // Private functions
  var update = function update(stateVar) {
    var state = nameSpace ? stateVar.get(nameSpace) : stateVar;

    if (state) {
      var data = state.get(matcher);
      if (data) {
        cb(true, data);
      } else {
        cb(false);
      }
    }
  };

  // Return the un-register function right away.
  return store.addReducer(update);
};

exports["default"] = reducer;
module.exports = exports["default"];