import { polyfill } from 'es6-promise';

polyfill();
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    const list = Object(this);
    const length = list.length >>> 0;
    const thisArg = arguments[1];
    let value;

    for (let i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback/* , thisArg */) {
    let T,
      k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    const O = Object(this);
    const len = O.length >>> 0;
    if (typeof callback !== 'function') {
      throw new TypeError(`${callback} is not a function`);
    }
    if (arguments.length > 1) {
      T = arguments[1];
    }
    k = 0;

    while (k < len) {
      var kValue;

      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}

import Vue from 'vue';
import VueHighlightJS from 'vue-highlightjs';
import VueRouter from 'vue-router';
import VueAnalytics from 'vue-analytics';
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
const Popper = require('popper.js');

window.jQuery = jQuery;
window.$ = jQuery;
window.Popper = Popper;

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
  router,
});
Vue.use(VueRouter);
Vue.use(VueHighlightJS);
Vue.use(myComponents);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#base');
