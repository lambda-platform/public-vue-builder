import Vue from "vue";
import {i18n} from '../../locale/index';
import axios from "axios";
import router from "./router";


window.Vue = Vue;
window.axios = axios;

window.axios.defaults.headers.common = {
    "X-Requested-With": "XMLHttpRequest",
    "X-CSRF-TOKEN": document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content"),
};
Vue.config.productionTip = false;

function loadApp() {

    if (window.lambda.local_agent && typeof window.lambda.local_agent !== undefined && window.lambda.local_agent !== null && window.lambda.local_agent !== '' && window.lambda.local_agent !== undefined) {
        try {
            return require("agent/index.vue").default;
        } catch (err) {
            console.log('not local');
        }
    }
    return require(`./views/theme/${window.lambda.theme}/index`).default;
}

new Vue({
    router,
    i18n,
    render: h => h(loadApp())
}).$mount('#app');

