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
 * @param {Object} NS NameSpace from Options object.
 * @returns {Function} Un-register function
 */
const reducer = (store, dispatch, matcher, cb, {NS}) => {
  const queryHash = hashQueryObject(matcher);

  const update = (state) => {
    const queryResult = state.getIn([NS, "queries", queryHash, "idList"]);
    const queryInfo = state.getIn([NS, "queries", queryHash]);

    if (queryResult) {
      cb(queryInfo.get("status"),
        queryResult
        .reduce((mm, value, key) => {
          let memo = mm;

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
              memo = memo.mergeDeepIn(path.concat(val), state.getIn([NS, "data", type, val]));
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
