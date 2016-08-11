import Aggregate from "./aggregates";
import Reducer from "./reducers";
const isEqual = require("lodash.isequal");

const AggregateCache = (_internal, {cacheSize = 5}) => {
  const aggregates = {};
  const cache = {};

  _internal.getAggregates = () => aggregates;

  const addAggregate = (id, aggregateDefinition, replace) => {
    if (!Object.prototype.hasOwnProperty.call(aggregates, id) || replace) {
      const aggDef = Object.assign({}, aggregateDefinition);
      aggDef.reducer = Reducer(aggregateDefinition.reducer);
      aggregates[id] = Aggregate(_internal, aggDef);
    }
    else {
      console.warn(`>> GyreJS-gyre: addAggregate -> Aggregate with id: '${id}' already exists.`); // eslint-disable-line no-console
    }
  };

  const getAggregate = (id, options = {}) => {
    // Check if aggregate factory exists
    if (!Object.prototype.hasOwnProperty.call(aggregates, id)) {
      return null;
    }

    // Check cache
    if (Object.prototype.hasOwnProperty.call(cache, id)) {
      let cacheIndex = null;
      cache[id].aggregatorOptions.forEach((aggOption, index) => {
        if (isEqual(aggOption, options)) {
          cacheIndex = index;
        }
      });

      // Found
      if (cacheIndex !== null) {
        // Move instance to top
        cache[id].aggregatorOptions.splice(0, 0, cache[id].aggregatorOptions.splice(cacheIndex, 1)[0]);
        cache[id].aggregatorInstances.splice(0, 0, cache[id].aggregatorInstances.splice(cacheIndex, 1)[0]);

        // Return instance but bring it up to date first
        return cache[id].aggregatorInstances[0].__update();
      }
    }

    // Not in cache, instantiate aggregate
    const aggregate = aggregates[id](options);

    // If no cache exists already for this type of aggregate, create it.
    if (!Object.prototype.hasOwnProperty.call(cache, id)) {
      cache[id] = {
        aggregatorOptions: [],
        aggregatorInstances: []
      };
    }

    // Add aggregate instance to the top.
    cache[id].aggregatorOptions.unshift(options);
    cache[id].aggregatorInstances.unshift(aggregate);

    // If cache becomes too large, remove last entry.
    if (cache[id].aggregatorOptions.length > cacheSize && cacheSize >= 0) {
      cache[id].aggregatorOptions.pop();
      cache[id].aggregatorInstances.pop();
    }

    return aggregate;
  };

  return {
    addAggregate,
    getAggregate
  };
};

export default AggregateCache;
