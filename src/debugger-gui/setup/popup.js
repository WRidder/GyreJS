export default () => {
  let windowObjectReference = null; // global variable
  var strWindowFeatures = "menubar=no,resizable=yes,scrollbars=no,status=no";

  // Open window
  if (windowObjectReference === null || windowObjectReference.closed) {
    windowObjectReference = window.open(void(0), "GyreJS Debugger", strWindowFeatures);
  }
  else {
    windowObjectReference.focus();
  }

  if (!windowObjectReference) {
    throw new Error("GyreJS Debugger: No popup window found; please allow popups to open for the debugger to work.");
  }

  return windowObjectReference;
};
