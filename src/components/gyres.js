import Bus from "./bus";
import Dispatcher from "./dispatcher";
import Command from "./commands";
import Event from "./events";
import ListenerHandler from "./listeners";
import AggregateCache from "./aggregateCache";
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
  (options) => {
    // Private variables
    const API = {};
    const _commands = {};
    const _events = {};

    // Gyre internal instances
    const _internal = {};
    _internal.bus = Bus();
    _internal.dispatcher = Dispatcher(_internal, _commands, _events);
    _internal.ListenerHandler = ListenerHandler(_internal);
    _internal.aggregateCache = AggregateCache(_internal, options.aggregateCache || {});
    _internal.id = options.gId;
    const commandFactory = Command(_internal);

    // Public methods
    /**
     *
     * @type {Function}
     */
    const addCommand = API.addCommand = (id, cFunction, replace) => {
      if (!Object.prototype.hasOwnProperty.call(_commands, id) || replace) {
        _commands[id] = commandFactory(cFunction, id);
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
    const addAggregate = API.addAggregate = (...args) => {
      _internal.aggregateCache.addAggregate(...args);
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
    const addProjection = API.addProjection = (...args) => _internal.ListenerHandler.addProjection(...args) && API;

    /**
     *
     * @type {Function}
     */
    const addProjections = API.addProjections = (projectionsObj, replace) => {
      if (typeof projectionsObj !== "object") {
        throw new Error("GyreJS (addProjections): first argument should be an object.");
      }

      Object.keys(projectionsObj).forEach(id => {
        API.addProjection(id, projectionsObj[id], replace);
      });
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const removeProjection = API.removeProjection = (id) => {
      return _internal.ListenerHandler.removeProjection(id);
    };

    /**
     *
     * @param id
     * @param callback
     * @returns {Function}
     */
    const addListener = (id, callback) => _internal.ListenerHandler.addListener(id, callback);

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

    // being explicit
    Object.defineProperty(API, "_internal", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: _internal
    });

    return Object.freeze(API);
  };

export default gyreFactory;
