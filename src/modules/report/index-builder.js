
import "./bootstrap"
import ReportBuilder from './ReportBuilder.vue'

const components = {
    "report-builder": ReportBuilder
}

const install = function (Vue, options) {
    if (install.installed) return;
    Object.keys(components).forEach(key => Vue.component(key, components[key]));

};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install
