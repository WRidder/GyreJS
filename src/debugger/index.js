const GDebugger = function(API) {
  this.gyres = {};

  const origInstantiateGyre = API.instantiateGyre;
  API.instantiateGyre = (id, options) => {
    return this.addGyre(origInstantiateGyre(id, options));
  };
};

GDebugger.prototype.addGyre = function(gyre) {
  const self = this;
  const id = gyre._internal.id;

  self.gyres[id] = {
    gyre: {},
    log: {
      calls: [],
      dispatcherCalls: [],
      busCalls: [],
      events: [],
      commands: []
    }
  };
  self.addBus(id, gyre._internal);
  self.addDispatcher(id, gyre._internal);
  self.gyres[id].gyre._internal = gyre._internal;

  return Object.keys(gyre).reduce((methods, gyreMethod) => {
    methods[gyreMethod] = (...args) => {
      self.gyres[id].log.calls.push([gyreMethod, Date.now(), ...args]);
      return gyre[gyreMethod](...args);
    };
    return methods;
  }, self.gyres[id].gyre);
};

GDebugger.prototype.addBus = function(id, _internal) {
  const self = this;
  const originalBus = _internal.bus;
  _internal.bus = Object.keys(originalBus).reduce((methods, busMethod) => {
    methods[busMethod] = (...args) => {
      self.gyres[id].log.busCalls.push([busMethod, Date.now(), ...args]);
      return originalBus[busMethod](...args);
    };
    return methods;
  }, {});
};

GDebugger.prototype.addDispatcher = function(id, _internal) {
  const self = this;
  const originalDispatcher = _internal.dispatcher;
  _internal.dispatcher = Object.keys(originalDispatcher).reduce((methods, dpMethod) => {
    methods[dpMethod] = (...args) => {
      self.gyres[id].log.dispatcherCalls.push([dpMethod, Date.now(), ...args]);
      return originalDispatcher[dpMethod](...args);
    };
    return methods;
  }, {});
};

GDebugger.prototype.getGyres = function() {
  return this.gyres;
};

GDebugger.prototype.getLogs = function(id) {
  return this.gyres[id].log;
};

GDebugger.prototype.resetGyre = function(id) {
  return this.gyres[id].gyre._internal.bus.trigger(Object.freeze({type: "__RESET__"}));
};

module.exports = GDebugger;
