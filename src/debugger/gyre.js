// Events
const events = {
  "gyreAdded": ["id"],
  "commandAdded": (id, replace = false) => ({_t: Date.now(), id, replace}),
  "commandAddedFailed": (id, replace = false, msg = "") => ({_t: Date.now(), id, replace, msg}),
  "commandIssued": ["id"],
  "eventAdded": (id) => ({_t: Date.now(), id}),
  "eventTriggered": ["id"]
};

module.exports = {
  events
};
