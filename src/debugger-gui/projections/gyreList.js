import {observable} from "mobservable";

module.exports = {
  initialState: () => observable({ gyreList: []}),
  events: {
    "gyreInstantiated": (state, event) => {
      state.gyreList.push({
        time: event._t,
        id: event.id
      });
    }
  }
};
