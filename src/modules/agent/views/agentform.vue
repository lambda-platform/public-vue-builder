<template>
    <section class="page">
        <paper-header class="mini" v-if="!withoutHeader">
            <div slot="right" >
                <slot name="user-control"></slot>
            </div>

            <div slot="nav">
                <ul>
                    <li v-if="type == 'profile'">
                        <router-link to="">
                            <i class="tu-user"></i>
                            <span>{{lang.personalInformation}}</span>
                        </router-link>
                    </li>
                    <li v-if="type == 'password'">
                        <router-link to="">
                            <span>{{lang.changePassword}}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <div slot="tool">
            </div>
        </paper-header>
        <section class="page-agent-form">
            <dataform v-if="type == 'profile'" :url="baseUrl ? baseUrl : ''" class="material-form" ref="agentForm" schemaID="user_profile" :editMode="editMode" :do_render="editMode" :onReady="editUser" :onSuccess="onSuccess"/>
            <dataform v-if="type == 'password'" :url="baseUrl ? baseUrl : ''" class="material-form" ref="agentForm" schemaID="user_password" :editMode="editMode" :do_render="editMode" a :onReady="editUser" :onSuccess="onSuccess"/>
        </section>
    </section>
</template>

<script>
import pagination from "./pagination";

export default {
    props:['type', 'withoutHeader', 'baseUrl'],
    components: {
        'dv-pagination': pagination
    },
    computed: {
        lang() {
            const labels = ['db', 'changePassword', 'personalInformation'
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('user.' + labels[i]);
                return obj;
            }, {});
        },
    },
    data() {
        return {
            editMode: true,
        }
    },



    methods: {
        onSuccess(data) {
        },
        editUser() {
            this.$nextTick(() => {
                this.$refs.agentForm.editModel(this.$user.id);
            });

        },

        showDefaultAvatar(e) {
            e.target.src = "/assets/lambda/images/avatar.png";
        },

    }
}
</script>
