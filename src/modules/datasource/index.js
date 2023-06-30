import DataSource from "./DataSource.vue";
import QueryBuilder from "./QueryBuilder.vue";


const components = {
    'data-source':DataSource,
    'query-builder':QueryBuilder
}

const install = function (Vue, options) {
    if (install.installed) return;
    Object.keys(components).forEach(key => Vue.component(key, components[key]));
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install


