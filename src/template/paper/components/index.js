/**
 * Created by n0m4dz on 2/6/17.
 */
import Vue from 'vue'
import navbar from './navbar/navbar.vue'
import subheader from './sub-header/subheader.vue'
import subsidebar from './sub-sidebar/index.vue'
import sidebar from './sidebar/sidebar.vue'
import ribbon from './ribbon/ribbon.vue'
import offCanvas from './offcanvas/off-canvas.vue'
import infoPanel from './infopanel/info-panel.vue'
import PaperHeader from "./paper-header/PaperHeader.vue"
import UserControl from "./user-control/UserControl.vue"

window.Vue = Vue;
Vue.config.productionTip = false;

const components = {
    navbar,
    subheader,
    subsidebar,
    sidebar,
    ribbon,
    offCanvas,
    infoPanel,
    PaperHeader,
    UserControl
};

const install = function (Vue, options) {
    if (install.installed) return;
    Object.keys(components).forEach(key => Vue.component(key, components[key]));
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install
