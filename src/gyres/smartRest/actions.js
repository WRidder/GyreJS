import {createUrls, fetchUrl} from "./helpers";
import Immutable from "immutable";
const IMap = Immutable.Map;
const IList = Immutable.List;

// Status constants
const STATUS_COMPLETED = "COMPLETED";
const STATUS_LOADING = "LOADING";
const STATUS_UPDATING = "UPDATING";
const STATUS_ERROR = "ERROR";

// Actions
const actions = {};
const ADD_QUERY = "ADD_QUERY";
const FETCH_QUERY = "FETCH_QUERY";
const COMPLETE_QUERY = "COMPLETE_QUERY";
const FAIL_QUERY = "FAIL_QUERY";
const CREATE = "CREATE";
const UPDATE = "UPDATE";
const DELETE = "DELETE";

// Misc
const newQuery = IMap({
  status: null,
  count: 0
});

export default (options) => {
  /**
   * Action: ADD_QUERY
   *
   * @param state
   * @param query
   * @param hash
   * @param dispatch
   */
  actions[ADD_QUERY] = (state, query, hash, dispatch) =>
    state.reduce((memo, value, key) => {
      if (key === "queries") {
        memo = memo.set("queries",
          value.set(hash, newQuery
              .merge(value.get(hash))
              .merge({
                hash: hash,
                urls: createUrls(query)
              })
              .map((qvVal, qvKey) => {
                switch (qvKey) {
                  case "count": {
                    return qvVal + 1;
                  }
                  case "status": {
                    return qvVal === STATUS_COMPLETED ? STATUS_UPDATING : qvVal;
                  }
                  default:
                    return qvVal;
                }
              })
          )
            .map((qVal, qKey) => {
              if (qKey === hash) {
                if ([STATUS_LOADING, STATUS_UPDATING].indexOf(qVal.get("status")) === -1) {
                  dispatch(FETCH_QUERY, qVal);
                }
              }
              return qVal.set("status", qVal.get("status") || STATUS_LOADING);
            })
        );
      }
      return memo;
    }, state);

  /**
   * Action: FETCH_QUERY
   *
   * @param state
   * @param query
   * @param dispatch
   */
  actions[FETCH_QUERY] = (state, query, dispatch) => {
    // Fetch urls
    const promiseArray = query.get("urls").map(endpoint =>
      fetchUrl(options.hostname, endpoint));

    Promise.all(promiseArray)
      .then(resultArray => {
        const fetchResult = resultArray.reduce((memo, result) => {
          if (!result.success) {
            memo.success = false;
            memo.msgList = memo.msgList.push(result.msg);
          }
          return memo;
        }, {success: true, msgList: IList([])});

        if (fetchResult.success) {
          dispatch(COMPLETE_QUERY, resultArray, query);
        }
        else {
          dispatch(FAIL_QUERY, fetchResult.msgList, query);
        }
      })
      .catch(error => {
        dispatch(FAIL_QUERY, [error], query);
      });
  };

  /**
   * Action: COMPLETE_QUERY
   *
   * @param state
   * @param resultArray
   * @param query
   */
  actions[COMPLETE_QUERY] = (state, resultArray, query) =>
    state.reduce((memo, value, key) => {
      if (key === "queries") {
        memo = memo.set("queries",
          value.map((q, k) => {
            if (k === query.get("hash")) {
              q = q.merge({
                "status": STATUS_COMPLETED,
                "idList": resultArray.reduce((prev, next) => prev.merge(next.idList), IMap({}))
              });
            }
            return q;
          })
        );
      }

      if (key === "data") {
        memo = memo.set("data",
          resultArray.reduce((prev, result) =>
            prev.mergeDeep(result.data), memo.get("data"))
        );
      }

      return memo;
    }, state);

  /**
   * Action: FAIL_QUERY
   *
   * @param state
   * @param msgList
   * @param query
   */
  actions[FAIL_QUERY] = (state, msgList, query) =>
    state.reduce((memo, value, key) => {
      if (key === "queries") {
        memo = memo.set("queries",
          value.map((q, k) => {
            if (k === query.get("hash")) {
              q = q.merge({
                "status": STATUS_ERROR,
                "msg": msgList
              });
            }
            return q;
          })
        );
      }

      return memo;
    }, state);

  return actions;
}
