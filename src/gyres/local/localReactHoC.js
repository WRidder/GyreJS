import React from "react";

/**
 * Higher order Component factory for local gyre.
 *
 * @param reducer
 * @returns {Function}
 */
const localHoCFactory = (reducer) => {
  /**
   * localHoC()
   *
   * @param matcher
   * @param DefaultComponent
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
        let Component = (this.state && this.state.success) ? DefaultComponent : null;
        return Component ? <Component {...this.props} {...this.state}/> : false;
      }
    });
  };
};

export default localHoCFactory;
