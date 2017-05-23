export default {
  load: (state, payload) => {
    state.projects = payload;
    state.isFetching = false;
    state.error = null;
  },
  loadProject: (state, payload) => {
    state.project = payload;
    state.isFetching = false;
    state.error = null;
  },
  isFetching: (state) => {
    state.isFetching = true;
  },
  fetchingIsDone: (state) => {
    state.isFetching = false;
    state.error = null;
  },
  notallowed: (state) => {
    state.projects = {};
    state.isFetching = false;
    state.error = 'Not allowed, you can login.';
  },
};
