module.exports = {
  initialState: () => ({log: []}),
  events: {
/*    "gyreInstantiated": (state, event) => {
      state.log = [...state.log, {
        time: Date.now(),
        msg: event.type
      }];
      return state;
    },*//*
    "commandAdded": (state, event) => {
      state.log.push({
        time: Date.now(),
        msg: event.type
      });
    },*/
    "eventTriggered": (state, event) => {
      state.log = [...state.log, {
        gId: event.gId,
        time: event._t,
        msg: event.type,
        payload: event.args
      }];
      return state;
    },
    "commandIssued": (state, event) => {
      state.log = [...state.log, {
        gId: event.gId,
        time: event._t,
        msg: event.type,
        payload: event.args
      }];
      return state;
    }
  }
};
