
<template>
    <section class="page">
        <paper-header class="mini">
            <user-control slot="right"></user-control>
            <div slot="nav">
                <ul>
                    <li>
                        <router-link to="/role">
                            <i class="ti-user"></i>
                            <span>{{ lang.manage_access_rights }}</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/role-kb-product">
                            <i class="ti-layout-grid2"></i>
                            <span>Бүтээгдэхүүн удирдах эрх</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </paper-header>
        <section class="paper-page-body">
            <div class="role-control">
                <div v-if="loading" class="loader">
                    <div class="loader-wrapper">
                        <div class="lds-roller">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <h3>{{ lang.please_wait }}</h3>
                    </div>
                </div>
                <div class="role-list" v-if="!loading">
                    <ul>
                        <li v-for="(role, index) in roles" :key="index" :class="index == selectedRole ? 'active' : ''">
                            <span class="role_name" @click="selectRole(index)">
                                {{ role.display_name }}
                            </span>
                        </li>
                    </ul>
                </div>

                <div class="role-config" v-if="!loading">
                    <div id="menu-tree" v-if="selectedRole != null">
                        <Select v-if="Object.keys(permissions).length >=1"
                                v-model="roles[selectedRole].permission_kb_product.default_menu_id" clearable
                                placeholder="Анх сонгогдох цэс сонгох"
                                style="width: 200px">
                            <Option v-for="item in Object.keys(permissions)"
                                    :value="permissions[item].menu_id"
                                    :key="permissions[item].menu_id" v-if="permissions[item].show">{{
                                    permissions[item].title
                                }}
                            </Option>
                        </Select>
                        <Button icon="android-done" type="success" @click="saveRole">{{ lang._save }}</Button>

                        <ul class="menuTree listsClass" v-if="selectedMenu != null">
                            <ProductItem
                                v-for="(menu_item, index) in selectedMenu"
                                :key="index"
                                :data="menu_item"
                                :menuIndex="[index]"
                                :cruds="cruds"
                                :permissions="permissions" >
                            </ProductItem>
                        </ul>
                    </div>
                    <Alert type="info" v-if="selectedRole === null">
                        {{ lang.please_select_role }}
                    </Alert>

                    <Modal v-model="showRoleForm" :title="lang.duties">
                        <Form ref="roleForm" :model="roleForm" :rules="ruleRole">
                            <FormItem prop="name">
                                <Input type="text" v-model="roleForm.name" :placeholder="lang._name"/>

                            </FormItem>
                            <FormItem prop="display_name">
                                <Input type="text" v-model="roleForm.display_name" :placeholder="lang.appearance_name"/>
                            </FormItem>
                            <FormItem prop="description">
                                <Input type="textarea" v-model="roleForm.description" :placeholder="lang.note"/>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" :loading="loadingForm" @click="saveRoleForm">{{
                                        lang._save
                                    }}
                                </Button>
                                <Button type="info" style="margin-left: 8px" @click="closeRole">{{
                                        lang.cancel
                                    }}
                                </Button>
                            </FormItem>
                        </Form>
                        <footer slot="footer"></footer>
                    </Modal>

                </div>
            </div>
        </section>
    </section>
</template>

<script>
import ProductItem from './ProductItem/ProductItem.vue'
import {loadLanguageAsync} from "../../../locale/index";

export default {
    components: {
        ProductItem
    },
    name: "roles",
    data() {
        return {
            roles: [],
            menus: [],
            cruds: [],
            selectedMenu: null,
            menuIndex: null,
            selectedRole: null,
            loading: true,
            showRoleForm: false,
            loadingForm: false,
            roleForm: {
                name: '',
                display_name: '',
                description: '',
            },
            extra: {
                datasourcce: false,
                moqup: false,
                chart: false,
                userlist: false,
                excelupload: false,
                approve: false,
                hascustomcreatebtn: false,
            },
            editID: null,
            ruleRole: {
                name: [
                    {required: true, message: 'Нэр оруулна уу', trigger: 'blur'}
                ],
                display_name: [
                    {required: true, message: 'Харагдах нэр оруулна уу', trigger: 'blur'}
                ],

            }

        };
    },
    methods: {
        beforeMount() {
            if (this.selectedLang != "mn") {
                loadLanguageAsync(this.selectedLang);
            }
        },

        switchLanguage(val) {
            this.selectedLang = val;
            loadLanguageAsync(val);
        },
        getUrlByMenu(menu, parentID, subParentID){

            if(menu){
                if(menu.link_to == "router-link"){

                    return "#"+menu.url
                } else {
                    if(parentID && subParentID){
                        return  "#/p/" + parentID + "/" + subParentID +"/" + menu.id;
                    } else if(parentID && !subParentID){
                        return  "#/p/" + parentID + "/" + menu.id;
                    } else {
                        return  "#/p/" + menu.id;
                    }

                }
            }

        },
        getMenuUrl(menu_id) {
            let url = "#/p/" + menu_id;

            if (this.selectedMenu) {

                let menu_index = this.selectedMenu.findIndex(menu => menu.id == menu_id);

                if (menu_index >= 0) {
                    url = this.getUrlByMenu(this.selectedMenu.items[menu_index], undefined, undefined)
                } else {
                    this.selectedMenu.items.forEach(menu => {

                        let sub_menu_index = menu.items.findIndex(sub_menu => sub_menu.id == menu_id);

                        if (sub_menu_index >= 0) {
                            url =  this.getUrlByMenu(menu.items[sub_menu_index], menu.id);
                        } else {
                            menu.items.forEach(sub_menu => {
                                let sub_child_menu_index = sub_menu.items.findIndex(sub_child_menu => sub_child_menu.id == menu_id);
                                if (sub_child_menu_index >= 0) {
                                    url = this.getUrlByMenu(sub_menu.items[menu_index], menu.id, sub_menu.id)
                                }
                            });
                        }
                    });
                }
            }
            return url

        },


        getData() {
            this.loading = true;
            let url = '/kb/get-product-menus';

            axios.get(url).then(res => {
                if (res.data.status) {
                    this.roles = res.data.roles.map(role => {
                        if (role.permission_kb_product != null && role.permission_kb_product != "") {
                            try {
                                role.permission_kb_product = JSON.parse(role.permission_kb_product);
                            }catch (e){
                                console.log(e);
                            }
                        }
                        return role;
                    });
                    this.cruds = res.data.cruds;
                    this.menus = res.data.menus;
                    this.selectedMenu = this.menus;
                    this.loading = false;
                }
            })
        },

        selectRole(index) {
            this.selectedRole = index;
            if (this.roles[this.selectedRole].permission_kb_product === null || this.roles[this.selectedRole].permission_kb_product == '') {
                this.menuIndex = 1;
                this.selectedMenu = this.menus;
                this.roles[this.selectedRole].permission_kb_product = {
                    default_menu_id: null,
                    permissions: {}
                }
                this.initPermissions({});

            } else {
                    this.selectedMenu = null;
                    setTimeout(() => {
                        this.selectedMenu = this.menus;
                        this.menuIndex = 1;
                        this.initPermissions(this.roles[this.selectedRole].permission_kb_product.permissions, this.roles[this.selectedRole].permission_kb_product.default_menu_id);
                    }, 100);

            }
        },
        changePermission(type, menu_item_id, value) {

            // let changeIndex = this.roles[this.selectedRole].permissions.permissions.findIndex(permission=>permission.menu_id == menu_item_id);
            //
            // if(changeIndex >= 0){
            //     this.roles[this.selectedRole].permissions.permissions[changeIndex][type] = value;
            // }

        },
        initPermissions(permissions, default_menu_id) {
            let role_permission = this.roles[this.selectedRole].permission_kb_product;
            this.roles[this.selectedRole].permission_kb_product = {
                default_menu_id: default_menu_id,
                permissions: this.getPermissions(permissions ? permissions : {}, this.selectedMenu)
            }
        },
        getPermissions(permissions, menuItems) {

            let new_permissions = {};
            menuItems.map(menu => {
                if (permissions.hasOwnProperty(menu.id)) {
                    new_permissions[menu.id] = {...permissions[menu.id]}
                } else {
                        new_permissions[menu.id] = {
                            menu_id: menu.id,
                            e: false,
                            c: false,
                            r: false,
                            u: false,
                            d: false,
                            show: false,
                            title: menu.title,
                            gridEditConditionSQL:"",
                            gridDeleteConditionSQL:"",
                            gridDeleteConditionJS:"",
                            gridEditConditionJS:"",
                        }
                }

                if (menu.items.length >= 1) {
                    let child_permistions = this.getPermissions(permissions, menu.items);
                    new_permissions = {...new_permissions, ...child_permistions}
                }

            });
            return new_permissions;
        },
        saveRole() {
            console.log(this.roles[this.selectedRole].permission_kb_product);
            if (this.roles[this.selectedRole].permission_kb_product) {
                if (this.roles[this.selectedRole].permission_kb_product.default_menu_id) {
                    axios.post(`/kb/save-kb-role`, {
                        id: this.roles[this.selectedRole].id,
                        permissions: this.roles[this.selectedRole].permission_kb_product
                    }).then(res => {
                        this.$Message.success('Амжилттай хадаглагдлаа');
                    }).catch(err => {
                        this.$Message.error('Уучлаарай алдаа гарлаа');
                    })
                } else {
                    this.$Message.error('Анхдагч цэс сонгоно уу');
                }
            } else {
                this.$Message.error('Цэс сонгоно уу');
            }

        },
        getTitle(item) {

            if (item.link_to == 'crud') {
                let crudIndex = this.cruds.findIndex(crud => crud.id == item.url);


                if (crudIndex >= 0)
                    return this.cruds[crudIndex].title
                else
                    return ''
            } else
                return item.title;
        },

    },
    mounted() {
        this.getData();
    },
    computed: {
        lang() {
            const labels = ['manage_access_rights', 'please_wait', '_save', 'add', 'optional', 'cancel', 'duties', '_name', 'user_list', 'appearance_name', 'note', 'default_menu', 'please_select_role', 'data_source', '_moqup', '_chart', '_import', 'register', 'menuSelection', '_confirm'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('puzzle.' + labels[i]);
                return obj;
            }, {});
        },
        permissions() {
            if (this.selectedRole !== null) {
                if (this.roles[this.selectedRole].permission_kb_product) {
                    return this.roles[this.selectedRole].permission_kb_product.permissions
                } else {
                    return {};
                }
            } else
                return {};
        },
        currentRole() {
            if (this.selectedRole !== null) {
                return this.roles[this.selectedRole];
            } else
                return null
        }
    }
};
</script>



