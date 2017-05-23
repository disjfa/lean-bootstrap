export default {
  load: (state, payload) => {
    state.user = payload.user || {};
    state.isFetching = false;
  },
  isFetching: (state) => {
    state.isFetching = true;
  },
};
