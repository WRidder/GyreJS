module.exports = {
  initialState: () => ({
    gyreList: [],
    nrTriggered: 0
  }),
  events: {
    "gyreInstantiated": (state, event) => {
      state.gyreList = [...state.gyreList, {
        time: event._t,
        gId: event.gId
      }];
      return state;
    },
    "eventTriggered": (state, event) => {
      state.nrTriggered++;
      return state;
    }
  }
};
