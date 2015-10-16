import React from "react";

/**
 * Higher order Component factory for local gyre.
 *
 * @param {Function} reducer Reducer factory
 * @returns {Function} HoC Factory
 */
const localHoCFactory = (reducer) => {
  /**
   * localHoC()
   *
   * @param {String} matcher Matcher
   * @param {Object} DefaultComponent Default component
   * @returns {Object} React class
   */
  return (matcher, DefaultComponent) => {
    return React.createClass({
      displayName: "GyreJS-localHoC",
      getInitialState() {
        return null;
      },
      componentWillMount() {
        this.unRegisterReducer = reducer(matcher, this.handleNewData);
      },
      componentWillUnmount() {
        this.unRegisterReducer();
      },
      handleNewData(success, data) {
        this.setState({
          data,
          success
        });
      },
      render() {
        // Render wrapped component with current props and state as props.
        const Component = (this.state && this.state.success) ? DefaultComponent : null;
        return Component ? <Component {...this.props} {...this.state}/> : false;
      }
    });
  };
};

export default localHoCFactory;
