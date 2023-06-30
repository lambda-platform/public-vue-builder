import Router from 'vue-router'

Vue.use(Router)

let base = '/';

if (location.pathname && location.pathname != '/') {
    base = location.pathname.split('/').slice(0, -1).join('/');
}

let routes = [{
    path: '/',
    redirect: '/form'
},
    {
        path: '/moqup',
        component: () => import(/* webpackChunkName: "moqup-index" */ './pages/moqup/views/index.vue'),
        children: [{
            name: 'moqup.list',
            path: '',
            component: () => import(/* webpackChunkName: "moqup-list" */ './pages/moqup/views/list.vue'),
        },
            {
                name: 'moqup.builder',
                path: 'builder/:id?',
                component: () => import( /* webpackChunkName: "moqup-builder" */'./pages/moqup/views/builder.vue'),
            },
            {
                name: 'moqup.preview',
                path: 'preview/:id',
                component: () => import(/* webpackChunkName: "moqup-preview" */ './pages/moqup/views/preview.vue'),
            },
        ]
    },
    {
        path: '/graphql',
        component: () => import(/* webpackChunkName: "graphql-index" */ './pages/graphql/views/index.vue'),
        children: [{
            name: 'graphql.list',
            path: '',
            component: () => import(/* webpackChunkName: "graphql-list" */ './pages/graphql/views/list.vue'),
        },
            {
                name: 'graphql.builder',
                path: 'builder/:id?',
                component: () => import(/* webpackChunkName: "graphql-builder" */ './pages/graphql/views/builder.vue'),
            },
        ]
    },
    {
        path: '/chart',
        component: () => import(/* webpackChunkName: "chart-index" */ './pages/chart/views/index.vue'),
        children: [{
            name: 'chart.list',
            path: '',
            component: () => import(/* webpackChunkName: "chart-list" */ './pages/chart/views/list.vue'),
        },
            {
                name: 'chart.builder',
                path: 'builder/:id?',
                component: () => import(/* webpackChunkName: "chart-builder" */ './pages/chart/views/builder.vue'),
            },
            {
                name: 'chart.preview',
                path: 'preview/:id',
                component: () => import(/* webpackChunkName: "chart-preview" */ './pages/chart/views/preview.vue'),
            },
        ]
    },
    {
        path: '/analytic',
        component: () => import(/* webpackChunkName: "analytic-index" */ './pages/analytic/views/index.vue')
    },
    {
        path: '/notification',
        component: () => import(/* webpackChunkName: "notification-index" */ './pages/notification/views/index.vue')
    },


    {
        path: '/datasource',
        component: () => import(/* webpackChunkName: "datasource-index" */ './pages/datasource/views/index.vue'),
        children: [{
            name: 'data-source.list',
            path: '',
            component: () => import(/* webpackChunkName: "datasource-list" */ './pages/datasource/views/list.vue'),
        },
            {
                name: 'data-source.builder',
                path: 'builder/:id?',
                component: () => import(/* webpackChunkName: "datasource-builder" */ './pages/datasource/views/builder.vue'),
            }
        ]
    },
    {
        path: '/form',
        component: () => import(/* webpackChunkName: "form-index" */ './pages/form/views/index.vue'),
        children: [{
            name: 'form.list',
            path: '',
            component: () => import(/* webpackChunkName: "form-list" */ './pages/form/views/list.vue'),
        },
            {
                name: 'form.builder',
                path: 'builder/:id?',
                component: () => import(/* webpackChunkName: "form-builder" */ './pages/form/views/builder.vue'),
            },
            {
                name: 'form.preview',
                path: 'preview/:id',
                component: () => import(/* webpackChunkName: "form-preview" */ './pages/form/views/preview.vue'),
            },
        ]
    },
    {
        path: '/grid',
        component: () => import(/* webpackChunkName: "grid-index" */ './pages/grid/views/index.vue'),
        children: [{
            name: 'grid.list',
            path: '',
            component: () => import(/* webpackChunkName: "grid-list" */ './pages/grid/views/list.vue'),
        },
            {
                name: 'grid.builder',
                path: 'builder/:id?',
                component: () => import(/* webpackChunkName: "grid-builder" */ './pages/grid/views/builder.vue'),
            },
            {
                name: 'grid.preview',
                path: 'preview/:id',
                component: () => import(/* webpackChunkName: "grid-preview" */ './pages/grid/views/preview.vue'),
            },
        ]
    },

    {
        path: '/process',
        component: () => import(/* webpackChunkName: "grid-index" */ './pages/process/views/index.vue'),
        children: [{
            name: 'process.list',
            path: '',
            component: () => import(/* webpackChunkName: "grid-list" */ './pages/process/views/list.vue'),
        },
            {
                name: 'process.builder',
                path: 'builder/:id?',
                component: () => import(/* webpackChunkName: "grid-builder" */ './pages/process/views/builder.vue'),
            },
            {
                name: 'process.preview',
                path: 'preview/:id',
                component: () => import(/* webpackChunkName: "grid-preview" */ './pages/process/views/preview.vue'),
            },
        ]
    },

    {
        path: '/embed/form/:id',
        component: () => import(/* webpackChunkName: "embed-form" */ './pages/embed/form.vue'),
    },

    {
        path: '/embed/grid/:id',
        component: () => import(/* webpackChunkName: "embed-grid" */ './pages/embed/grid.vue'),
    },

    {
        path: '/role',
        component: () => import(/* webpackChunkName: "role-index" */ './pages/role/views/index.vue')
    },

    {
        path: '/role-multi',
        component: () => import(/* webpackChunkName: "role-index" */ './pages/role/views/multi.vue')
    },

    {
        path: '/role-kb-product',
        component: () => import(/* webpackChunkName: "role-index" */ './pages/role/views/kb-product.vue')
    },

    {
        path: '/crud',
        component: () => import(/* webpackChunkName: "crud-index" */ './pages/crud/views/index.vue')
    },

    {
        path: '/menu',
        component: () => import(/* webpackChunkName: "menu-index" */ './pages/menu/views/index.vue')
    },

    {
        path: '/visual-builder',
        component: () => import(/* webpackChunkName: "menu-index" */ './pages/visual-builder/views/index.vue')
    },

    {
        path: '/module/:module',
        component: () => import(/* webpackChunkName: "render-index" */ './pages/render/views/module.vue')
    },
    {
        path: '/report',
        component: () => import(/* webpackChunkName: "report-index" */ './pages/report/views/index.vue').default,
        children: [{
            name: 'report.list',
            path: '',
            component: () => import(/* webpackChunkName: "report-list" */ './pages/report/views/list.vue').default,
        },
            {
                name: 'report.builder',
                path: 'builder/:id?',
                component: () => import(/* webpackChunkName: "report-builder" */ './pages/report/views/builder.vue').default,
            },
            {
                name: 'report.preview',
                path: 'preview/:id',
                component: () => import(/* webpackChunkName: "report-preview" */ './pages/report/views/preview.vue').default,
            },
        ]
    },
    {
        path: '/config',
        component: () => import(/* webpackChunkName: "project-index" */ './pages/microservice/Settings.vue')
    },
    {
        name: 'Error',
        path: '/*',
        component: () => import(/* webpackChunkName: "views-404" */ './pages/error/views/404.vue')
    }
]

export default new Router({
    base,
    routes,
    history: true,
    linkActiveClass: 'active'
})
