import "./scss/agent.scss"
import "./bootstrap";

import RenderPage from "./pages/render/views/index";
import RenderModule from "./pages/render/views/module";

const components = {
    'render-page': RenderPage,
    'render-module': RenderModule
};

const install = function (Vue, options) {
    if (install.installed) return;
    Object.keys(components).forEach(key => Vue.component(key, components[key]));
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install
