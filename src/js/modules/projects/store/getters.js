export default {
    getProjects: (state) => {
        return state.projects;
    },
    getProject: (state) => {
        if (state.project) {
            return state.project;
        }
        return false;
    },
    isFetching: (state) => {
        return state.isFetching;
    }
}