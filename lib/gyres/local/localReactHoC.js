"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

/**
 * Higher order Component factory for local gyre.
 *
 * @param {Function} reducer Reducer factory
 * @returns {Function} HoC Factory
 */
var localHoCFactory = function localHoCFactory(reducer) {
  /**
   * localHoC()
   *
   * @param {String} matcher Matcher
   * @param {Object} DefaultComponent Default component
   * @returns {Object} React class
   */
  return function (matcher, DefaultComponent) {
    return _react2["default"].createClass({
      displayName: "GyreJS-localHoC",
      getInitialState: function getInitialState() {
        return null;
      },
      componentWillMount: function componentWillMount() {
        this.unRegisterReducer = reducer(matcher, this.handleNewData);
      },
      componentWillUnmount: function componentWillUnmount() {
        this.unRegisterReducer();
      },
      handleNewData: function handleNewData(success, data) {
        this.setState({
          data: data,
          success: success
        });
      },
      render: function render() {
        // Render wrapped component with current props and state as props.
        var Component = this.state && this.state.success ? DefaultComponent : null;
        return Component ? _react2["default"].createElement(Component, _extends({}, this.props, this.state)) : false;
      }
    });
  };
};

exports["default"] = localHoCFactory;
module.exports = exports["default"];