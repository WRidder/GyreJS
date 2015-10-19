import {createUrls, fetchUrl, hashQuery} from "./helpers";
import Immutable from "immutable";
const IMap = Immutable.Map;

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

actions[ADD_QUERY] = (state, query, queryHash, dispatch) => {
  let tState = state;
  const currentQuery = state.getIn(["queries", queryHash]);

  if (currentQuery) {
    tState = state.setIn(["queries", queryHash],
      currentQuery.set("count", currentQuery.get("count") + 1));

    if (currentQuery.get("status") === STATUS_COMPLETED) {
      tState = state.setIn(["queries", queryHash],
          currentQuery.set("status", STATUS_UPDATING));
      dispatch(FETCH_QUERY, queryHash);
    }
  }
  else {
    tState = state.setIn(["queries", queryHash],
      IMap({
        status: STATUS_LOADING,
        count: 1,
        urls: createUrls(query),
        hash: queryHash,
        idList: []
      })
    );
    dispatch(FETCH_QUERY, tState.getIn(["queries", queryHash]));
  }
  return tState;
};

actions[FETCH_QUERY] = (state, query, dispatch) => {
  // Fetch urls
  const promiseArray = [];
  for (const endpoint of query.get("urls")) {
    promiseArray.push(fetchUrl(endpoint));
  }

  Promise.all(promiseArray).then(function(result) {
    dispatch(COMPLETE_QUERY, result, query.get("hash"));
  });
};

actions[COMPLETE_QUERY] = (state, resultArray, queryHash) => {
  let tState = state;
  const currentQuery = state.getIn(["queries", queryHash]);
  let succeeded = true;
  const dataArray = [];
  const idArray = [];
  let errorMsg;
  for (let result of resultArray) {
    if (!result.data) {
      errorMsg = result.msg;
      succeeded = false;
      break;
    }
    dataArray.push(result.data);
    idArray.push(result.idList);
  }

  if (succeeded) {
    let mergedIds = Object.assign({}, ...idArray);
    let mergedData = {};
    for (let dataEntry of dataArray) {
      for (let dataKey of Object.keys(dataEntry)) {
        if (mergedData.hasOwnProperty(dataKey)) {
          mergedData[dataKey] = Object.assign({},
            mergedData[dataKey], dataEntry[dataKey]);
        }
        else {
          mergedData[dataKey] = dataEntry[dataKey];
        }
      }
    }
    tState = tState.setIn(["queries", queryHash],
      currentQuery.merge({
        "status": STATUS_COMPLETED,
        "idList": mergedIds
      }));
    tState = tState.mergeDeepIn(["data"], Immutable.fromJS(mergedData));
    return tState;
  }

  tState = state.setIn(["queries", queryHash],
    currentQuery.set("status", STATUS_ERROR));
  return tState;
};

export default actions;
