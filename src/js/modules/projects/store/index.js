import mutations from './mutations';
import getters from './getters';
import actions from './actions';

const projects = {
    namespaced: true,
    state: {
        projects: [],
        project: false,
        isFetching: false,
    },
    mutations,
    getters,
    actions,
};

export default projects;