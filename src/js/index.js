import Vue from 'vue';
import VueHighlightJS from 'vue-highlightjs';
import VueRouter from 'vue-router';
import VueAnalytics from 'vue-analytics'
import toastr from 'toastr';
import App from './views/app.vue';
import Projects from './modules/projects/views/Projects.vue';
import MyProjects from './modules/projects/views/MyProjects.vue';
import ProjectDetails from './modules/projects/views/ProjectDetails.vue';
import ProjectCreate from './modules/projects/views/ProjectCreate.vue';
import Home from './modules/pages/views/Home.vue';
import store from './store';
import myComponents from './components/plugin';

const jQuery = require('jquery');
const Tether = require('tether');

window.jQuery = jQuery;
window.$ = jQuery;
window.Tether = Tether;

require('bootstrap/dist/js/bootstrap.js');

toastr.options.closeButton = true;
toastr.options.positionClass = 'toast-bottom-full-width';

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
  path: '/my-projects',
  component: MyProjects,
  label: 'My projects',
  name: 'my-projects',
  menu: true,
}, {
  path: '/projects/create',
  component: ProjectCreate,
  label: 'Create a new project',
  name: 'project-create',
}, {
  path: '/projects/:id/:route?/:filter?',
  component: ProjectDetails,
  label: 'Project details',
  name: 'project-details',
}, {
  path: '*',
  redirect: 'home',
}];

const router = new VueRouter({
  routes, // short for routes: routes
});

Vue.use(VueAnalytics, {
  id: 'UA-104314578-1',
  router
});
Vue.use(VueRouter);
Vue.use(VueHighlightJS);
Vue.use(myComponents);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#base');
