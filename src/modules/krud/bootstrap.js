import Vue from 'vue'
import PortalVue from 'portal-vue'

Vue.use(PortalVue)
Vue.prototype.$bus = new Vue({})
window.Vue = Vue;
Vue.config.productionTip = false;

