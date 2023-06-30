/**
 * Created by n0m4dz on 2/6/17.
 */
import "./bootstrap"
import Krud from './Krud.vue'

const components = {
    'krud': Krud,
}

const install = function (Vue, options) {
    if (install.installed) return;
    Object.keys(components).forEach(key => Vue.component(key, components[key]));
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install
