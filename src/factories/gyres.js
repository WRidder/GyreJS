import Bus from "./bus";
import Dispatcher from "./dispatcher";
import Command from "./commands";
import Event from "./events";
import Aggregate from "./aggregates";
import Projection from "./projections";
import tickers from "./tickers";

/**
 * Gyre Factory
 *
 * @param {Function} [ticker] Store update tick function.
 * @param {Object} [commands] Commands object.
 * @param {Object} [events] Events object.
 * @param {Object} [aggregates] Aggregates object.
 * @param {Object} [projections] Projections object.
 * @returns {Function} Gyre factory function.
 */
const gyreFactory = ({ticker = "synchronous", commands = {}, events = {}, aggregates = {}, projections = {}} = {}) =>
  ({gId, gyrejsDebugger}) => {
    // Private variables
    let API = {};
    const _aggregates = {};
    const _commands = {};
    const _events = {};
    const _projections = {};

    // Gyre internal instances
    const _internal = {};
    _internal.bus = Bus();
    _internal.dispatcher = Dispatcher(_internal, _commands, _events);
    const commandFactory = Command(_aggregates, _internal);

    // Public methods
    /**
     *
     * @type {Function}
     */
    const addCommand = API.addCommand = (id, cFunction, replace) => {
      if (!Object.prototype.hasOwnProperty.call(_commands, id) || replace) {
        _commands[id] = commandFactory(cFunction);
      }
      else {
        console.warn(`>> GyreJS-gyre: AddCommand -> Selector with id: '${id}' already exists.`); // eslint-disable-line no-console
      }
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const addCommands = API.addCommands = (commandsObj, replace) => {
      if (typeof commandsObj !== "object") {
        throw new Error("GyreJS (addSelectors): first argument (selectors) should be an object.");
      }

      Object.keys(commandsObj).forEach(command => {
        API.addCommand(command, commandsObj[command], replace);
      });
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const addEvent = API.addEvent = (id, eFunction, replace) => {
      if (!Object.prototype.hasOwnProperty.call(_events, id) || replace) {
        _events[id] = Event(id, eFunction);
      }
      else {
        console.warn(`>> GyreJS-gyre: addEvent -> Selector with id: '${id}' already exists.`); // eslint-disable-line no-console
      }
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const addEvents = API.addEvents = (eventsObj, replace) => {
      if (typeof eventsObj !== "object") {
        throw new Error("GyreJS (addEvents): first argument (selectors) should be an object.");
      }

      Object.keys(eventsObj).forEach(event => {
        API.addEvent(event, eventsObj[event], replace);
      });
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const addAggregate = API.addAggregate = (id, aFunction, replace) => {
      if (!Object.prototype.hasOwnProperty.call(_aggregates, id) || replace) {
        _aggregates[id] = Aggregate(_internal, aFunction);
      }
      else {
        console.warn(`>> GyreJS-gyre: addEvent -> Selector with id: '${id}' already exists.`); // eslint-disable-line no-console
      }
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const addAggregates = API.addAggregates = (_aggregatesObj, replace) => {
      if (typeof _aggregatesObj !== "object") {
        throw new Error("GyreJS (addEvents): first argument (selectors) should be an object.");
      }

      Object.keys(_aggregatesObj).forEach(id => {
        API.addAggregate(id, _aggregatesObj[id], replace);
      });
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const addProjection = API.addProjection = (id, pFunction, replace) => {
      if (!Object.prototype.hasOwnProperty.call(_projections, id) || replace) {
        _projections[id] = Projection(_internal, pFunction);
      }
      else {
        console.warn(`>> GyreJS-gyre: addProjection -> Projection with id: '${id}' already exists.`); // eslint-disable-line no-console
      }
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const addProjections = API.addProjections = (prjctsObj, replace) => {
      if (typeof prjctsObj !== "object") {
        throw new Error("GyreJS (addProjections): first argument should be an object.");
      }

      Object.keys(prjctsObj).forEach(id => {
        API.addProjection(id, prjctsObj[id], replace);
      });
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const removeProjection = API.removeProjection = (id) => {
      if (!_projections.hasOwnProperty(id)) {
        console.warn(`>> GyreJS: (removeProjection) A projection with id:'${id}' is not registered.`); // eslint-disable-line no-console
        return false;
      }

      if (_projections[id].destroy(id)) {
        delete _projections[id];
        return true;
      }
      return false;
    };

    /**
     *
     * @param id
     * @param callback
     * @returns {*}
     */
    const addListener = (id, callback) => {
      if (!_projections.hasOwnProperty(id)) {
        console.warn(`>> GyreJS: (addListener) A projection with id:'${id}' is not registered.`); // eslint-disable-line no-console
        return false;
      }
      if (typeof callback !== "function") {
        throw new Error("GyreJS (addListener): The second argument, callback, should be a function.");
      }

      return _projections[id].addListener(callback);
    };

    /**
     * Issue a registered command.
     *
     * @param {Array} args Arguments.
     * @returns {Object} API Chainable gyre instance.
     */
    const issue = (...args) => {
      _internal.dispatcher.issueCommand(...args);
      return API;
    };

    /**
     * Trigger a registered event.
     *
     * @param {Array} args Arguments.
     * @returns {Object} API Chainable gyre instance.
     */
    const trigger = (...args) => {
      _internal.dispatcher.triggerEvent(...args);
      return API;
    };

    // Setup
    addCommands(commands);
    addEvents(events);
    addAggregates(aggregates);
    addProjections(projections);
    _internal.bus.setTicker(tickers.get(ticker));

    // Gyre API
    Object.assign(API, {
      addCommand,
      addCommands,
      addEvent,
      addEvents,
      addAggregate,
      addAggregates,
      addProjection,
      addProjections,
      removeProjection,
      addListener,
      issue,
      trigger
    });

    if (gyrejsDebugger) {
      API = gyrejsDebugger.addGyre(gId, API);
      _internal.bus = gyrejsDebugger.addBus(gId, _internal.bus);
      _internal.dispatcher = gyrejsDebugger.addDispatcher(gId, _internal.dispatcher);
    }
    return Object.freeze(API);
  };

export default gyreFactory;
