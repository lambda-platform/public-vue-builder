<template>
    <li :data-link_to="data.link_to" :data-url="data.url" :data-title="data.title" :data-icon="data.icon"
        :data-c="data.c" :data-r="data.r" :data-u="data.u" :data-d="data.d"

        class="menu-tree-item"
    >

        <div class="clickable sortDiv">
            <div class="menu-icon">
                <i :class="data.icon"></i>
            </div>

            <div class="menu-title">
                <span v-html="getTitle(data)"></span>

                | <span class="link-to">
                {{data.link_to}}
                <span v-if="data.link_to != 'crud'  && data.link_to != 'noAction'">
                    | {{data.url}}
                </span>
            </span>
            </div>

            <div class="menu-control">
                <span>&nbsp;</span>
                <span v-if="data.link_to == 'crud'">
                    <Checkbox :disabled="!permissions[data.id].show" v-model="permissions[data.id].c">C</Checkbox>
                    <Checkbox :disabled="!permissions[data.id].show" v-model="permissions[data.id].r">R</Checkbox>
                    <Checkbox :disabled="!permissions[data.id].show" v-model="permissions[data.id].u">U</Checkbox>
                    <Checkbox :disabled="!permissions[data.id].show" v-model="permissions[data.id].d">D</Checkbox>
                    <Button type="text" size="small" @click="showUserData"
                               :icon="extend ? 'ios-arrow-down' : 'ios-arrow-forward'"></Button>
                </span>
                <i-switch v-model="permissions[data.id].show" @on-change="changePermissionPre('show', $event, permissions[data.id])" size="small"/>
            </div>
        </div>
        <ul class="dd-list" v-if="data.children && data.children.length >= 1">
            <component v-for="(menu_item, index) in data.children" :is="element()" :key="index"
                       :menuIndex="getIndex(index)"
                       :data="menu_item"
                       :cruds="cruds"
                       :permissions="permissions"
            ></component>
        </ul>
        <div v-if="extend" class="user-data">
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
            <Row v-if="!loading">
                <Col span="12">
                    Форм | Form (Авах утга) <br>
                    <div>
                        <Row>
                            <Col span="10">
                                <Select v-model="formUser" filterable :placeholder="lang.custom_column">
                                    <Option v-for="item in user_fields" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                            </Col>
                            <Col span="10">
                                <Select v-model="formField" filterable :placeholder="lang.judgment_column">
                                    <Option v-for="item in form_fields" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Button type="primary" shape="circle" icon="md-add" @click="addFrom"></Button>
                            </Col>
                        </Row>
                    </div>

                   <div>
                       <Row v-for="(condition, index) in formCondition" :key="index">
                           <Col span="10">
                               {{condition.user_field}}
                           </Col>
                           <Col span="10">
                               {{condition.form_field}}
                           </Col>
                           <Col span="4">
                               <Button type="primary" shape="circle" icon="ios-trash" @click="deleteFrom(index)"></Button>
                           </Col>
                       </Row>
                   </div>

                </Col>
                <Col span="12">
                    {{ lang.list_grid }}
                    <br>
                   <div>
                       <Row>
                           <Col span="10">
                               <Select v-model="gridUser" filterable :placeholder="lang.judgment_column">
                                   <Option v-for="item in user_fields" :value="item" :key="item">{{ item }}</Option>
                               </Select>
                           </Col>
                           <Col span="10">
                               <Select v-model="gridField" filterable :placeholder="lang.value_column">
                                   <Option v-for="item in grid_fields" :value="item" :key="item">{{ item }}</Option>
                               </Select>
                           </Col>
                           <Col span="4">
                               <Button type="primary" shape="circle" icon="md-add" @click="addGrid"></Button>
                           </Col>
                       </Row>
                   </div>

                    <div>
                        <Row v-for="(condition, index) in gridCondition" :key="index">
                            <Col span="10">
                                {{condition.user_field}}
                            </Col>
                            <Col span="10">
                                {{condition.grid_field}}
                            </Col>
                            <Col span="4">
                                <Button type="primary" shape="circle" icon="ios-trash" @click="deleteGrid(index)"></Button>
                            </Col>
                        </Row>
                    </div>

                </Col>
            </Row>
            <Row v-if="permissions[data.id].u">
                <Col>
                    <b>Засах</b> үйлдэл хаагдах нөхцөл

                    <query-builder @change="changeFilter" @changeValueByJS="changeFilterJS" v-if="grid_fields_full.length >= 1"
                                   :query="permissions[data.id].gridEditConditionSQL" :fields="grid_fields_full"></query-builder>
                </Col>
            </Row>
            <Row v-if="permissions[data.id].d">
                <Col>
                    <b>Устгах</b> үйлдэл хаагдах нөхцөл

                    <query-builder @change="changeDeleteFilter" @changeValueByJS="changeDeleteFilterJS" v-if="grid_fields_full.length >= 1"
                                   :query="permissions[data.id].gridDeleteConditionSQL" :fields="grid_fields_full"></query-builder>
                </Col>
            </Row>

        </div>
    </li>
</template>

<script>
import {loadLanguageAsync} from "../../../../locale/index";
    export default {
        props: ["data", "menuIndex", "cruds", "permissions"],
        components: {},
        data() {
            return {
                loading: true,
                extend: false,
                formUser: null,
                gridUser: null,
                formField: null,
                gridField: null,
                user_fields: window.init.user_fields ? window.init.user_fields : [],
                grid_fields: [],
                grid_fields_full: [],
                form_fields: [],
                gridCondition: [],
                formCondition: [],

            }
        },
        methods: {
            changeFilter(query) {
                this.permissions[this.data.id].gridEditConditionSQL = query;
            },

            changeFilterJS(query) {
                this.permissions[this.data.id].gridEditConditionJS = query;
            },

            changeDeleteFilter(query) {
               this.permissions[this.data.id].gridDeleteConditionSQL = query;
            },

            changeDeleteFilterJS(query) {
               this.permissions[this.data.id].gridDeleteConditionJS = query;
            },

            switchLanguage(val) {
                this.selectedLang = val;
                loadLanguageAsync(val);
            },
            addFrom() {
                if (this.formUser && this.formField) {
                    this.formCondition.push({
                        user_field: this.formUser,
                        form_field: this.formField,
                    });
                    this.formField = null;
                    this.formUser = null;
                    this.updateValue();
                } else {
                    this.$Message.error('Харгалзах багнуудыг сонгоно уу');
                }
            },
            deleteFrom(index) {


                this.formCondition.splice(index, 1);
                this.updateValue();
            },
            deleteGrid(index) {

                this.gridCondition.splice(index, 1);
                this.updateValue();
            },
            addGrid() {
                if (this.gridUser && this.gridField) {
                    this.gridCondition.push({
                        user_field: this.gridUser,
                        grid_field: this.gridField,
                    });
                    this.gridField = null;
                    this.gridUser = null;
                    this.updateValue();
                } else {
                    this.$Message.error('Харгалзах багнуудыг сонгоно уу');
                }
            },
            updateValue() {
                this.permissions[this.data.id].formCondition = this.formCondition;
                this.permissions[this.data.id].gridCondition = this.gridCondition;

            },
            showUserData() {
                if (this.extend) {
                    this.extend = false;
                } else {
                    this.extend = true;
                    this.loading = true;

                    axios.get(window.init.project ? '/lambda/puzzle/get-krud-fields-micro/' + this.data.url : '/lambda/puzzle/get-krud-fields/' + this.data.url).then(res => {
                        this.loading = false;
                        if (res.status) {
                            if(this.user_fields.length == 0){
                                this.user_fields = res.data.user_fields;
                            }

                            this.grid_fields = res.data.grid_fields;
                            this.form_fields = res.data.form_fields;

                            if (this.permissions[this.data.id].formCondition) {
                                this.formCondition = this.permissions[this.data.id].formCondition;
                            }
                            if (this.permissions[this.data.id].gridCondition) {
                                this.gridCondition = this.permissions[this.data.id].gridCondition;
                            }
                            if(res.data.grid_fields_full){
                                this.grid_fields_full = res.data.grid_fields_full;
                            }

                        }
                    }).catch(res => {
                        this.loading = false;
                        this.$Message.error('Уучлаарай алдаа гарлаа');
                    })
                }
            },
            getIndex(index) {
                let pre_myIndex = [index];

                let myIndex = this.menuIndex.concat(pre_myIndex);

                return myIndex;
            },
            element() {
                return require(`./MenuItem`).default;
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
            changePermissionPre(type, value, permissions) {

                if(value === true){
                    permissions.c = true;
                    permissions.r = true;
                    permissions.u = true;
                    permissions.d = true;
                } else {
                    permissions.c = false;
                    permissions.r = false;
                    permissions.u = false;
                    permissions.d = false;
                }
                permissions.gridEditConditionSQL = "";
                permissions.gridDeleteConditionSQL = "";
                permissions. gridDeleteConditionJS = "";
                permissions.gridEditConditionJS = "";


                this.$emit('changePermission', type, this.data.id, value);
            },
            changePermission(type, menu_item_id, value) {
                this.$emit('changePermission', type, menu_item_id, value);
            }
        },
        computed: {
            lang() {
                const labels = [ 'please_wait', 'list_grid', 'custom_column', 'value_column'];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('puzzle.' + labels[i]);
                    return obj;
                }, {});
            },

        }
    };
</script>
