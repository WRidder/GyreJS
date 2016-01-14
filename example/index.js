import React from "react";
import ReactDOM from "react-dom";
import {ReactHoC, Counter} from "./react_components";

const simpleGyre = require("./setup_gyre")();
console.log("hello2!", simpleGyre);

setInterval(() => {
  simpleGyre.issue("incrementCounter", 2);
}, 1000);

/*
var windowObjectReference = null; // global variable

var strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=no,status=no";
function openFFPromotionPopup() {
  if(windowObjectReference == null || windowObjectReference.closed)
  /!* if the pointer to the window object in memory does not exist
   or if such pointer exists but the window was closed *!/

  {
    windowObjectReference = window.open(null,
      "PromoteFirefoxWindowName", strWindowFeatures);
    /!* then create it. The new window will be created and
     will be brought on top of any other window. *!/
  }
  else
  {
    windowObjectReference.focus();
    /!* else the window reference must exist and the window
     is not closed; therefore, we can bring it back on top of any other
     window with the focus() method. There would be no need to re-create
     the window or to reload the referenced resource. *!/
  }
}

openFFPromotionPopup(2);
*/

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
    console.log("forcing update!");
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
