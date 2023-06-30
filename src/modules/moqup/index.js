/**
 * Created by n0m4dz on 2/6/17.
 */
import "./bootstrap"
import Moqup from './Moqup.vue'
import Builder from "./Builder.vue"

const components = {
    "moqup": Moqup,
    "moqup-builder": Builder
}

const install = function (Vue, options) {
    if (install.installed) return;
    Object.keys(components).forEach(key => Vue.component(key, components[key]));
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
export default install
