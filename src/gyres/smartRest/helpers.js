/**
 * extractEndpoints()
 *
 * @param {Object} query Query object.
 * @returns {Object[]} Array of endpoints.
 */
const extractEndpoints = (query) => {
  function *processQuery(q, root, branch) {
    for (const i of Object.keys(q)) {
      const val = q[i];
      const tBranch = branch ? branch.concat([i]) : [i];
      const rV = {
        name: root ? root + "/" + i : i,
        branch: tBranch,
        id: val.id ? val.id : null,
        fields: val.fields ? val.fields : null
      };
      if (rV.fields) {
        yield rV;
      }

      if (val.children) {
        for (let idVal of (Array.isArray(val.id) ? val.id : [val.id])) {
          yield *processQuery(val.children, idVal ? i + "/" + idVal : i, tBranch);
        }
      }
    }
  }

  const it = processQuery(query);
  let res = it.next();
  const urlDefs = [];
  while (!res.done) {
    urlDefs.push(res.value);
    res = it.next();
  }
  return urlDefs;
};

/**
 * createUrls()
 * Creates urls from query
 *
 * @param {Object}query Query object.
 * @returns {String[]} Array of urls.
 */
const createUrls = (query) => {
  const urlDefs = extractEndpoints(query);
  return urlDefs.map(urlDef => {
    var urlString = urlDef.name;
    if (urlDef.hasOwnProperty("id") && urlDef.id !== null) {
      urlString = urlString + "/" + urlDef.id;
    }

    if (Array.isArray(urlDef.fields) && urlDef.fields.length > 0) {
      urlString = urlString + "?fields=" + urlDef.fields.toString();
    }
    return {
      path: urlString,
      type: urlDef.branch[urlDef.branch.length - 1],
      root: urlDef.name
    };
  });
};

/**
 * checkStatusAndParse()
 *
 * @param {Object} response Fetch response.
 * @returns {Object} Parsed response.
 */
const checkStatusAndParse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.json().then((data) => {
      return {
        success: true,
        data
      };
    });
  }
  return new Promise((resolve) =>
    resolve({
      success: false,
      msg: response
    })
  );
};

/**
 * parse()
 *
 * @param endpoint
 * @returns {*}
 */
const transform = (endpoint) => (response) => {
  if (response.success) {
    const rData = Array.isArray(response.data) ? response.data : [response.data];

    // Get idList and map data
    const idList = {};
    const data = {};
    idList[endpoint.root] = [];
    data[endpoint.type] = {};

    rData.forEach(entry => {
      idList[endpoint.root].push(entry.id);
      data[endpoint.type][entry.id.toString()] = entry;
    });

    return {
      data,
      idList
    };
  }
  return {
    msg: response
  };
};

/**
 * fetchUrl()
 *
 * @param {String} endpoint Url
 * @returns {Promise} Promise of fetch.
 */
const fetchUrl = (endpoint) => {
  // Fetch data
  return fetch("https://localhost:8080/" + endpoint.path)
    .then(checkStatusAndParse)
    .then(transform(endpoint));
};

// Helper functions
const helpers = {
  createUrls,
  fetchUrl
};
export default helpers;
