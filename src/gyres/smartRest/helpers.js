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

      // If it has fields, OR an id and no children, return as endpoint.
      if (rV.fields || rV.id && !val.children) {
        yield rV;
      }

      if (val.children) {
        for (const idVal of (Array.isArray(val.id) ? val.id : [val.id])) {
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
      msg: response,
      code: response.status
    })
  );
};

/**
 * parse()
 *
 * @param {Immutable.Map} endpoint
 * @returns {*}
 */
const transform = (endpoint) => (response) => {
  if (response.success) {
    const rData = Array.isArray(response.data) ? response.data : [response.data];

    // Get idList and map data
    const idList = {};
    const data = {};
    idList[endpoint.get("root")] = [];
    data[endpoint.get("type")] = {};

    rData.forEach(entry => {
      idList[endpoint.get("root")].push(entry.id.toString());
      data[endpoint.get("type")][entry.id.toString()] = entry;
    });

    return {
      success: true,
      data,
      idList
    };
  }
  return response;
};

/**
 * fetchUrl()
 *
 * @param {String} host Endpoint host.
 * @param {Immutable.Map} endpoint Endpoint options.
 * @returns {Promise} Promise of fetch.
 */
const fetchUrl = (host, endpoint) => {
  const hostName = host || location.protocol + "//"
    + location.hostname
    + (location.port ? ":"
    + location.port : "");

  // Fetch data
  return fetch(`${hostName}/${endpoint.get("path")}`)
    .then(checkStatusAndParse)
    .then(transform(endpoint));
};

/**
 * hash()
 * Simple hash from string
 *
 * @param {String} str string
 * @returns {Number} hash Hash of string.
 */
const hash = (str) => {
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

/**
 * hashQueryObject()
 * Simple query hash from object
 *
 * @param {Object} obj Query object
 * @returns {Number} hash Hash of query.
 */
const hashQueryObject = (obj) => hash(JSON.stringify(obj));

// Helper functions
const helpers = {
  createUrls,
  fetchUrl,
  hashQueryObject
};
export default helpers;
