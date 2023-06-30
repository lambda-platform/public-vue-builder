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
                        <router-link to="/role-multi">
                            <i class="ti-user"></i>
                            <span>Олон цэс удирдах</span>
                        </router-link>
                    </li>
                    <!--                    <li>-->
                    <!--                        <router-link to="/role-kb-product">-->
                    <!--                            <i class="ti-layout-grid2"></i>-->
                    <!--                            <span>Бүтээгдэхүүн удирдах эрх</span>-->
                    <!--                        </router-link>-->
                    <!--                    </li>-->
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
                <div v-if="!loading" class="role-list">
                    <Button icon="md-add" type="success" long @click="addRole">{{ lang.add }}</Button>
                    <ul>
                        <li v-for="(role, index) in roles" :key="index" :class="index == selectedRole ? 'active' : ''">
                            <span class="role_name" @click="selectRole(index)">
                                {{ role.display_name }}
                            </span>

                            <Button shape="circle" icon="md-create" size="small" class="edit-btn"
                                    @click="editRole(role)"></Button>
                            <Button shape="circle" icon="ios-trash" size="small" @click="deleteRole(role.id)"></Button>
                        </li>
                    </ul>
                </div>

                <div v-if="!loading" class="role-config">
                    <div id="menu-tree" v-if="selectedRole != null">
                        <Select v-model="menuIndex" clearable :placeholder="lang.menuSelection" style="width: 300px"
                                @on-change="selectMenu">
                            <Option v-for="item in menus" :value="item.menuIndex" :key="item.menuIndex">{{ item.title }}
                            </Option>
                        </Select>
                        <Select v-if="Object.keys(permissions).length >=1"
                                v-model="roles[selectedRole].permissions.default_menu" clearable
                                :placeholder="lang.default_menu"
                                style="width: 200px">
                            <Option v-for="item in Object.keys(permissions)"
                                    :value="getMenuUrl(permissions[item].menu_id)"
                                    :key="permissions[item].menu_id" v-if="permissions[item].show">{{
                                    permissions[item].title
                                }}
                            </Option>
                        </Select>

                        <Button icon="android-done" type="success" @click="saveRole">{{ lang._save }}</Button>

                        <ul class="menuTree listsClass" v-if="selectedMenu != null">
                            <MenuItem
                                v-for="(menu_item, index) in selectedMenu.items"
                                :key="index"
                                :data="menu_item"
                                :menuIndex="[index]"
                                :cruds="cruds"
                                :permissions="permissions">
                            </MenuItem>
                        </ul>

                        <div class="advanced" v-if="roles[selectedRole].permissions.extra">
                            <h4>{{ lang.optional }}</h4>
                            <Checkbox size="large" v-model="roles[selectedRole].permissions.extra.datasource">
                                <span>{{ lang.data_source }}</span>
                            </Checkbox>

                            <Checkbox size="large" v-model="roles[selectedRole].permissions.extra.moqup">
                                <span>{{ lang._moqup }}</span>
                            </Checkbox>

                            <Checkbox size="large" v-model="roles[selectedRole].permissions.extra.chart">
                                <span>{{ lang._chart }}</span>
                            </Checkbox>

                            <Checkbox size="large" v-model="roles[selectedRole].permissions.extra.userlist">
                                <span>{{ lang.user_list }}т</span>
                            </Checkbox>

                            <Checkbox size="large" v-model="roles[selectedRole].permissions.extra.excelupload">
                                <span>{{ lang._import }}</span>
                            </Checkbox>

                            <Checkbox size="large" v-model="roles[selectedRole].permissions.extra.hascustomcreatebtn">
                                <span>{{ lang.register }}</span>
                            </Checkbox>

                            <Checkbox size="large" v-model="roles[selectedRole].permissions.extra.approve">
                                <span>{{ lang._confirm }}</span>
                            </Checkbox>
                        </div>

                    </div>
                    <Alert type="info" v-if="selectedRole === null">
                        {{ lang.please_select_role }}
                    </Alert>

                    <Modal v-model="showRoleForm" :title="lang.duties">
                        <Form ref="roleForm" :model="roleForm" :rules="ruleRole">
                            <FormItem prop="type" v-if="types && types.length >= 1">
                                <Select v-model="roleForm.type">
                                    <Option v-for="item in types" :value="item.id" :key="item.id">{{
                                            item.name
                                        }}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem prop="name">
                                <Input type="text" v-model="roleForm.name" :placeholder="lang._name"/>
                            </FormItem>
                            <FormItem prop="display_name">
                                <Input type="text" v-model="roleForm.display_name" :placeholder="lang.appearance_name"/>
                            </FormItem>
                            <FormItem prop="display_name">
                                <Input type="text" v-model="roleForm.extra" placeholder="extra"/>
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
import MenuItem from './MenuItem/MenuItem.vue'
import {loadLanguageAsync} from "../../../locale/index";

export default {
    components: {
        MenuItem
    },
    name: "roles",
    data() {
        return {
            types: [],
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
                type: null,
                name: '',
                display_name: '',
                description: '',
                extra: '',
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


    mounted() {
        this.getRoleTypes();
        this.getData();
    },
    watch: {
        // menuIndex(){
        //     if(this.menuIndex !== null){
        //         this.selectMenu(this.menuIndex);
        //     }
        // }
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
                if (this.roles[this.selectedRole].permissions) {
                    return this.roles[this.selectedRole].permissions.permissions
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
        },
        // roleMenus(){
        //     if(this.selectedMenu){
        //         let userMenus = [];
        //
        //         Object.keys(this.permissions).map(permission=>{
        //             if(this.permissions[permission].show){
        //
        //                 let menu_index = this.selectedMenu.items.findIndex(menu=>menu.id == permission);
        //
        //                 if(menu_index >= 0){
        //                     userMenus.push({
        //                         menu_id:this.selectedMenu.items[menu_index].id,
        //                         title: this.getTitle(this.selectedMenu.items[menu_index])
        //                     });
        //                 }
        //             }
        //         });
        //
        //         return userMenus;
        //     } else {
        //         return [];
        //     }
        // }
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

        getRoleTypes() {
            axios.get(`/lambda/puzzle/roles/type`).then(({data}) => {
                this.types = data;
            })
        },

        getUrlByMenu(menu, parentID, subParentID) {
            if (menu) {
                if (menu.link_to == "router-link") {
                    return "#" + menu.url
                } else {
                    if (parentID && subParentID) {
                        return "#/p/" + parentID + "/" + subParentID + "/" + menu.id;
                    } else if (parentID && !subParentID) {
                        return "#/p/" + parentID + "/" + menu.id;
                    } else {
                        return "#/p/" + menu.id;
                    }

                }
            }
        },

        getMenuUrl(menu_id) {
            let url = "#/p/" + menu_id;
            if (this.selectedMenu) {
                let menu_index = this.selectedMenu.items.findIndex(menu => menu.id == menu_id);
                if (menu_index >= 0) {
                    url = this.getUrlByMenu(this.selectedMenu.items[menu_index], undefined, undefined)
                } else {
                    this.selectedMenu.items.forEach(menu => {

                        let sub_menu_index = menu.children.findIndex(sub_menu => sub_menu.id == menu_id);

                        if (sub_menu_index >= 0) {
                            url = this.getUrlByMenu(menu.children[sub_menu_index], menu.id);
                        } else {
                            menu.children.forEach(sub_menu => {
                                let sub_child_menu_index = sub_menu.children.findIndex(sub_child_menu => sub_child_menu.id == menu_id);
                                if (sub_child_menu_index >= 0) {
                                    url = this.getUrlByMenu(sub_menu.children[menu_index], menu.id, sub_menu.id)
                                }
                            });
                        }
                    });
                }
            }
            return url

        },
        addRole() {
            this.showRoleForm = true;
        },
        editRole(role) {
            if(role.type){
                this.roleForm.type = role.type;
            }
            this.roleForm.name = role.name;
            this.roleForm.display_name = role.display_name;
            this.roleForm.description = role.description;

            this.editID = role.id;
            this.showRoleForm = true;
        },

        deleteRole(id) {
            axios.delete(`/lambda/puzzle/roles/destroy/${id}`).then(res => {
                this.$Message.success('Амжилттай устгагдлаа');
                this.getData();
            }).catch(err => {
                this.loadingForm = false;
                this.$Message.error('Уучлаарай алдаа гарлаа');
            })
        },

        saveRoleForm() {
            this.$refs.roleForm.validate((valid) => {
                if (valid) {
                    this.loadingForm = true;
                    let saveUrl = this.editID ? `/lambda/puzzle/roles/store/${this.editID}` : '/lambda/puzzle/roles/create'
                    axios.post(saveUrl, {...this.roleForm}).then(res => {
                        this.getData();
                        this.closeRole();
                        this.$Message.success('Амжилттай хадаглагдлаа');
                    }).catch(err => {
                        this.loadingForm = false;
                        this.$Message.error('Уучлаарай алдаа гарлаа');
                    })
                }
            });
        },

        closeRole() {
            this.showRoleForm = false;
            this.editID = null;
            this.loadingForm = false;
            this.roleForm = {
                type: null,
                name: '',
                display_name: '',
                description: '',
            };
            this.selectedMenu = null;
            this.menuIndex = null;
            this.selectedRole = null;
        },

        getData() {
            this.loading = true;
            let url = '/lambda/puzzle/roles-menus';
            if (this.$project) {
                url = `/lambda/puzzle/roles-menus/${this.$project.id}`;
            }

            axios.get(url).then(res => {
                if (res.data.status) {
                    this.roles = res.data.roles.map(role => {
                        if (role.permissions != null && role.permissions != "") {
                            try {
                                role.permissions = JSON.parse(role.permissions);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        return role;
                    });
                    this.cruds = res.data.cruds;
                    this.menus = res.data.menus.map((menu, index) => {
                        let items = JSON.parse(menu.schema);
                        return {
                            id: menu.id,
                            menuIndex: index,
                            title: menu.name,
                            items: items
                        }
                    });
                    this.loading = false;
                }
            })
        },

        selectMenu(index) {
            this.selectedMenu = this.menus[index];
            if (index >= 0)
                this.initPermissions({});
            else {
                this.roles[this.selectedRole].permissions = {
                    menu_id: null,
                    default_menu: null,
                    permissions: {},
                    extra: {
                        datasource: false,
                        moqup: false,
                        chart: false,
                        userlist: false,
                        excelupload: false,
                        approve: false,
                        hascustomcreatebtn: false,
                    }
                }
            }
        },

        selectRole(index) {
            this.selectedRole = index;
            if (this.roles[this.selectedRole].permissions === null || this.roles[this.selectedRole].permissions == '') {

                this.selectedMenu = null;
                this.menuIndex = null;
                this.extra = {
                    datasource: false,
                    moqup: false,
                    chart: false
                };

                this.roles[this.selectedRole].permissions = {
                    menu_id: null,
                    default_menu: null,
                    permissions: {},
                    extra: {
                        datasource: false,
                        moqup: false,
                        chart: false,
                        userlist: false,
                        excelupload: false,
                        approve: false,
                        hascustomcreatebtn: false,
                    }
                }

            } else {
                let menu_index = 0;
                if (this.roles[this.selectedRole].permissions.menu_id) {
                    menu_index = this.menus.findIndex(menu => menu.id == this.roles[this.selectedRole].permissions.menu_id);
                } else {
                    menu_index = this.menus.findIndex(menu => menu.id == 486);
                    this.roles[this.selectedRole].permissions.menu_id = 486;
                }

                if (menu_index >= 0) {
                    this.selectedMenu = null;
                    setTimeout(() => {
                        this.selectedMenu = JSON.parse(JSON.stringify(this.menus[menu_index]))

                        this.menuIndex = menu_index;
                        this.initPermissions(this.roles[this.selectedRole].permissions.permissions, this.roles[this.selectedRole].permissions.default_menu);
                    }, 100);
                }
            }
        },

        changePermission(type, menu_item_id, value) {
            // let changeIndex = this.roles[this.selectedRole].permissions.permissions.findIndex(permission=>permission.menu_id == menu_item_id);
            //
            // if(changeIndex >= 0){
            //     this.roles[this.selectedRole].permissions.permissions[changeIndex][type] = value;
            // }
        },

        initPermissions(permissions, default_menu) {
            let role_permission = this.roles[this.selectedRole].permissions;
            let extra = null;
            if (!role_permission.hasOwnProperty('extra')) {
                extra = {...this.extra};
            } else {
                extra = {...role_permission.extra}
            }

            this.roles[this.selectedRole].permissions = {
                menu_id: this.selectedMenu.id,
                default_menu: default_menu,
                permissions: this.getPermissions(permissions ? permissions : {}, this.selectedMenu.items),
                extra: extra
            }
        },

        getPermissions(permissions, menuItems) {
            let new_permissions = {};
            menuItems.map(menu => {
                if (permissions.hasOwnProperty(menu.id)) {
                    new_permissions[menu.id] = {...permissions[menu.id]}
                } else {
                    if (menu.link_to == 'crud') {
                        new_permissions[menu.id] = {
                            menu_id: menu.id,
                            c: false,
                            r: false,
                            u: false,
                            d: false,
                            show: false,
                            title: this.getTitle(menu),
                            gridEditConditionSQL: "",
                            gridDeleteConditionSQL: "",
                            gridDeleteConditionJS: "",
                            gridEditConditionJS: "",
                        }
                    } else {
                        new_permissions[menu.id] = {
                            menu_id: menu.id,
                            show: false,
                            title: this.getTitle(menu)
                        }
                    }
                }

                if (menu.children.length >= 1) {
                    let child_permistions = this.getPermissions(permissions, menu.children);
                    new_permissions = {...new_permissions, ...child_permistions}
                }
            });
            return new_permissions;
        },

        saveRole() {
            if (this.roles[this.selectedRole].permissions) {
                if (this.roles[this.selectedRole].permissions.default_menu && this.roles[this.selectedRole].permissions.menu_id) {
                    axios.post(`/lambda/puzzle/save-role?id=${this.roles[this.selectedRole].id}${this.$project ? this.$project.id ? '&project_id=' + this.$project.id : '' : ''}`, {
                        id: this.roles[this.selectedRole].id,
                        permissions: this.roles[this.selectedRole].permissions,
                        extra: {...this.extra},
                    }).then(res => {
                        this.$Message.success('Амжилттай хадаглагдлаа');
                    }).catch(err => {
                        this.$Message.error('Уучлаарай алдаа гарлаа');
                    })
                } else {
                    this.$Message.error('Цэсүүд сонголт хийнэ үү');
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
};
</script>



