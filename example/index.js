import React from "react";
import ReactDOM from "react-dom";
import {ReactHoC, Counter} from "./react_components";
const simpleGyre = require("./setup_gyre")();

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
  handleIncrement: function() {
    simpleGyre.issue("incrementCounter", 2);
  },
  handleIncrementIfOdd: function() {
    simpleGyre.issue("incrementCounterIfOdd", 1);
  },
  handleDecrement: function() {
    simpleGyre.issue("decrementCounter", 1);
  },
  handleLoadUsers: function() {
    simpleGyre.issue("loadUsers");
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
          <button onClick={this.handleIncrement}>
            Increment +2
          </button>
          <button onClick={this.handleDecrement}>
            Decrement -1
          </button>
          <button onClick={this.handleIncrementIfOdd}>
            Increment + 1 if odd
          </button>
          <button onClick={this.handleLoadUsers}>
            Load users
          </button>
        </div>
      );
    }
    else {
      Component = (
        <div>
          <button onClick={this.handleButtonClick}>
            Click me
          </button>
          <button onClick={this.handleIncrement}>
            Increment +2
          </button>
          <button onClick={this.handleDecrement}>
            Decrement -1
          </button>
          <button onClick={this.handleIncrementIfOdd}>
            Increment + 1 if odd
          </button>
          <button onClick={this.handleLoadUsers}>
            Load users
          </button>
        </div>
      );
    }

    return Component;
  }
});

ReactDOM.render(
  <Container/>,
  document.getElementById("main")
);
