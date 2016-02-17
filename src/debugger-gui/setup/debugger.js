import projections from "../projections/debugger";

export default (GyreDebugger) => {
  GyreDebugger.addProjections(projections);
  return GyreDebugger;
};
