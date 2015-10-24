import Immutable from "immutable";
import {hashQueryObject} from "./helpers";
const IMap = Immutable.Map;

/**
 * reducer()
 *
 * @param {Object} store Store instance
 * @param {Function} dispatch Dispatch
 * @param {Array|String} matcher Matcher
 * @param {Function} cb Callback
 * @param {Object} options Options object.
 * @returns {Function} Un-register function
 */
const reducer = (store, dispatch, matcher, cb, options) => {
  const queryHash = hashQueryObject(matcher);

  const update = (state) => {
    const queryResult = state.getIn([options.NS, "queries", queryHash, "idList"]);
    const queryInfo = state.getIn([options.NS, "queries", queryHash]);

    if (queryResult) {
      cb(queryInfo.get("status"),
        queryResult
        .reduce((memo, value, key) => {
          // Create path
          const path = key.split("/").reduce((mem, val, index) => {
            if (index % 2 === 0 && index) {
              mem.push("children");
            }
            mem.push(val);
            return mem;
          }, []);

          // Add to reducer result
          let type = key.split("/");
          type = type[type.length - 1];
          value.forEach(
            val => {
                memo = memo.mergeDeepIn(path.concat(val), state.getIn([options.NS, "data", type, val]));
            }
          );

          return memo;
        }, IMap({}))
      );
    }
    else {
      cb(queryInfo.get("status"));
    }
  };

  // Emit action to add query
  dispatch("ADD_QUERY", matcher, queryHash);

  // Return the un-register function right away.
  return store.addReducer(update);
};

export default reducer;
