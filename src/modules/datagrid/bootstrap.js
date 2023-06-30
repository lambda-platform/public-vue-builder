import Vue from 'vue'
import axios from 'axios'
window.Vue = Vue;
window.axios = axios;
import InputMask from 'vue-input-mask';
import GridGroup from './GridGroup';

Vue.config.productionTip = false;

Vue.use(InputMask)
Vue.component("grid-group", GridGroup)
