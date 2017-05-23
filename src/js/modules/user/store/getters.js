export default {
  getUser: (state) => {
    if (state.user) {
      return state.user;
    }
    return false;
  },
  isFetching: state => state.isFetching,
};
