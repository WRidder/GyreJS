module.exports = {
  initialState: () => ({
    gyreList: [],
    nrTriggered: 0
  }),
  events: {
    "gyreCreated": (state, event) => {
      state.gyreList = [...state.gyreList, {
        time: event._t,
        gId: event.gId
      }];
      return state;
    },
    "eventTriggered": (state) => {
      state.nrTriggered++;
      return state;
    }
  }
};
