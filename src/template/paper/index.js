/**
 * Created by n0m4dz on 2/6/17.
 */
import Vue from 'vue';
import axios from 'axios';
import lodash from 'lodash';
import moment from 'moment';
import iView from 'iview';
// import locale from 'iview/dist/locale/mn-MN';
// import locale from 'iview/dist/locale/en-US';
import vmodal from 'vue-js-modal'
import VueSlimScroll from 'vue-slimscroll'
import "./components"
import {i18n} from '../../locale';
axios.interceptors.request.use(function (config) {
    config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    return config;
});

window.Vue = Vue;
window._ = lodash;
window.axios = axios;
window.moment = moment;

Vue.config.productionTip = false;
Vue.config.silent = true;
Vue.use(iView, {i18n: (key, value) => i18n.t(key, value)});
Vue.use(vmodal, {componentName: "paper-modal"});
Vue.use(VueSlimScroll);
Vue.use(require('vue-shortkey'));
