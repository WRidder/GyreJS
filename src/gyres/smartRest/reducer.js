/**
 * hashQuery()
 * Simple query hash from object
 *
 * @param {Object} obj Query object
 * @returns {Number} hash Hash of query.
 */
const hashQuery = (obj) => {
  const str = JSON.stringify(obj);
  const len = str.length;
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

const searchTree = (query, idList, data, dest, branch) => {
  branch = branch || "";

  for (var k of Object.keys(query)) {
    // Get idś for this branch
    const ids = idList[branch + k] ? idList[branch + k] : query[k].id;
    dest[k] = [];

    for (let entryId of Array.isArray(ids) ? ids : [ids]) {
      if (query[k].fields) {
        const dataEntry = data.getIn([k, entryId.toString()]);
        dest[k].push({
          data: dataEntry
        });
      }
      else {
        dest[k].push({});
      }

      // Check for children
      if (query[k].hasOwnProperty("children")) {
        let newDest = dest[k][dest[k].length - 1].children = {};
        searchTree(query[k].children, idList, data, newDest, branch + k + "/" + entryId + "/");
      }
    }
  }
};

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
  const queryHash = hashQuery(matcher);
  const update = (state) => {
    let finalData = {};
    const queryInfo = state.getIn([nameSpace, "queries", queryHash]);

    if (queryInfo) {
      const status = queryInfo.get("status");
      if (status === "COMPLETED" || status === "UPDATING") {
        const idList = queryInfo.get("idList");
        searchTree(matcher, idList, state.getIn([nameSpace, "data"]), finalData);
      }
      cb(status, finalData);
    }
  };

  // Emit action to add query
  dispatch("ADD_QUERY", matcher, queryHash);

  // Return the un-register function right away.
  return store.addReducer(update);
};

export default reducer;
