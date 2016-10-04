export default (options) => {
  options.dev = options.dev || {};
  options.dev.warnings = options.dev.warnings || {};
  const defaultValue = (!options.dev.disableAllWarnings);

  Object.assign(options.dev.warnings, {
    "eventDidNotUpdateProjection": defaultValue
  });
};
