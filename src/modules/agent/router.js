import Router from 'vue-router'
import Vue from 'vue'

Vue.use(Router)

function load(component) {
    if (window.lambda.local_agent && typeof window.lambda.local_agent !== undefined && window.lambda.local_agent !== null && window.lambda.local_agent !== '' && window.lambda.local_agent !== undefined) {
        // return require(/* ignore */ `agent/${component}`).default;
        try {
            return require(`agent/${component}`).default
        } catch (err) {
            console.log('not local');
        }
    }
    return require(`./views/theme/${window.lambda.theme}/${component}`).default
}

let routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', component: load("auth/login.vue")},
    {path: '/forgot', component: load("auth/password/forgot.vue")},
    {path: '/password-reset', component: load("auth/password/password_reset.vue")},
];


export default new Router({
    mode: 'history', //hash,
    base: '/auth/',
    routes,
})
