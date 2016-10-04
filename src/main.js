import Gyre from "./components/gyres";

const createGyre = (definition, options = {}) => {
  if (typeof definition !== "object") {
    throw new Error("GyreJS (createGyre): First argument should be an object containing the gyre definition.");
  }

  // Augment the options with development specific settings
  if (ENV.dev) {
    require("./dev/options").default(options);
  }

  return Gyre(Object.assign({}, definition))(options);
};

module.exports = {
  createGyre
};
