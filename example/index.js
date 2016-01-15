import React from "react";
import ReactDOM from "react-dom";
import {ReactHoC, Counter} from "./react_components";
const simpleGyre = require("./setup_gyre")();

setInterval(() => {
  simpleGyre.issue("incrementCounter", 2);
}, 1000);

const CounterView = ReactHoC({}, Counter);

var Container = React.createClass({
  childContextTypes: {
    gyre: React.PropTypes.object
  },
  getChildContext: function() {
    return {gyre: simpleGyre};
  },
  getInitialState: function() {
    return {show: true};
  },
  handleButtonClick() {
    this.setState({
      show: !this.state.show
    });
  },
  render: function() {
    var Component;
    if (this.state.show) {
      Component = (
        <div>
          <CounterView/>
          <button onClick={this.handleButtonClick}>
            Click me
          </button>
        </div>
      );
    }
    else {
      Component = (
        <button onClick={this.handleButtonClick}>
          Click me
        </button>
      );
    }

    return Component;
  }
});

ReactDOM.render(
  <Container/>,
  document.getElementById("main")
);
