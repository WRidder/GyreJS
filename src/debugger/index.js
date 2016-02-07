import DebugGyre from "./gyre";

const helpers = {
  methodWrapper: (id, api, mEvents) => {
    const originalAPI = api;
    return Object.keys(originalAPI).reduce((methods, apiMethod) => {
      methods[apiMethod] = (...args) => {
        let result;
        try {
          result = originalAPI[apiMethod](...args);
          if (mEvents[apiMethod] && mEvents[apiMethod].ok) {
            mEvents[apiMethod].ok(id, args);
          }
        }
        catch (e) {
          if (mEvents[apiMethod] && mEvents[apiMethod].fail) {
            mEvents[apiMethod].fail(id, args, e.name + ":" + e.message);
            console.error(e.name + ":" + e.message); // eslint-disable-line no-console
          }
          else {
            throw e;
          }
        }
        return result;
      };
      return methods;
    }, {});
  },

  wrapGyreJSLibrary: (API, gDebugger) => {
    const origInstantiateGyre = API.instantiateGyre;
    API.instantiateGyre = (id, options = {}) => {
      if (options.noDebug === true) {
        return origInstantiateGyre(id, options);
      }
      return gDebugger.addGyre(origInstantiateGyre(id, options));
    };
  }
};

const GDebugger = function(API) {
  const self = this;
  this.gyres = {};
  helpers.wrapGyreJSLibrary(API, this);

  // Create internal gyre
  self.debugGyre = API.createGyre("debugGyre", {})({
    noDebug: true
  });

  // Define method events
  self.methodEvents = {
    gyre: {
      "addCommand": {
        ok: (id, args) => {
          self.debugGyre.trigger("commandAdded", id, args[0], args.length > 2 ? args[2] : false);
        },
        fail: (id, args, err) => {
          self.debugGyre.trigger("commandAddFailed", id, args[0], args.length > 2 ? args[2] : false, err);
        }
      }
    },
    bus: {},
    dispatcher: {}
  };
};

GDebugger.prototype.addGyre = function(gyre) {
  const self = this;
  const id = gyre._internal.id;
  gyre._internal.bus = helpers.methodWrapper(id, gyre._internal.bus, self.methodEvents.bus);
  gyre._internal.dispatcher = helpers.methodWrapper(id, gyre._internal.dispatcher, self.methodEvents.dispatcher);
  self.gyres[id] = helpers.methodWrapper(id, gyre, self.methodEvents.gyre);
  return self.gyres[id];
};

GDebugger.prototype.getGyres = function() {
  return this.gyres;
};

GDebugger.prototype.resetGyre = function(id) {
  return this.gyres[id]._internal.bus.trigger(Object.freeze({type: "__RESET__"}));
};

module.exports = GDebugger;
