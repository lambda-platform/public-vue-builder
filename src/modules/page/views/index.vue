<template>
    <section class="page">
        <router-view v-if="showSub" :key="$route.path">
            <nav slot="v-nav" v-show="showSub && menuMode != 'nested'">
                <div class="card sub-nav-list">
                    <h3 class="card-header">{{ pageTitle }}</h3>
                    <ul class="card-body">
                        <li v-for="(item, index) in subMenu" :key="index" v-if="can(item)" :class="item.link_to == 'divider' ? 'nav-divider': ''">
                           <span v-if="item.children.length <= 0">
                                <router-link :to="`/p/${$route.params.menu_id}/${item.id}`"
                                             v-if="item.link_to != 'link' && item.link_to != 'router-link' && item.link_to != 'divider'">
                                    <!-- <Badge count="3"></Badge> -->
                                    <i v-if="item.icon" :class="item.icon"></i>
                                    <span v-html="getTitle(item)"></span>
                                </router-link>

                                <router-link :to="item.url" v-else-if="item.link_to == 'router-link'">
                                    <i v-if="item.icon" :class="item.icon"></i>
                                    <span v-html="getTitle(item)"></span>
                                </router-link>

                                <a :href="item.url" v-else-if="item.link_to == 'link'" :target="item.target">
                                    <i v-if="item.icon" :class="item.icon"></i>
                                    <span v-html="getTitle(item)"></span>
                                </a>

                               <div class="nav-divider-item" v-else-if="item.link_to == 'divider'">
                                    <span v-html="getTitle(item)"></span>
                                </div>
                           </span>

                            <Collapse simple v-if="showNestedMenu  && item.children.length >= 1" v-model="subMenuId">
                                <Panel :name="item.id" :key="index">
                                    <span v-html="getTitle(item)"></span>
                                    <ul class="card-body" slot="content">
                                        <li v-for="(subitem, subindex) in item.children" :key="subindex"
                                            v-if="can(subitem)">
                                            <router-link :to="`/p/${$route.params.menu_id}/${item.id}/${subitem.id}`"
                                                         v-if="subitem.link_to != 'link' && subitem.link_to != 'router-link'">
                                                <!-- <Badge count="3"></Badge> -->
                                                <i v-if="subitem.icon" :class="subitem.icon"></i>
                                                <span v-html="getTitle(subitem)"></span>
                                            </router-link>
                                            <router-link :to="subitem.url" v-if="subitem.link_to == 'router-link'">
                                                <i v-if="subitem.icon" :class="subitem.icon"></i>
                                                <span v-html="getTitle(subitem)"></span>
                                            </router-link>
                                            <a :href="subitem.url" v-if="subitem.link_to == 'link'"
                                               :target="item.target">
                                                <i v-if="subitem.icon" :class="subitem.icon"></i>
                                                <span v-html="getTitle(subitem)"></span>
                                            </a>
                                        </li>
                                    </ul>
                                </Panel>
                            </Collapse>
                        </li>
                    </ul>
                </div>
            </nav>
        </router-view>

        <div v-if="!showSub" :class="pageType == 'iframe' ? 'iframe-page' :'sub-page'">
            <krud v-if="pageType == 'crud'" :template="property.template" :property="property" class="material">
                <user-control slot="right"></user-control>
            </krud>

            <iframe v-if="pageType == 'iframe'" :src="iframeUrl"></iframe>

            <portal to="header-left" v-if="pageType == 'iframe' && property.withoutHeader">
                <h3>{{ iframeTitle }}</h3>
            </portal>

            <div v-if="pageType == 'router-link'">
                <h1>here</h1>
            </div>
        </div>
    </section>
</template>


<script>

export default {
    computed: {
        menuMode() {
            let menuModeSaved = localStorage.getItem('menuMode');
            if (menuModeSaved) {
                return menuModeSaved
            } else {
                return undefined
            }
        }
    },
    data() {
        return {
            options: {
                height: "1000px"
            },
            pageType: '',
            property: {
                withCrudLog: window.init.withCrudLog,
                withoutHeader: window.init.withoutHeader === true ? true : false,
                page_id: null,
                template: "canvas",
                mode: window.init.crud_mode ? window.init.crud_mode : undefined,
                title: "",
                projects_id: null,
                grid: null,
                form: null,
                form_width: 800,
                view_url: null,
                actions: [],
                user_condition: null,
                permissions: {
                    c: false,
                    r: false,
                    u: false,
                    d: false,
                    gridDeleteConditionJS: "",
                    gridEditConditionJS: "",
                },
            },
            iframeUrl: '',
            iframeTitle: '',
            submenu: [],
            showSub: false,
            menu: window.init.menu,
            cruds: window.init.cruds,
            permissions: window.init.permissions.permissions,
            pageTitle: '',
            subMenuId: '0',
            showNestedMenu: false
        };
    },
    methods: {
        checkSub() {
            let menuIndex = this.menu.findIndex(menu => menu.id == this.$route.params.menu_id);
            if (menuIndex >= 0) {
                if (this.menu[menuIndex].children.length >= 1) {
                    this.menu[menuIndex].children.forEach((sub, subIndex) => {
                        if (sub.children.length >= 1) {
                            this.showNestedMenu = true;
                            if (this.$route.params.sub_menu_id == sub.id) {
                                this.subMenuId = sub.id;
                            }
                        }
                    });
                    this.pageTitle = this.getTitle(this.menu[menuIndex]);
                    this.pageTitle = this.getTitle(this.menu[menuIndex]);
                    if (this.$route.matched.length <= 1) {
                        let first = this.getShowAbleChild(this.menu[menuIndex].children);
                        if (first) {
                            this.$router.push(`/p/${this.$route.params.menu_id}/${first.id}`);
                        }
                    } else {
                        this.subMenu = this.menu[menuIndex].children;
                        // this.subMenuId = this.menu[menuIndex].id;
                        this.showSub = true;
                    }

                } else {
                    this.showSub = false;
                    this.getPage();
                }
            }
        },

        getShowAbleChild(children) {
            let showIndex = children.findIndex(child => this.can(child));
            if (showIndex >= 0) {
                return children[showIndex]
            } else
                return null
        },

        can(menu) {
            if (this.permissions[menu.id]) {
                if (this.permissions[menu.id].show) {
                    return true
                } else {
                    return false
                }
            } else {
                return false;
            }
        },

        getTitle(item) {
            if (item.link_to == 'crud') {
                let crudIndex = this.cruds.findIndex(crud => crud.id == item.url);
                if (crudIndex >= 0)
                    return this.cruds[crudIndex].title;
                else
                    return ''
            } else
                return item.title;
        },

        getPage() {
            let parentIndex = this.menu.findIndex(menu => menu.id == this.$route.params.menu_id);
            if (parentIndex >= 0) {
                let page = this.menu[parentIndex];
                this.pageType = page.link_to;
                switch (this.pageType) {
                    case 'crud':
                        let crudIndex = this.cruds.findIndex(crud => crud.id == page.url);
                        if (crudIndex >= 0) {
                            // this.property. = 'canvas'
                            this.property.page_id = page.id;
                            this.property.title = this.cruds[crudIndex].title;
                            // this.property.withoutHeader = this.withoutHeader;
                            this.property.projects_id = this.cruds[crudIndex].projects_id;
                            this.property.grid = this.cruds[crudIndex].grid;
                            this.property.form = this.cruds[crudIndex].form;
                            this.property.edit_id = this.cruds[crudIndex].edit_id;
                            this.property.template = this.cruds[crudIndex].template;
                            if (this.cruds[crudIndex].actions) {
                                this.property.actions = JSON.parse(this.cruds[crudIndex].actions);
                            }
                            this.property.main_tab_title = this.cruds[crudIndex].main_tab_title;
                            this.property.form_width = this.cruds[crudIndex].form_width ? this.cruds[crudIndex].form_width : null;
                            this.property.view_url = this.cruds[crudIndex].view_url;
                            this.property.permissions.c = this.permissions[page.id].c;
                            this.property.permissions.r = this.permissions[page.id].r;
                            this.property.permissions.u = this.permissions[page.id].u;
                            this.property.permissions.d = this.permissions[page.id].d;
                            this.property.permissions.gridDeleteConditionJS = this.permissions[page.id].gridDeleteConditionJS;
                            this.property.permissions.gridEditConditionJS = this.permissions[page.id].gridEditConditionJS;
                            let user_condition = {};

                            if (this.permissions[page.id].formCondition) {
                                user_condition.formCondition = this.permissions[page.id].formCondition
                            }
                            if (this.permissions[page.id].gridCondition) {
                                user_condition.gridCondition = this.permissions[page.id].gridCondition
                            }

                            if (user_condition) {
                                this.property.user_condition = user_condition;
                            }
                        }
                        break;
                    case 'link':
                        window.location = this.menu[parentIndex]['url'];
                        break;
                    case 'router-link':
                        console.log('I am router link', this.menu[parentIndex]);
                        this.$router.push(this.menu[parentIndex]['url']);
                        break;
                    case 'iframe':
                        this.iframeUrl = page.url;
                        this.iframeTitle = page.title;
                        break;
                    default:
                        break;
                }
            }
        }
    },
    mounted() {
        this.checkSub();
    }
};
</script>
