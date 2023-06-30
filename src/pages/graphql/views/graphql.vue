<template>
    <div class="data-source">

        <div class="data-source-sidebar" style="width: 600px">
            <div class="data-source-header">
                <h3>
                    {{lang.graphqlManagement}}
                </h3>
            </div>
            <div class="data-source-sidebar-wrapper">

                <h5>{{ lang.table }}</h5>
                <Select v-model="graphql.table" :placeholder="lang.selectTable" clearable
                        filterable
                        @on-change="selectTable">
                    <OptionGroup label="Table list">
                        <Option v-for="item in tableList" :value="item" :key="item.index">{{
                                item
                            }}
                        </Option>
                    </OptionGroup>
                    <OptionGroup label="View list">
                        <Option v-for="item in viewList" :value="item" :key="item.index">{{
                                item
                            }}
                        </Option>
                    </OptionGroup>
                </Select>
                <h5>{{ lang.name }}</h5>
                <Input v-model="name"  :placeholder="lang.name" style="width: 100%"/>

                <h5>
                    {{ lang.idField }}
                </h5>
                <Select v-model="graphql.identity" filterable :placeholder="lang.idField">
                    <Option v-for="item in relSchema" :value="item.model" :key="item.model">{{ item.model }}</Option>
                </Select>

                <h5>
                    {{ lang.hideFields }}
                </h5>
                <Select v-model="graphql.hidden_columns" filterable multiple :placeholder="lang.hideFields">
                    <Option v-for="item in relSchema" :value="item.model" :key="item.model">{{ item.model }}</Option>
                </Select>

                <h5>{{ lang.permissionActions }}</h5>
                <Checkbox v-model="graphql.actions.create">{{ lang.add }}</Checkbox>
                <Checkbox v-model="graphql.actions.update">{{ lang.edit }}</Checkbox>
                <Checkbox v-model="graphql.actions.delete">{{ lang.delete }}</Checkbox>

                <h5>{{ lang.real_time }}</h5>
                <Checkbox v-model="graphql.subscription">{{ lang.real_time }}</Checkbox>
                <h5>{{ lang.accessAndAccessRights }}</h5>
                <Checkbox v-model="graphql.checkAuth.isLoggedIn">{{ lang.nevtersenHundHaruulah }}</Checkbox>
                <h5 v-if="graphql.checkAuth.isLoggedIn">{{ lang.accessRights }}</h5>
                <h6 v-if="graphql.checkAuth.isLoggedIn">( {{ lang.allUsersCanSee }} )</h6>
                <Select graphql.checkAuth.isLoggedIn v-model="graphql.checkAuth.roles" filterable multiple
                        :placeholder="lang.accessRights">
                    <Option v-for="item in user_roles" :value="item.id" :key="item.id">{{ item.display_name }}</Option>
                </Select>

                <h5>{{ lang.subTables }}<Button type="primary" shape="circle" icon="md-add" @click="showSub"></Button></h5>
                <Table border :columns="subColumns" :data="graphql.subs"></Table>

            </div>


        </div>
        <div class="data-source-workspace">
            <div class="data-source-header">
                <div class="data-source-header-buttons">
                    <Button type="success" @click="saveSchema">{{ lang.save }}</Button>
                </div>
            </div>
            <div class="graphql-builder"></div>
        </div>
        <Modal
            v-model="showSubForm"
            :title="lang.subTables"
            @on-ok="addSub"
            @on-cancel="cancel"
        >
            <div>
                <h5>{{ lang.subTable }}</h5>
                <Select filterable @on-change="selectSubTable" v-model="newSub.graphqlID" :placeholder="lang.subTable">
                    <Option v-for="item in otherGraphql" :value="item.id" :key="item.name">{{ item.name }}</Option>
                </Select>
                <h5>
                    {{ lang.connectionField }}
                </h5>
                <Select v-model="newSubData.connection_field" filterable :placeholder="lang.connectionField">
                    <Option v-for="item in subFields" :value="item.model" :key="item.model">{{ item.model }}</Option>
                </Select>
            </div>
            <div slot="footer">
                <div style="text-align:right">
                    <button type="button" class="ivu-btn ivu-btn-info" @click="addSub">{{ lang.add }}</button>
                    <button class="ivu-btn ivu-btn-default" style="margin-left: 8px;" @click="cancel">{{ lang.cancel }}</button>
                </div>
            </div>
        </Modal>

    </div>
</template>

<script>
import {getTableMeta} from "../../../modules/dataform/utils/helpers";
import {getTableView} from "../../../utils/index";


export default {
    props: ["onCreate", "onUpdate", "src", "editMode", "projectID"],
//{"table":"bag", "connection_field":"sumid", "parent_identity":"id"}
    created() {
        this.init();

    },
    methods: {
        cancel() {
            this.showSubForm = false;
        },
        deleteSub(index) {
            this.graphql.subs.splice(index, 1);
        },
        addSub() {
            this.graphql.subs.push(JSON.parse(JSON.stringify(this.newSubData)))

            this.newSub = {
                graphqlID: "",
                parent_identity: "",
            }
            this.showSubForm = false;
        },
        showSub() {
            this.showSubForm = true;
        },
        async selectTable(table) {
            this.name = table;
            this.relSchema = await getTableMeta(table);
        },
        selectSubTable(id) {


            if(id){
                let otherURL = '/lambda/puzzle/schema/graphql/'+id;
                if (this.$project) {
                    otherURL = `/lambda/puzzle/project/${this.projectID}/graphql/${id}`
                }
                axios.get(otherURL)
                    .then(o => {
                        var schema = JSON.parse(o.data.data.schema);
                        this.newSubData.table = schema.table
                        this.newSubData.parent_identity = this.graphql.identity;
                        this.subFields = getTableMeta(schema.table);

                    })
            }


        },
        async callOtherForms() {
            if (window.otherForms) {
                this.otherForms = window.otherForms;
            } else {
                let otherURL = '/lambda/puzzle/schema/graphql';
                if(this.projectID){
                    otherURL = `/lambda/puzzle/project/${this.projectID}/graphql`
                }
                let res = await axios.get(otherURL);
                this.otherGraphql = res.data.data;
            }
        },
        init() {
            if (this.$props.editMode == true) {
                axios
                    .get(this.$props.src)
                    .then(o => {
                        this.name = o.data.data.name;
                        this.graphql = JSON.parse(o.data.data.schema);
                        this.selectTable(this.graphql.table);
                        this.callOtherForms()
                    })
                    .catch(o => {
                        console.log(o);
                    });
            } else {
                this.callOtherForms()
            }
        },
        saveSchema() {

            let data = {
                name: this.name,
                schema: JSON.stringify(this.graphql)
            };


            let defualtURL = `/lambda/puzzle/schema/graphql`;
            if(this.projectID){
                defualtURL = `/lambda/puzzle/project/${this.projectID}/graphql`
            }
            let submitUrl = this.$props.editMode
                ? this.$props.src
                : defualtURL;

            axios.post(submitUrl, data).then(o => {
                if (o.data.status) {
                    this.$Message.success(`${this._form.savedSuccessfull}`);
                    this.$props.onCreate();
                    this.graphql = {
                        "table": "",
                        "identity": "",
                        "hidden_columns": [],
                        "checkAuth": {"isLoggedIn": false, "roles": []},
                        "subs": [],
                        "actions": {"create": false, "update": false, "delete": false}
                    };
                } else {
                    this.$Message.info(`${this._form.errorSaving}`);
                }
            });
        }
    },
    data() {
        return {
            // tableList: window.init.dbSchema.tableList,
            tableMeta: window.init.dbSchema.tableMeta,
            // viewList: window.init.dbSchema.viewList,
            user_roles: window.init.user_roles,
            relSchema: [],
            subFields: [],
            otherGraphql: [],
            showSubForm: false,
            // subColumns: [
            //     {
            //         title: 'Хүснэгт',
            //         key: 'table'
            //     },
            //     {
            //         title: 'Эцэг хүснэгтийн ID',
            //         key: 'parent_identity'
            //     },
            //     {
            //         title: 'Холбор талбар',
            //         key: 'connection_field'
            //     },
            //     {
            //         title: 'Action',
            //         key: 'action',
            //         width: 150,
            //         align: 'center',
            //         render: (h, params) => {
            //             return h('div', [
            //                 h('Button', {
            //                     props: {
            //                         type: 'error',
            //                         size: 'small'
            //                     },
            //                     on: {
            //                         click: () => {
            //                             this.deleteSub(params.index)
            //                         }
            //                     }
            //                 }, 'Устгах')
            //             ]);
            //         }
            //     }
            // ],
            newSub: {
                graphqlID: "",
                parent_identity: "",
            },
            newSubData: {
                table: "",
                parent_identity: "",
                connection_field: "",
            },
            name: "",
            graphql: {
                "table": "",
                "identity": "",
                "hidden_columns": [],
                "checkAuth": {"isLoggedIn": false, "roles": []},
                "subs": [],
                "actions": {"create": false, "update": false, "delete": false},
                "subscription": false
            }
        };
    },
    mounted() {

    },
    components: {},
    computed: {
        tableList() {
            return getTableView("table")
        },
        viewList() {
            return getTableView("view")
        },
        lang() {
            const labels = [
                'graphqlManagement',
                'table',
                'selectTable',
                'name',
                'idField',
                'hideFields',
                'permissionActions',
                'add',
                'edit',
                'delete',
                'accessAndAccessRights',
                'nevtersenHundHaruulah',
                'accessRights',
                'allUsersCanSee',
                'subTables',
                'save',
                'subTable',
                'connectionField',
                'real_time',
                'cancel',
                'tableParentId',
                'action',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('graphql.' + labels[i]);
                return obj;
            }, {});
        },
        _form() {
            const labels = ['savedSuccessfull','errorSaving','formIformationSavedSuccessfull', 'successDeleted'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
        subColumns(){
            return [
                {
                    title: this.lang.table,
                    key: 'table'
                },
                {
                    title: this.lang.tableParentId,
                    key: 'parent_identity'
                },
                {
                    title: this.lang.connectionField,
                    key: 'connection_field'
                },
                {
                    title: this.lang.action,
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.deleteSub(params.index)
                                    }
                                }
                            }, this.lang.delete)
                        ]);
                    }
                }
            ]

        }
    },
    watch: {}
};
</script>
