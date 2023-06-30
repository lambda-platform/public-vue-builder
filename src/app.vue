<template>
    <div class="paper-theme aside-page">
        <sidebar class="wide">
            <div slot="brand">
                <div class="logo">
                    <a href="/console" v-if="isMicroservice">
                        <img src="/assets/lambda/images/logo.svg" alt="Lambda Platform">
                    </a>
                    <img v-else src="/assets/lambda/images/logo.svg" alt="Puzzle Visual Builder">

                    <div class="language-switcher">
                        <Select size="small" v-if="has_language && languages.length >= 2" v-model="selectedLang"
                                @on-change="switchLanguage">
                            <Option v-for="lang in languages" :value="lang.code" :key="lang.index">
                                {{ lang.code }}
                            </Option>
                        </Select>
                    </div>
                </div>
            </div>

            <!--            <div slot="brand" class="logo">-->
            <!--                <span class="app-text">{{ app_text }}</span>-->
            <!--            </div>-->
            <ul>
                <li class="sub-title" v-if="isMicroservice">
                    <span>Microservice</span>
                </li>
                <li>
                    <router-link to="/config" v-if="isMicroservice">
                        <i class="flaticon-settings"></i>
                        <span>{{ langMicro.settings }}</span>
                    </router-link>
                </li>
                <li class="sub-title">
                    <span>{{ lang.data_recording_environment }}</span>
                </li>
                <li>
                    <router-link to="/form">
                        <i class="ti-layout-cta-right"></i>
                        <span>{{ lang._form }}</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/grid">
                        <i class="ti-layout-list-thumb"></i>
                        <span>{{ lang.table }}</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/crud">
                        <i class="ti-layers"></i>
                        <span>{{ lang.form_and_table_consolidation }}</span>
                    </router-link>
                </li>
                <!--                <li class="divider"></li>-->
                <!--                <li>-->
                <!--                    <router-link to="/process">-->
                <!--                        <i class="ti-view-list-alt"></i>-->
                <!--                        <span>Алхамт процесс</span>-->
                <!--                    </router-link>-->
                <!--                </li>-->
                <li class="divider"></li>
                <li class="sub-title">
                    <span>{{ lang.data_processor }}</span>
                </li>

                <li>
                    <router-link to="/datasource">
                        <i class="ti-server"></i>
                        <span>{{ lang.data_settings }}</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/chart">
                        <i class="ti-pie-chart"></i>
                        <span>{{ lang._chart }}</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/moqup">
                        <i class="ti-layout"></i>
                        <span>{{ lang.original_preparation }}</span>
                    </router-link>
                </li>
                <li v-if="!isMicroservice">
                    <router-link to="/report">
                        <i class="ti-layout-accordion-list"></i>
                        <span>{{ lang._report }}</span>
                    </router-link>
                </li>
                <li v-if="!isMicroservice">
                    <router-link to="/analytic">
                        <i class="ti-bar-chart"></i>
                        <span>{{ lang.analysis }}</span>
                    </router-link>
                </li>

                <li>
                    <router-link to="/notification">
                        <i class="ti-bell"></i>
                        <span>{{ lang.target_statement }}</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/graphql">
                        <img src="/assets/lambda/images/graphql.svg" width="21">&nbsp;
                        <span>{{ lang.graphql_management }}</span>
                    </router-link>
                </li>

                <li>
                    <router-link to="/visual-builder">
                        <i class="ti-panel"></i>
                        <span>{{ lang.web_page }}</span>
                    </router-link>
                </li>
                <li class="divider" v-if="accessAdminModule"></li>
                <li class="sub-title" v-if="accessAdminModule">
                    <span>{{ lang.usersAndUserGroups }}</span>
                </li>
                <li v-if="accessAdminModule">
                    <router-link to="/module/agent">
                        <i class="ti-user"></i>
                        <span>{{ lang.users }}</span>
                    </router-link>
                </li>
                <li v-if="accessAdminModule">
                    <router-link to="/role">
                        <i class="ti-unlock"></i>
                        <span>{{ lang.userGroupsPermission }}</span>
                    </router-link>
                </li>
                <li v-if="accessAdminModule">
                    <router-link to="/menu">
                        <i class="ti-align-justify"></i>
                        <span>{{ lang.menu_settings }}</span>
                    </router-link>
                </li>
                <li class="divider"></li>
            </ul>
            <div slot="aside-bottom">
                <ul>
                    <li>

                        <a @click="logoutModal = true">
                            <Icon type="ios-log-out"></Icon>
                            <span>
                                {{ lang.logOut }}
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        </sidebar>
        <main>
            <router-view></router-view>
        </main>

        <Modal v-model="logoutModal" :closable="false" width="252" class="logout-modal">
            <p slot="header" style="display:none;"></p>
            <div style="text-align:center">
                <a @click="logout()">
                    <Icon type="md-log-out"/>
                    {{ lang.logOut }}
                </a>
                <a @click="cancel()">
                    <Icon type="md-refresh"/>
                    {{ lang.cancel }}
                </a>
            </div>
            <div slot="footer" style="display:none;">
                <form action="/auth/logout"></form>
            </div>
        </Modal>
    </div>
</template>
<script>

import {mapGetters} from "vuex";
import {loadLanguageAsync} from "./locale/index";

export default {
    computed: {
        ...mapGetters({
            user: "user"
        }),
        lang() {
            const labels = [

                'data_recording_environment',
                '_form',
                'table',
                'form_and_table_consolidation',
                'data_processor',
                'data_settings',
                '_chart',
                'original_preparation',
                '_report',
                'analysis',
                'target_statement',
                'graphql_management',
                'usersAndUserGroups',
                'users',
                'userGroupsPermission',
                'menu_settings',
                'logOut',
                'cancel',
                'web_page',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('puzzle.' + labels[i]);
                return obj;
            }, {});
        },
        langMicro() {
            const labels = [
                'project',
                'settings',
                'data_recording_environment',
                '_form',
                'table',
                'form_and_table_consolidation',
                'data_processor',
                '_chart',
                'original_preparation',
                'analysis',
                'target_statement',
                'graphql_management',
                'menu',
                'menu_settings',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('project.' + labels[i]);
                return obj;
            }, {});
        },
        accessAdminModule() {
            if (this.isMicroservice) {
                if (this.microservoce.project_type === 'Client') {
                    return true
                }
                return false
            }
            return true;

        }
    },
    data() {
        const app_logo = window.init.app_logo;
        const app_text = window.init.app_text;
        return {
            isMicroservice: window.init.isMicroservice,
            microservoce: window.init.project,
            logoutModal: false,
            app_logo: app_logo,
            app_text: app_text,
            languages: window.lambda.languages,
            has_language: window.lambda.has_language,
            selectedLang: localStorage.getItem("lang") == null ? window.lambda.default_language : localStorage.getItem("lang"),
        };
    },
    components: {},

    beforeMount() {
        if (this.selectedLang !== "mn_MN") {
            if(this.selectedLang === "mn_MN" || this.selectedLang === "en_US"){
                loadLanguageAsync(this.selectedLang);
            } else {
                loadLanguageAsync("mn_MN");
            }

        }
    },
    methods: {

        switchLanguage(val) {
            this.selectedLang = val;
            loadLanguageAsync(val);
        },
        logout() {
            axios.post("/auth/logout", {}).then(() => {
                window.location = "/auth/login";
            });
        },
        cancel() {
            this.$data.logoutModal = false;
        }
    }
};
</script>
