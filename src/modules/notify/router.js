import Router from 'vue-router'
import Vue from 'vue'

Vue.use(Router)

function load(component) {
    return require(`./views/theme/${window.lambda.theme}/${component}`).default
}

let routes = [
    {path: '/', redirect: '/list'},
    {path: '/list', component: load("/notifList.vue")},
];


export default new Router({
    mode: 'history', //hash,
    base: '/notify',
    routes,
})
