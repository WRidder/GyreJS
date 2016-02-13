export default {
  "gyreInstantiated": (id) => ({_t: Date.now(), id}),
  "commandAdded": (gId, id, replace = false) => ({_t: Date.now(), gId, id, replace}),
  "commandAddedFailed": (gId, id, replace = false, msg = "") => ({_t: Date.now(), gId, id, replace, msg}),
  "commandIssued": ["gId", "id"],
  "eventAdded": (gId, id, gyreId) => ({_t: Date.now(), gyreId, gId, id}),
  "eventTriggered": ["gId", "args"]
};
