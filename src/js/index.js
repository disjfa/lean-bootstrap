let jQuery = require('jquery')
window.$ = window.jQuery = jQuery

let Tether = require('tether')
window.Tether = Tether

require('bootstrap/dist/js/bootstrap.js')

import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'
import VueRouter from 'vue-router'
import App from './views/app.vue'
import Projects from './modules/projects/views/Projects.vue'
import ProjectDetails from './modules/projects/views/ProjectDetails.vue'
import ProjectCreate from './modules/projects/views/ProjectCreate.vue'
import Home from './modules/pages/views/Home.vue'
import store from './store'

const routes = [{
  path: '/home',
  component: Home,
  label: 'Home',
  name: 'home',
  menu: true,
}, {
  path: '/projects',
  component: Projects,
  label: 'Projects',
  name: 'projects',
  menu: true,
}, {
  path: '/projects/create',
  component: ProjectCreate,
  label: 'Create a new project',
  name: 'project-create',
}, {
  path: '/projects/:id/:filter?',
  component: ProjectDetails,
  label: 'Project details',
  name: 'project-details',
}, {
  path: '*',
  redirect: 'home',
},]

const router = new VueRouter({
  routes // short for routes: routes
})

import myComponents from './components/plugin'

Vue.use(VueRouter)
Vue.use(VueHighlightJS)
Vue.use(myComponents)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#base')
