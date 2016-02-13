import DebugGyre from "./gyre";
import {methodWrapper, wrapGyreJSLibrary} from "./helpers";

const GDebugger = function(API) {
  const self = this;

  Object.defineProperty(self, "_gyres", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: {}
  });

  // Create internal gyre
  Object.defineProperty(self, "_debugGyre", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: API.createGyre("debugGyre", DebugGyre)({
      noDebug: true
    })
  });

  wrapGyreJSLibrary(API, this);

  // Define method events
  self.methodEvents = {
    gyre: {
      "addCommand": {
        ok: (gId, id, args) => {
          self._debugGyre.trigger("commandAdded", gId, id, args[0], args.length > 2 ? args[2] : false);
        },
        fail: (gId, id, args, err) => {
          self._debugGyre.trigger("commandAddFailed", gId, id, args[0], args.length > 2 ? args[2] : false, err);
        }
      }
    },
    bus: {
      "trigger": {
        ok: (gId, args) => {
          self._debugGyre.trigger("eventTriggered", gId, args[0]);
        }
      }
    },
    dispatcher: {}
  };
};

GDebugger.prototype.addInstantiatedGyre = function(gyre) {
  const self = this;
  const id = gyre._internal.id;
  gyre._internal.bus = methodWrapper(id, gyre._internal.bus, self.methodEvents.bus);
  gyre._internal.dispatcher = methodWrapper(id, gyre._internal.dispatcher, self.methodEvents.dispatcher);
  self._gyres[id] = methodWrapper(id, gyre, self.methodEvents.gyre);

  // Raise event
  self._debugGyre.trigger("gyreInstantiated", id);

  return self._gyres[id];
};

GDebugger.prototype.getGyres = function() {
  return this._gyres;
};

GDebugger.prototype.resetGyre = function(id) {
  return this._gyres[id]._internal.bus.trigger(Object.freeze({type: "__RESET__"}));
};

GDebugger.prototype.addProjections = function(projections) {
  return this._debugGyre.addProjections(projections);
};

module.exports = GDebugger;
