export default {
  "gyreCreated": (gId) => ({_t: Date.now(), gId}),

  "commandAdded": (gId, id, replace = false) => ({_t: Date.now(), gId, id, replace}),
  "eventAdded": (gId, id) => ({_t: Date.now(), gId, id}),
  "aggregateAdded": (gId, id) => ({_t: Date.now(), gId, id}),
  "projectionAdded": (gId, id) => ({_t: Date.now(), gId, id}),
  "listenerAdded": (gId, projectionId) => ({_t: Date.now(), gId, projectionId}),
  "listenerRemoved": (gId, projectionId) => ({_t: Date.now(), gId, projectionId}),

  "commandIssued": (gId, id, args) => ({_t: Date.now(), gId, id, args}),
  "eventTriggered": (gId, args) => ({_t: Date.now(), gId, args}),
  "projectionUpdated": (gId, callId, args, state) => ({_t: Date.now(), gId, callId, args, state})
};
