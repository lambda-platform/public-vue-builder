import "./bootstrap";

import notifList from "./views/notifList";
import widget from "./views/widget";

const components = {
    'notif-list': notifList,
    'notif-widget': widget
}

const install = function (Vue, options) {
    if (install.installed) return;
    Object.keys(components).forEach(key => Vue.component(key, components[key]));
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install
