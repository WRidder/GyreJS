import React from "react";
import ReactDOM from "react-dom";
const debugCss = require("!css!sass!./css/debugger_stylesheet.scss");
const debugFontsCss = require("!css!./css/foundation-icons.css");
import JSONTree from 'react-json-tree';

module.exports = () => {
  const gyres = [];

  const addGyre = (id, gyre) => {
    gyres[id] = {
      gyre: {},
      log: {
        calls: [],
        dispatcherCalls: [],
        busCalls: [],
        events: [],
        commands: []
      },
      bus: {},
      dispatcher: {}
    };

    return Object.keys(gyre).reduce((methods, gyreMethod) => {
      methods[gyreMethod] = (...args) => {
        gyres[id].log.calls.push([gyreMethod, Date.now(), ...args]);
        return gyre[gyreMethod](...args);
      };
      return methods;
    }, gyres[id].gyre);
  };

  const addBus = (id, bus) => {
    return Object.keys(bus).reduce((methods, busMethod) => {
      methods[busMethod] = (...args) => {
        gyres[id].log.busCalls.push([busMethod, Date.now(), ...args]);
        return bus[busMethod](...args);
      };
      return methods;
    }, gyres[id].bus);
  };

  const addDispatcher = (id, dispatcher) => {
    return Object.keys(dispatcher).reduce((methods, dpMethod) => {
      methods[dpMethod] = (...args) => {
        gyres[id].log.dispatcherCalls.push([dpMethod, Date.now(), ...args]);
        return dispatcher[dpMethod](...args);
      };
      return methods;
    }, gyres[id].dispatcher);
  };

  const resetGyre = function(id) {
    return gyres[id].bus.trigger(Object.freeze({type: "__RESET__"}));
  };

  /*
   * Setup
   */
  const init = () => {
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

    const Main = React.createClass({
      render: function() {
        return (
          <div className="blog-post main">
            <h3>Awesome blog post title too<small>3/6/2015</small></h3>
            <p>Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus.</p>
            <div className="callout">
              <ul className="menu simple">
                <li><a href="#">Author: Mike Mikers</a></li>
                <li><a href="#">Comments: 3</a></li>
              </ul>
            </div>
          </div>
        );
      }
    });

    const json = {
      array: [1, 2, 3],
      bool: true,
      object: {
        foo: 'bar'
      }
    };

    var DebugWindow = React.createClass({
      render: function() {
        return (
          <div>
            <Header/>
            <Main/>
            <JSONTree data={ json } />
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
    popupJs.text = `
    setTimeout(function() {
      $(document).foundation();
    }, 0);
    `;

    const filesToLoadSynchronously = [jqueryJs, zurbStyleJS];
    const filesToLoadWhenDone = [popupJs];
    let fileToLoadIndex = 0;
    const filesDone = [];
    const loadAsyncFiles = setInterval(() => {
      // if all files are loaded, return.
      if (filesDone.length === filesToLoadSynchronously.length && filesDone[filesDone.length - 1] === "finished") {
        clearInterval(loadAsyncFiles);

        // Add inline javascript
        filesToLoadWhenDone.forEach(script => popupHead.appendChild(script));
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
        }
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
  };
  init();

  return {
    addGyre,
    addBus,
    addDispatcher,
    resetGyre
  };
};
