// import Vue from "vue"
import Multiselect from 'vue-multiselect'
import axios from 'axios';
import lodash from 'lodash';
import iView from 'iview';

import locale from 'iview/dist/locale/mn-MN';
import CircularCountDownTimer from "vue-circular-count-down-timer";
import VueMask from 'v-mask'

Vue.component('multiselect', Multiselect)

// window.Vue = Vue;
Vue.config.productionTip = false;

// Vue.component('v-select', vSelect);
window._ = lodash;
window.axios = axios;
Vue.config.silent = true;
Vue.use(iView, {locale});
Vue.use(CircularCountDownTimer);
Vue.use(VueMask)


axios.interceptors.request.use(function (config) {
    config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    return config;
});
