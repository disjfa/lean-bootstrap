import Vuex from 'vuex'
import Vue from 'vue'
import projects from './../modules/projects/store'
import user from './../modules/user/store'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    projects,
    user,
  }
})

export default store
