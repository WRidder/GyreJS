import Bus from "./bus";
import Dispatcher from "./dispatcher";
import Command from "./commands";
import Event from "./events";
import ListenerHandler from "./listeners";
import AggregateCache from "./aggregateCache";

/**
 * Gyre Factory
 *
 * @param {String} [id] Gyre ID.
 * @param {Object} [commands] Commands object.
 * @param {Object} [events] Events object.
 * @param {Object} [aggregates] Aggregates object.
 * @param {Object} [projections] Projections object.
 * @returns {Function} Gyre factory function.
 */
const gyreFactory = ({id, commands = {}, events = {}, aggregates = {}, projections = {}} = {}) =>
  (options) => {
    // Private variables
    const API = {};
    const _commands = {};
    const _events = {};

    // Id error checking
    if (typeof id !== "string") {
      throw new Error("GyreJS: Gyre should be instantiated with a valid 'id' (string).");
    }

    // Gyre internal instances
    const _internal = {};
    _internal.bus = Bus(options.volatile || true);
    _internal.dispatcher = Dispatcher(_internal, _commands, _events);
    _internal.listenerHandler = ListenerHandler(_internal);
    _internal.aggregateCache = AggregateCache(_internal, options.aggregateCache || {});
    _internal.id = id;
    _internal.getCommands = () => _commands;
    _internal.getEvents = () => _events;
    _internal.fetch = fetch;
    const commandFactory = Command(_internal);

    // Public methods
    /**
     *
     * @type {Function}
     */
    const addCommand = (cId, cFunction, replace) => {
      if (!Object.prototype.hasOwnProperty.call(_commands, cId) || replace) {
        _commands[cId] = commandFactory(cFunction, cId);
      }
      else {
        console.warn(`>> GyreJS-gyre: AddCommand -> Selector with id: '${cId}' already exists.`); // eslint-disable-line no-console
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
        addCommand(command, commandsObj[command], replace);
      });
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const addEvent = (eId, eFunction, replace) => {
      if (!Object.prototype.hasOwnProperty.call(_events, eId) || replace) {
        _events[eId] = Event(eId, eFunction);
      }
      else {
        console.warn(`>> GyreJS-gyre: addEvent -> Selector with id: '${eId}' already exists.`); // eslint-disable-line no-console
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
        addEvent(event, eventsObj[event], replace);
      });
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const addAggregate = (...args) => {
      _internal.aggregateCache.addAggregate(...args);
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const addAggregates = API.addAggregates = (aggregatesObj, replace) => {
      if (typeof aggregatesObj !== "object") {
        throw new Error("GyreJS (addEvents): first argument (selectors) should be an object.");
      }

      Object.keys(aggregatesObj).forEach(aId => {
        if (!aggregatesObj[aId].name) {
          aggregatesObj[aId].name = aId;
        }
        addAggregate(aId, aggregatesObj[aId], replace);
      });
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const addProjection = (...args) => _internal.listenerHandler.addProjection(...args) && API;

    /**
     *
     * @type {Function}
     */
    const addProjections = API.addProjections = (projectionsObj, replace) => {
      if (typeof projectionsObj !== "object") {
        throw new Error("GyreJS (addProjections): first argument should be an object.");
      }

      Object.keys(projectionsObj).forEach(pId => {
        if (!projectionsObj[pId].name) {
          projectionsObj[pId].name = pId;
        }
        addProjection(pId, projectionsObj[pId], replace);
      });
      return API;
    };

    /**
     *
     * @type {Function}
     */
    const removeProjection = API.removeProjection = (pId) =>
      _internal.listenerHandler.removeProjection(pId);

    /**
     *
     * @param lId
     * @param callback
     * @returns {Function}
     */
    const addListener = (lId, callback) => _internal.listenerHandler.addListener(lId, callback);

      /**
       *
       * @param pId
       * @returns {*}
       */
    const value = (pId) =>
      _internal.listenerHandler.getProjection(pId).getState();

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

    // Gyre API
    Object.assign(API, {
      addCommands,
      addEvents,
      addAggregates,
      addProjections,
      removeProjection,
      addListener,
      value,
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
