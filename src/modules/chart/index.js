import "./bootstrap";

const Chart = ()=> import(/* webpackChunkName: "chart-el" */'./Chart.vue');
const ChartRest = ()=> import(/* webpackChunkName: "chart-rest" */'./ChartRest.vue');

const components = {
    'chart':Chart,
    'chartRest':ChartRest,
}

const install = function (Vue, options) {
    if (install.installed) return;
    Object.keys(components).forEach(key => Vue.component(key, components[key]));
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install


