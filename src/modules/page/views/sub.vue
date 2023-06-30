<template>
    <div>
        <div v-if="showSub">
            <router-view :key="$route.path">
                <template slot="nav">
                    <slot name="nav"></slot>
                </template>
                <template slot="v-nav">
                    <slot name="v-nav"></slot>
                </template>
            </router-view>
        </div>

        <div v-if="!showSub" :class="pageType == 'iframe' ? '' : ''">
            <krud v-if="pageType == 'crud'" :template="property.template" :property="property" class="material">
                <template slot="nav">
                    <slot name="nav"></slot>
                </template>
                <template slot="v-nav">
                    <slot name="v-nav"></slot>
                </template>
                <user-control slot="right"></user-control>
            </krud>

            <div class="material" v-if="pageType == 'iframe'">
                <section class="offcanvas-template">
                    <div class="crud-page">
                        <div class="crud-page-header">
                            <h3></h3>
                        </div>
                        <div class="crud-page-body">
                            <div class="v-nav">
                                <slot name="v-nav"></slot>
                            </div>
                            <div class="dg-flex">
                                <div class="iframe-page">
                                    <iframe v-if="pageType == 'iframe'" :src="iframeUrl"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageType: '',
            menu: window.init.menu,
            cruds: window.init.cruds,
            permissions: window.init.permissions.permissions,
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
                form_width: null,
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
            submenu: [],
            showSub: false,
        };
    },
    methods: {
        getPage() {
            let parentIndex = this.menu.findIndex(menu => menu.id == this.$route.params.menu_id);
            if (parentIndex >= 0) {
                let pageIndex = this.menu[parentIndex].children.findIndex(menu => menu.id == this.$route.params.sub_menu_id);
                if (pageIndex >= 0) {
                    let page = this.menu[parentIndex].children[pageIndex];
                    this.pageType = page.link_to;
                    if (this.pageType == 'crud') {
                        let crudIndex = this.cruds.findIndex(crud => crud.id == page.url);
                        if (crudIndex >= 0) {
                            this.property.page_id = page.id;
                            this.property.title = this.cruds[crudIndex].title;
                            this.property.main_tab_title = this.cruds[crudIndex].main_tab_title;
                            this.property.grid = this.cruds[crudIndex].grid;
                            this.property.form = this.cruds[crudIndex].form;
                            this.property.edit_id = this.cruds[crudIndex].edit_id;
                            this.property.template = this.cruds[crudIndex].template;
                            if (this.cruds[crudIndex].actions) {
                                this.property.actions = JSON.parse(this.cruds[crudIndex].actions);
                            }
                            this.property.projects_id = this.cruds[crudIndex].projects_id;
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
                    } else if (this.pageType == 'iframe') {
                        this.iframeUrl = page.url;
                    }
                }
            }
        },

        checkSub() {
            let menuIndex = this.menu.findIndex(menu => menu.id == this.$route.params.menu_id);
            if (menuIndex >= 0) {
                let subMenuIndex = this.menu[menuIndex].children.findIndex(menu => menu.id == this.$route.params.sub_menu_id);
                if (subMenuIndex >= 0) {
                    if (subMenuIndex == 0 && this.menu[menuIndex].children[subMenuIndex].link_to == 'divider') {
                        let nav = this.menu[menuIndex].children[1];
                        this.$router.push(`/p/${this.menu[menuIndex].id}/${nav.id}`);
                    }

                    if (subMenuIndex == 0 && this.menu[menuIndex].children[subMenuIndex].link_to == 'router-link') {
                        let nav = this.menu[menuIndex].children[0];
                        this.$router.push(`${nav.url}`);
                    }

                    if (this.menu[menuIndex].children[subMenuIndex].children.length >= 1) {
                        if (this.$route.matched.length <= 2) {
                            let first = this.getShowAbleChild(this.menu[menuIndex].children[subMenuIndex].children);
                            if (first) {
                                this.$router.push(`/p/${this.$route.params.menu_id}/${this.$route.params.sub_menu_id}/${first.id}`);
                            }
                        } else {
                            this.subMenu = this.menu[menuIndex].children[subMenuIndex].children;
                            this.showSub = true;
                        }
                    } else {
                        this.showSub = false;
                        this.getPage();
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
            }
            return null;
        },

        getTitle(item) {
            if (item.link_to == 'crud') {
                let crudIndex = this.cruds.findIndex(crud => crud.id == item.url);
                if (crudIndex >= 0) {
                    return this.cruds[crudIndex].title;
                } else {
                    return ''
                }
            } else {
                return item.title;
            }
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
    },

    mounted() {
        this.checkSub();
    }
};
</script>
