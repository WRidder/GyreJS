import {observable} from "mobservable";

module.exports = {
  initialState: () => observable({ log: []}),
  events: {
    "gyreInstantiated": (state, event) => {
      state.log.push({
        time: Date.now(),
        msg: event.type
      });
    },/*
    "commandAdded": (state, event) => {
      state.log.push({
        time: Date.now(),
        msg: event.type
      });
    },*/
    "eventTriggered": (state, event) => {
      console.log()
      state.log.push({
        gId: event.gId,
        time: Date.now(),
        msg: event.type,
        payload: event.args
      });
    }
  }
};
