import React from "react";
import ReactDOM from "react-dom";
const debugCss = require("!css!sass!./css/debugger_stylesheet.scss");
const debugFontsCss = require("!css!./css/foundation-icons.css");
const foundationJs = require("raw!./popup/foundation.js");
import JSONTree from "react-json-tree";

import projections from "./projections";
import HoC from "./react-components/hoc";

module.exports = (GyreDebugger) => {
   /*
   * Setup
   */
  let initialized = false;
  const init = () => {
    if (initialized) {
      return;
    }

    // Add projections to GyreDebugger
    GyreDebugger.addProjections(projections);

    let windowObjectReference = null; // global variable
    var strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=no,status=no";
    function openDebuggerWindow() {
      if (windowObjectReference === null || windowObjectReference.closed) {
        windowObjectReference = window.open(void(0), "GyreJS Debugger", strWindowFeatures);
      }
      else {
        windowObjectReference.focus();
      }
    }
    openDebuggerWindow();



    if (!windowObjectReference) {
      throw new Error("GyreJS Debugger: No popup window found; please allow popups to open for the debugger to work.");
    }

    const Header = React.createClass({
      render: function() {
        return (
          <div>
            <div className="title-bar" data-responsive-toggle="main-menu" data-hide-for="medium">
              <button className="menu-icon" type="button" data-toggle></button>
              <div className="title-bar-title">Menu</div>
            </div>

            <div className="top-bar" id="main-menu">
              <div className="top-bar-left">
                <ul className="dropdown menu" data-dropdown-menu>
                  <li className="menu-text">GyreJS Debugger</li>
                </ul>
              </div>
              <div className="top-bar-right">
                <ul className="menu vertical medium-horizontal" data-responsive-menu="drilldown medium-dropdown">
                  <li><a href="#">Log <span className="success badge">3</span></a></li>
                  <li><a href="#">Docs</a></li>
                  <li><a href="https://github.com/WRidder/GyreJS" target="_blank" title="Visit GyreJS on GitHub!">Github <i className="fi-social-github"></i></a></li>
                </ul>
              </div>
            </div>
            <nav aria-label="You are here:" role="navigation">
              <ul className="breadcrumbs">
                <li><a href="#">Home</a></li>
                <li><a href="#">Features</a></li>
                <li className="disabled">Gene Splicing</li>
                <li>
                  <span className="show-for-sr">Current: </span> Cloning
                </li>
              </ul>
            </nav>
          </div>
        );
      }
    });

    var GyreListing = HoC("gyreList", React.createClass({
      render: function() {
        return (
          <select>
            {this.props.gyreList.map(function(gyre) {
              return <option key={gyre.id} value={gyre.id}>{gyre.id}</option>;
            })}
          </select>
        );
      }
    }));

    const Entry = React.createClass({
      shouldComponentUpdate: () => false,
      render: function() {
        return (<li className="event-flash">[{this.props.data.gId}] {this.props.data.time}, {this.props.data.msg} {this.props.data.payload === void(0) ? false : (<JSONTree data={this.props.data.payload} />)}</li>);
      }
    });

    var GyreLog = HoC("log", React.createClass({
      render: function() {
        const logs = this.props.log.slice(Math.max(this.props.log.length - 25, 1));
        logs.reverse();

        return (
          <ol>
            {logs.map(function(entry) {
              return <Entry key={entry.time} data={entry}/>;
            })}
          </ol>
        );
      }
    }));

    const Docs = React.createClass({
      shouldComponentUpdate: () => false,
      render: () => (<iframe className="iframe-docs" height="100%" seamless="seamless" frameBorder="0" src="http://gyre.js.org" />)
    });

    const Main = React.createClass({
      render: function() {
        return (
          <div className="blog-post main">
            <GyreListing/>
            <GyreLog/>
            <Docs/>
          </div>
        );
      }
    });

    var DebugWindow = React.createClass({
      childContextTypes: {
        gyre: React.PropTypes.object
      },
      getChildContext: function() {
        return {
          gyre: GyreDebugger._debugGyre
        };
      },
      render: function() {
        return (
          <div>
            <Header/>
            <Main/>
          </div>
        );
      }
    });

    // Pop vars
    const popupDoc = windowObjectReference.document;
    const popupHead = popupDoc.head || popupDoc.getElementsByTagName("head")[0];

    // Clear head
    while (popupHead.firstChild) {
      popupHead.removeChild(popupHead.firstChild);
    }

    // Clear body
    popupDoc.body.innerHTML = "";

    // Attach jquery javacript
    const jqueryJs = popupDoc.createElement("script");
    jqueryJs.type = "text/javascript";
    jqueryJs.src = "https://code.jquery.com/jquery-2.2.0.min.js";

    // Attach style javacript
    const zurbStyleJS = popupDoc.createElement("script");
    zurbStyleJS.type = "text/javascript";
    zurbStyleJS.src = "https://cdn.jsdelivr.net/foundation/6.1.1/foundation.min.js";

    // Attach zurb style css link
    const zurbStyleLink = popupDoc.createElement("link");
    zurbStyleLink.type = "text/css";
    zurbStyleLink.rel = "stylesheet";
    zurbStyleLink.href = "https://cdn.jsdelivr.net/foundation/6.1.1/foundation.min.css";
    popupHead.appendChild(zurbStyleLink);

    // Attach debugger specific css
    const debuggerStyleTag = popupDoc.createElement("style");
    if (debuggerStyleTag.styleSheet) {
      debuggerStyleTag.styleSheet.cssText = debugCss.toString() + debugFontsCss.toString();
    }
    else {
      debuggerStyleTag.appendChild(popupDoc.createTextNode(debugCss.toString() + debugFontsCss.toString()));
    }
    popupHead.appendChild(debuggerStyleTag);

    // Attach popWindow specific javascript
    const popupJs = popupDoc.createElement("script");
    popupJs.type = "text/javascript";
    popupJs.text = foundationJs;

    const filesToLoadSynchronously = [jqueryJs, zurbStyleJS];
    const filesToLoadInline = [popupJs];
    let fileToLoadIndex = 0;
    const filesDone = [];
    const loadAsyncFiles = setInterval(() => {
      // if all files are loaded, return.
      if (filesDone.length === filesToLoadSynchronously.length && filesDone[filesDone.length - 1] === "finished") {
        clearInterval(loadAsyncFiles);

        // Add inline javascript
        filesToLoadInline.forEach(script => popupHead.appendChild(script));
        return;
      }

      // If file is processing, return.
      if (fileToLoadIndex + 1 === filesDone.length && filesDone[filesDone.length - 1] === "busy") {
        return;
      }

      if (filesDone.length < fileToLoadIndex + 1) {
        popupHead.appendChild(filesToLoadSynchronously[fileToLoadIndex]);
        filesDone.push("loading");

        filesToLoadSynchronously[fileToLoadIndex].onload = () => {
          filesDone[filesDone.length - 1] = "finished";
          fileToLoadIndex++;
        };
      }
    }, 50);

    // Attach main div element
    const mainDiv = popupDoc.createElement("div");
    while (popupDoc.body.firstChild) {
      popupDoc.body.removeChild(popupDoc.body.firstChild);
    }
    popupDoc.body.appendChild(mainDiv);

    // Attach react components
    ReactDOM.render(
      <DebugWindow/>,
      mainDiv
    );

    initialized = true;
  };

  return {
    init
  };
};
