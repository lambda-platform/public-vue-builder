import "./bootstrap";


const ChartBuilder = ()=> import(/* webpackChunkName: "chart-build-el" */'./Builder.vue');


const components = {
    'chart-builder':ChartBuilder,

}

const install = function (Vue, options) {
    if (install.installed) return;
    Object.keys(components).forEach(key => Vue.component(key, components[key]));
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install


