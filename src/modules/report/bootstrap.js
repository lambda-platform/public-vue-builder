import Vue from "vue"
import axios from 'axios';
import lodash from 'lodash';


Vue.config.productionTip = false;

window._ = lodash;
window.axios = axios;
Vue.config.silent = true;

axios.interceptors.request.use(function (config) {
    config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    return config;
});

