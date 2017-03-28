export default {
    load: (state, payload) => {
        state.projects = payload;
    },
    loadProject: (state, payload) => {
        state.project = payload;
    },
};