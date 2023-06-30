let routes = [
    {
        path: '/p/:menu_id',
        component: ()=>import(/* webpackChunkName: "page-index" */ './views/index'),
        children: [{
            path: ':sub_menu_id',
            component: ()=>import(/* webpackChunkName: "page-sub" */ './views/sub'),
            children: [{
                path: ':sub_child_menu_id',
                component: ()=>import(/* webpackChunkName: "page-subChild" */ './views/subChild'),
            }]
        }]
    },
    {
        path: '/module/:module',
        component: ()=>import(/* webpackChunkName: "page-module" */ './views/module'),
    },
    {
        name: 'Error',
        path: '/*',
        component: ()=>import(/* webpackChunkName: "page-404" */ './views/404')
    }
];
const install = (Vue, options) => {
    Vue.mixin({
        mounted() {
            this.$nextTick(() => {
                if (!this.$parent) {
                    this.$router.app.$router.addRoutes(routes);
                   //  this.routes.forEach(route=>{
                   //      this.$router.app.$router.addRoute(route);
                   //  });
                }
            });
        }
    });
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
