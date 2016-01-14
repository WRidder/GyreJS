import React from "react";
/**
 * ReactHoC()
 *
 * @param {String} query Matcher.
 * @param {Object} Component Default component.
 * @returns {Object} React class
 */
const ReactHoC = (query, Component) => {
  return React.createClass({
    displayName: "GyreJS-localHoC",
    contextTypes: {
      gyre: React.PropTypes.object
    },
    componentWillMount() {
      this.unRegisterListener = this.context.gyre.addListener("test1", this.handleNewData);
    },
    componentWillUnmount() {
      this.unRegisterListener();
    },
    handleNewData(data) {
      this.setState(data);
    },
    render() {
      // Render wrapped component with current props and state as props.
      return (
        (!this.state) ?
          false :
          <Component {...this.props} {...this.state}/>
      );
    }
  });
};

// Create view
var Counter = React.createClass({
  render: function() {
    return (
      <div>
        <h2>The count is: {this.props.count}</h2>
        <hr/>
      </div>
    );
  }
});

module.exports = {
  ReactHoC,
  Counter
};

