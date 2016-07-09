import DebugGyre from "./gyre";
import GyreJS from "./../index";
import {methodWrapper} from "./helpers";
import {methodEvents} from "./methodEvents";

const GDebugger = function () {
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
    value: GyreJS.createGyre(DebugGyre, {
      noDebug: true
    })
  });

  // Define method events
  self.methodEvents = methodEvents(self._debugGyre);
};

GDebugger.prototype.watchGyre = function (gyre) {
  const self = this;
  const id = gyre._internal.id;
  gyre._internal.bus = methodWrapper(id, gyre._internal.bus, self.methodEvents(gyre).bus);
  gyre._internal.dispatcher = methodWrapper(id, gyre._internal.dispatcher, self.methodEvents(gyre).dispatcher);
  gyre._internal.listenerHandler = methodWrapper(id, gyre._internal.listenerHandler, self.methodEvents(gyre).listenerHandler);
  self._gyres[id] = methodWrapper(id, gyre, self.methodEvents(gyre).gyre);

  // Wrap fetch
  const oldFetch = gyre._internal.fetch;
  gyre._internal.fetch = (url) =>
    oldFetch(url).then(response => response);

    // Raise event
  self._debugGyre.trigger("gyreCreated", id);

  // Add already existing objects
  Object.keys(gyre._internal.getCommands()).forEach(command => {
    self.methodEvents(gyre).gyre.addCommand.before(id, null, [command]);
  });

  Object.keys(gyre._internal.getEvents()).forEach(event => {
    self.methodEvents(gyre).gyre.addEvent.before(id, null, [event]);
  });

  Object.keys(gyre._internal.getAggregates()).forEach(aggregate => {
    self.methodEvents(gyre).gyre.addAggregate.before(id, null, [aggregate]);
  });

  Object.keys(gyre._internal.getProjections()).forEach(projection => {
    self.methodEvents(gyre).gyre.addProjection.before(id, null, [projection]);
  });

  Object.keys(gyre._internal.getListeners()).forEach(listener => {
    self.methodEvents(gyre).gyre.addListener.before(id, null, [listener]);
  });

  return self._gyres[id];
};

GDebugger.prototype.getGyres = function () {
  return this._gyres;
};

GDebugger.prototype.resetGyre = function (id) {
  return this._gyres[id]._internal.bus.trigger(Object.freeze({type: "__RESET__"}));
};

GDebugger.prototype.addProjections = function (projections) {
  return this._debugGyre.addProjections(projections);
};

module.exports = GDebugger;
