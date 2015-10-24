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
 * @param {String} nameSpace Namespace
 * @returns {Function} Un-register function
 */
const reducer = (store, dispatch, matcher, cb, nameSpace) => {
  const queryHash = hashQueryObject(matcher);

  const update = (state) => {
    const queryResult = state.getIn([nameSpace, "queries", queryHash, "idList"]);
    const queryInfo = state.getIn([nameSpace, "queries", queryHash]);

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
                memo = memo.mergeDeepIn(path.concat(val), state.getIn([nameSpace, "data", type, val]));
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
