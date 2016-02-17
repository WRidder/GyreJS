import GyreJS from "../../index";
import events from "../events";
import projections from "../projections/local";

export default () => {
  return GyreJS.createGyre({
    id: "gyre-debugger-gui-local",
    events,
    projections
  });
};
