const actions = {};

const ADD_QUERY = "ADD_QUERY";
actions[ADD_QUERY] = (state, dispatcher, query) => {
  return state.get("queries").set(query, query);
};

export default {
  passDispatch: true,
  actions
};
