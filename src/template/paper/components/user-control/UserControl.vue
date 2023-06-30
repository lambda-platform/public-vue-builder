<template>
    <div class="user-control">
        <ul>
            <li class="paper-notification">
                <notif-widget :user="$user.id"/>
            </li>

            <li class="avatar-item">
                <Poptip placement="bottom-end" popper-class="no-animation">
                    <a href="javascript:void(0)" class="avatar">
                        <img src="/assets/lambda/images/avatar.png" alt="avatar">
                        <div class="avatar-name">
                            <span>{{lang.welcome}}</span>
                            <b>{{ $user.first_name ? $user.first_name : $user.login }} {{ $user.org_id ? '/' : '' }} {{ $user.org_id ? $user.org_id : '' }}</b>
                        </div>
                    </a>
                    <div class="header-profile" slot="content">
                        <div class="header-profile-info">
                            <h3>{{ $user.login }} </h3>
                            <small>{{ $user.org_id ? $user.org_id : lang.loggedIn }}</small>
                        </div>
                        <ul>
                            <li>
                                <router-link to="/module/profile">
                                    <Icon type="ios-contact-outline"/>
                                    <span>{{lang.personalInfo}}</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/module/password">
                                    <Icon type="ios-key-outline"/>
                                    <span>{{lang.changePass}}</span>
                                </router-link>
                            </li>
                            <li v-if="$user.role==1 || $user.role==29">
                                <a href="/lambda/puzzle" target="_blank">
                                    <Icon type="ios-settings-outline"/>
                                    <span>{{lang.superAdminManagement}}</span>
                                </a>
                            </li>
                            <li>
                                <a @click="logoutModal = true">
                                    <Icon type="ios-log-out"/>
                                    <span >{{lang.logout}}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </Poptip>
            </li>

            <slot name="right">
            </slot>

        </ul>

        <Modal v-model="logoutModal" :closable="false" width="252" class="logout-modal">
            <p slot="header" style="display:none;"></p>
            <div style="text-align:center">
                <a @click="logout()">
                    <Icon type="md-log-out"/>
                    <span>{{common._logout}}</span>
                </a>
                <a @click="cancel()">
                    <Icon type="md-refresh"/>
                    <span>{{common._cancel}}</span>
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

export default {
    name: "UserControl",
    computed: {
        ...mapGetters({
            user: "user",
        }),
        lang() {
            const labels = ['welcome', 'loggedIn', 'personalInfo', 'changePass', 'superAdminManagement', 'logout'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('role.' + labels[i]);
                return obj;
            }, {});
        },
        common() {
            const labels = ['_logout', '_cancel'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('user.' + labels[i]);
                return obj;
            }, {});
        }
    },
    data() {
        return {
            logoutModal: false,
            poptipOption: {
                animation: 'none',
                modifiers: {
                    computeStyle: {
                        gpuAcceleration: false,
                    },
                    preventOverflow: {
                        boundariesElement: 'window'
                    }
                }
            },
            scrollOptions: {
                height: '100%',
                size: 7,
                alwaysVisible: true,
                wheelStep: 5,
                color: '#2C3A47'
            },

        };
    },
    methods: {
        logout() {
            axios.post("/auth/logout", {}).then(o => {
                window.location = "/auth/login";
            });
        },
        cancel() {
            this.$data.logoutModal = false;
        },
    }
}
</script>

<style lang="scss">
@import "./UserControl";
</style>
