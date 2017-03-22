import Vuex from 'vuex';
import Vue from 'vue';
import projects from './../modules/projects/store';
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        projects,
    }
});

export default store;
