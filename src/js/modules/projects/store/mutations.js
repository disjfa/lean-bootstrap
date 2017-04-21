export default {
    load: (state, payload) => {
        state.projects = payload;
        state.isFetching = false;
    },
    loadProject: (state, payload) => {
        state.project = payload;
        state.isFetching = false;
    },
    isFetching: (state) => {
        state.isFetching = true;
    },
    fetchingIsDone: (state) => {
        state.isFetching = false;
    }
};