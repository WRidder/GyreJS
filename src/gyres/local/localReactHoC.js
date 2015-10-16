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
   * @param {*} initialData Initial state
   * @returns {Object} React class
   */
  return (matcher, DefaultComponent, initialData) => {
    return React.createClass({
      displayName: "GyreJS-localHoC",
      getInitialState() {
        return initialData;
      },
      componentWillMount() {
        this.unRegisterReducer = reducer(matcher, this.handleNewData);
      },
      componentWillUnmount() {
        this.unRegisterReducer();
      },
      shouldComponentUpdate(nextState) {
        return this.state !== nextState;
      },
      handleNewData(data) {
        this.setState({
          data
        });
      },
      render() {
        // Render wrapped component with current props and state as props.
        const Component = (this.state) ? DefaultComponent : null;
        return Component ? <Component {...this.props} {...this.state}/> : false;
      }
    });
  };
};

export default localHoCFactory;
