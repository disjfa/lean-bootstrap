let jQuery = require('jquery');
window.$   = window.jQuery = jQuery;

let Tether    = require('tether');
window.Tether = Tether;

require('bootstrap/dist/js/bootstrap.js');

import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './views/app.vue';
import Projects from './views/projects.vue';


const routes = [
    {
        path: '/projects',
        component: Projects,
        label: 'Projects',
        name: 'projects',
        menu: true,
    },
    {
        path: '*',
        redirect: 'projects',
    }
];

const router = new VueRouter({
    routes // short for routes: routes
});

import myComponents from './components/plugin';

Vue.use(VueRouter);
Vue.use(myComponents);

new Vue({
    router,
    render: h => h(App),
}).$mount('#base');
