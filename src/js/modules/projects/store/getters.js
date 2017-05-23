export default {
  getProjects: state => state.projects,
  getProject: (state) => {
    if (state.project) {
      return state.project;
    }
    return false;
  },
  isFetching: state => state.isFetching,
  getError: state => state.error,
};
