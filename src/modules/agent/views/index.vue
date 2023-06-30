<template>
    <section class="page">
        <section class="agent-header">
            <Row :gutter="16" class="tbl-header">
                <Col span="12" class-name="tbl-header-left">
                    <div class="tbl-header-title">
                        <span v-if="!isDeleted">{{lang.userList}}</span>
                        <span v-else>{{lang.listOfDeletedUsers}}</span>
                    </div>
                    <div class="tbl-header-count">
                        <a @click="isDeleted = false" :class="isDeleted ? '': 'active'"><i
                            class="mdi mdi-account-group mdi-18px"></i> {{lang.totalEmployees}}: <span>{{ users.total }}</span></a>
                        <a @click="isDeleted = true" :class="isDeleted ? 'active': ''"><i
                            class="mdi mdi-account-remove mdi-18px"></i> {{lang.deleted}}: <span>{{ deletedUsers.total }}</span></a>
                    </div>
                </Col>

                <Col span="12" class-name="tbl-header-right">
                    <div class="tbl-search">
                        <form v-on:submit.prevent="searchUser">
                            <input :placeholder="lang.searchForInformation" v-model="q" class="tbl-search-input"/>
                        </form>
                        <i class="ti ti-search"></i>
                    </div>

                    <Button class="agent-add-btn" type="success" @click="showForm = true">
                        <i class="ti-plus"></i> {{lang.addUser}}
                    </Button>

                    <slot name="user-control"></slot>
                </Col>
            </Row>
        </section>

        <section class="page-agent">
            <template v-if="isDeleted">
                <template v-if="deletedUsers.total == 0">
                    <div class="no-user-data">
                        <i class="mdi mdi-account-off mdi-48px"></i>
                        <p>{{lang.noMatchingData}}</p>
                    </div>
                </template>
            </template>

            <template v-else>
                <template v-if="users.total == 0">
                    <div class="no-user-data">
                        <i class="mdi mdi-account-off mdi-48px"></i>
                        <p>{{lang.noMatchingData}}</p>
                    </div>
                </template>
            </template>

            <dv-pagination :is-deleted="isDeleted" :deleted-model="deletedUsers"
                           :model="users" :query="query" :roles="roles" :is-top="false" :layout="layout"></dv-pagination>

            <Row :gutter="16" class="user-grid-wrapper">
                <Col v-for="user in isDeleted ? deletedUsers.data : users.data" :key="user.id" :xs="24" :sm="12" :md="12"
                     :lg="8">
                    <div class="user-grid">
                        <div class="user-head">
                            <div class="user-avatar">
                                <template
                                    v-if="user.profile != null && user.profile.avatar != null && user.profile.avatar != ''">
                                    <img @error="showDefaultAvatar" :src="user.profile.avatar" alt="" width="80"
                                         class="user-avatar-img">
                                </template>
                                <template v-else>
                                    <img src="/assets/lambda/images/avatar.png" alt="" width="80"
                                         class="user-avatar-img">
                                </template>
                            </div>
                            <div class="user-info">
                                <h3>{{ user.login }}</h3>
                                <span>{{ user.display }}</span>
                            </div>
                            <div class="user-action">
                                <template v-if="isDeleted">
                                    <div class="deleted-user-grid">
                                        <Tooltip :content="lang.recovery" placement="top">
                                            <Poptip confirm :title="lang.ruconfinfo"
                                                    :cancelText="lang.no" :okText="lang.yes" transfer
                                                    @on-ok="restoreUser(user.id)"
                                                    @on-cancel="">
                                                <a><i class="ti-reload"></i></a>
                                            </Poptip>
                                        </Tooltip>
                                        <Tooltip :content="lang.completeDestruction" placement="top">
                                            <Poptip confirm :title="lang.ruconfinfoDelete"
                                                    :cancelText="lang.no" :okText="lang.yes" transfer
                                                    @on-ok="deleteUserComplete(user.id)"
                                                    @on-cancel="">
                                                <a><i class="ti-trash"></i></a>
                                            </Poptip>
                                        </Tooltip>
                                    </div>
                                </template>

                                <template v-else>
                                    <Tooltip :content="lang.edit" placement="top">
                                        <a @click="editUser(user.id)"><i class="ti-pencil"></i></a>
                                    </Tooltip>

                                    <Poptip confirm :title="lang.ruconfinfoDelete"
                                            :cancelText="lang.no"
                                            :okText="lang.yes" transfer @on-ok="deleteUser(user.id)"
                                            @on-cancel="">
                                        <a><i class="ti-trash"></i></a>
                                    </Poptip>
                                </template>
                            </div>
                            <div class="user-status">
                                <div v-if="user.status == 0" class="false">
                                    <i class="ti-na"></i>
                                    <span>{{lang.registrationIsNotConfirmed}}</span>
                                </div>

                                <div v-else class="user-status">
                                    <i class="ti-check"></i>
                                    <span>{{lang.registrationConfirmed}}</span>
                                </div>
                            </div>
                        </div>

                        <div class="user-content">
                            <ul class="user-content-list">
                                <li>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{lang.firstNameandLastName}}</span>
                                        <span class="user-content-list-data">
                                            <template
                                                v-if="user.first_name != null && user.first_name !=''">{{ user.first_name}}</template>
                                            <template
                                                v-if="user.last_name != null && user.last_name !=''"> {{user.last_name}}</template>
                                            <template v-else><span class="user-no-data">{{lang.noInfo}}</span></template>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{lang.email}}</span>
                                        <span class="user-content-list-data">
                                            <template
                                                v-if="user.email != null && user.email != ''">{{ user.email}}</template>
                                            <template v-else><span class="user-no-data">{{lang.noData}}</span></template>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{lang.mobile}}</span>
                                        <span class="user-content-list-data">
                                            <template
                                                v-if="user.phone != null && user.phone != ''">{{ user.phone}}</template>
                                            <template v-else><span class="user-no-data">{{lang.noData}}</span></template>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{ !isDeleted ? lang.createdDate : lang.deleted}} </span>
                                        <span class="user-content-list-data">{{ !isDeleted ? setMoment(user.created_at) : user.deleted_at}}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Col>
            </Row>
        </section>

        <Drawer width="700" class="agent-form" :closable="false" v-model="showForm">
            <dataform ref="agentForm" schemaID="user_form" :url="baseUrl ? baseUrl : ''" :editMode="editMode" :onSuccess="onSuccess"/>
        </Drawer>
    </section>
</template>

<script>
import moment from 'moment';
import pagination from "./pagination";

export default {
    props:['baseUrl'],
    computed: {
        lang() {
            const labels = ['db', 'usersAndUserGroups', 'users', 'userGroupsPermission', 'sendDBSchema',
                'userList', 'totalEmployees', 'categorySearch', 'sort', 'searchForInformation', 'noMatchingData', 'addUser',
                'registrationConfirmed','registrationIsNotConfirmed', 'createdDate', 'firstNameandLastName', 'noInfo', 'noData', 'email',
                'ruconfinfo', 'ruconfinfoDelete', 'created', 'deleted', 'listOfDeletedUsers', 'byLoginName', 'yes', 'no', 'completeDestruction',
                'recovery', 'edit', ''
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('user.' + labels[i]);
                return obj;
            }, {});
        },
        _messageTranslate() {
            const labels = [
                'userDeleted',
                'errorOccurredDeleting',
                'UserInformationRestored',
                'ErrorRetrievingData',
                'NoSearchResultsFound'
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('agent_wizard.' + labels[i]);
                return obj;
            }, {});
        },
        url(){
            return this.baseUrl ? this.baseUrl : "";
        },
    },
    components: {
        'dv-pagination': pagination
    },
    data() {
        return {
            showForm: false,
            isDeleted: false,
            loading: false,
            editMode: false,
            q: '',
            users: {
                total: 0
            },
            deletedUsers: {
                total: 0
            },
            query: {
                column: 'id',
                direction: 'asc',
                page: 1,
                per_page: 16,
                role: 'all'
            },
            roles: [],
            name1: this.wordSwap('recovery'),
        }
    },
    created() {
        this.getRoles();
        this.fetchData();
        this.fetchDeletedData();
    },
    methods: {

        setMoment(date) {
            return moment(date).format('YYYY-MM-DD')
        },
        fetchData() {
            axios.get(`${this.url}/agent/users?role=${this.query.role}&page=${this.query.page}&sort=${this.query.column}&direction=${this.query.direction}`).then(({data}) => {
                this.users = data;
            });
        },
        fetchDeletedData() {
            axios.get(`${this.url}/agent/users/deleted?role=${this.query.role}&page=${this.query.page}&sort=${this.query.column}&direction=${this.query.direction}`).then(({data}) => {
                this.deletedUsers = data;
            });
        },
        onSuccess(data) {
            if (this.editMode) {
                this.users.data = this.users.data.map(item => {
                    if (item.id == data.id) {
                        item = data;
                    }
                    return item;
                });
                this.showForm = false;
            } else {
                this.users.data.push(data);
            }
        },
        sortData(sort) {
            this.query.direction = sort.order;
            this.query.column = sort.key;
            this.fetchData();
            this.fetchDeletedData();
        },
        editUser(id) {
            this.editMode = true;
            this.showForm = true;
            this.$refs.agentForm.editModel(id);
        },
        deleteUser(id) {
            axios.get(this.url+'/agent/delete/' + id).then(o => {
                if (o.status) {
                    this.$Message.success(`${this._messageTranslate.userDeleted}`);
                    let deletedUser = this.users.data.find(item => item.id == id);
                    this.deletedUsers.data.push(deletedUser);
                    this.users.data = this.users.data.filter(item => item.id != id);
                    this.deletedUsers.total++;
                    this.users.total--;
                } else {
                    this.$Message.error(`${this._messageTranslate.errorOccurredDeleting}`);
                }
            })
        },
        deleteUserComplete(id) {
            axios.get(this.url+'/agent/delete/complete/' + id).then(o => {
                if (o.status) {
                    this.$Message.success(`${this._messageTranslate.userDeleted}`)
                    this.deletedUsers.data = this.deletedUsers.data.filter(item => item.id != id);
                    this.deletedUsers.total--;
                } else {
                    this.$Message.error(`${this._messageTranslate.errorOccurredDeleting}`);
                }
            })
        },
        restoreUser(id) {
            axios.get(this.url+'/agent/restore/' + id)
                .then(o => {
                    if (o.status) {
                        this.$Message.success(`${this._messageTranslate.UserInformationRestored}`);
                        let restoredUser = this.deletedUsers.data.find(item => item.id == id);
                        this.users.data.push(restoredUser);
                        this.deletedUsers.data = this.deletedUsers.data.filter(item => item.id != id);
                        this.deletedUsers.total--;
                        this.users.total++;
                    } else {
                        this.$Message.error(`${this._messageTranslate.ErrorRetrievingData}`);
                    }
                })
                .catch(errors => {
                    this.$Message.error(`${this._messageTranslate.ErrorRetrievingData}`);
                });
        },
        showDefaultAvatar(e) {
            e.target.src = this.url+"/assets/lambda/images/avatar.png";
        },
        searchUser() {
            if (this.q == null || this.q == '') {
                this.fetchData();
            } else {
                this.handleSearch(this.q);
            }
        },
        handleSearch(q) {
            axios.get(this.url+'/agent/search/' + q).then(o => {
                if (o.data.status) {
                    this.users = o.data.data;
                } else {
                    this.$Message.error(`${this._messageTranslate.NoSearchResultsFound}`);
                }
            });
        },
        getRoles() {
            axios.get(this.url+'/agent/roles').then(({data}) => {
                this.roles = data;
            })
        },
        wordSwap(words){
            console.log("words");
            console.log(words);
            //words = this.lang().words;
            return words;
        }
    }
}
</script>
