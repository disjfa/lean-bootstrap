import Components from './index'

function plugin(Vue) {
    Object.keys(Components).forEach(key => {
        Vue.component(key, Components[key])
    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

module.exports = plugin;
