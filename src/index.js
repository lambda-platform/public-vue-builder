/**
 * Created by n0m4dz on 2/6/17.
 */
import Vue from "vue";
import axios from 'axios';
import {i18n} from './locale/index';
import router from './router'
import App from './app.vue';
import {
    store
} from './store/store'
window.axios = axios;

if(window.init) {
    Vue.prototype.$init = window.init
    if(window.init.user){
        Vue.prototype.$user = window.init.user;
    }
    if(window.init.project){
        Vue.prototype.$project = window.init.project;
        Vue.prototype.$projectSettings = window.init.projectSettings;
    }
}

axios.interceptors.request.use(function (config) {
    config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    return config;
});

new Vue({
    router,
    i18n,
    store,
    el: '#puzzle',
    extends: App
})


