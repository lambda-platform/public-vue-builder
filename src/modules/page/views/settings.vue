<template>
    <div class="settings-module">
        <div v-for="m in menu" :key="m.id" class="module">
            <h2>{{ m.title }}</h2>

            <div class="sub-module">
                <div v-for="sm in m.children" class="sub-module-item">
                    <a href="javascript:void(0)" v-if="sm.link_to == 'crud'" @click="getCrud(sm.url)">
                        <i :class="sm.icon"></i>
                        <span v-html="getTitle(sm)"></span>
                    </a>

                    <a v-else href="#">
                        <i :class="sm.icon"></i>
                        <span v-html="getTitle(sm)"></span>
                    </a>
                </div>
            </div>
        </div>

        <paper-modal
            name="crud-modal"
            class="page-modal"
            :min-width="200"
            :min-height="200"
            :pivot-y="0.5"
            :adaptive="true"
            :reset="true"
            :resizable="true"
            width="90%"
            height="90%">
            <krud class="material" :template="property.template" :property="property"/>
        </paper-modal>
    </div>
</template>

<script>
export default {
    name: "settings.vue",
    props: ['menuId'],
    data() {
        return {
            title: "",
            menu: [],
            cruds: window.init.cruds,
            property: {
                template: "canvas",
                mode: window.init.crud_mode ? window.init.crud_mode : undefined,
                title: "",
                projects_id: null,
                grid: null,
                form: null,
                view_url: null,
                actions: [],
                user_condition: null,
                permissions: {
                    c: false,
                    r: false,
                    u: false,
                    d: false,
                    gridDeleteConditionJS:"",
                    gridEditConditionJS:"",
                },
            },
        }
    },

    created() {
        this.getMenu();
    },

    methods: {
        getMenu() {
            axios.get(`/lambda/krud/menu_form/edit/${this.menuId}`).then(({data}) => {
                this.menu = JSON.parse(data.data.schema);
                console.log(this.menu);
                this.title = data.data.name;
            })
        },

        getCrud(id) {
            if (this.cruds) {
                let crudIndex = this.cruds.findIndex(crud => crud.id == id);
                if (crudIndex >= 0) {


                    // this.property. = 'canvas'

                    this.property.title = this.cruds[crudIndex].title;
                    // this.property.withoutHeader = this.withoutHeader;
                    this.property.projects_id = this.cruds[crudIndex].projects_id;
                    this.property.grid = this.cruds[crudIndex].grid;
                    this.property.form = this.cruds[crudIndex].form;
                    this.property.template = this.cruds[crudIndex].template;
                    this.property.main_tab_title = this.cruds[crudIndex].main_tab_title;
                    this.property.form_width = this.cruds[crudIndex].form_width ? this.cruds[crudIndex].form_width : null;
                    this.property.view_url = this.cruds[crudIndex].view_url;
                    this.property.permissions.c = true;
                    this.property.permissions.r = true;
                    this.property.permissions.u = true;
                    this.property.permissions.d = false;

                    let user_condition = {};



                    if (user_condition) {
                        this.property.user_condition = user_condition;
                    }

                    this.$modal.show('crud-modal');

                }
            } else {
                axios.get(`/api/krud/${id}`).then(({data}) => {
                    this.property.grid = data.grid;
                    this.property.form = data.form;
                    this.$modal.show('crud-modal');
                })
            }


        },

        showCrud() {
            this.$modal.show('crud-modal');
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
    }
}
</script>
