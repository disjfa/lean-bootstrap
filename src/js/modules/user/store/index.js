import mutations from './mutations';
import getters from './getters';
import actions from './actions';

const user = {
    namespaced: true,
    state: {
        user: {},
        isFetching: false,
    },
    mutations,
    getters,
    actions,
};

export default user;