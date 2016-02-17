import ReactDOM from "react-dom";
import createPopup from "./popup";
import attachDependencies from "./dependencies";
import Routes from "../react-components/routes";
import gyreDebuggerSetup from "./debugger";
import gyreLocalSetup from "./local";
import GyreJS from "../../index";

export const GyreDebuggerGUI = function(GyreDebugger) {
  const self = this;
  this.gyreDebugger = gyreDebuggerSetup(GyreDebugger);
  this.localDebugger = gyreLocalSetup();

  // Setup listeners
  this.gyreDebugger._debugGyre.addListener("log", (data) => {
    self.localDebugger.trigger("updateLogLength", data.log.length);
  });
};

GyreDebuggerGUI.prototype.show = function() {
  // Create window
  const windowObjectReference = createPopup();

  // Attach dependencies
  attachDependencies(windowObjectReference);

  // Attach main div element
  const popupDoc = windowObjectReference.document;
  const mainDiv = popupDoc.createElement("div");
  while (popupDoc.body.firstChild) {
    popupDoc.body.removeChild(popupDoc.body.firstChild);
  }
  popupDoc.body.appendChild(mainDiv);

  // Render app
  ReactDOM.render(
    Routes(this.gyreDebugger, this.localDebugger),
    mainDiv
  );
};
