<template>
    <div class="login">
        <div class="content">
            <div class="content-layer"></div>
            <div class="title">
                <h2 style="max-width: 600px;">{{ lang.title }}</h2>
                <p>{{ lang.subTitle }}</p>
            </div>

            <div class="header">
                <div class="logo">
                    <img src="/assets/parental/images/crc-mn-logo.png" alt="logo" style="height: 50px"/>
                </div>

                <ul class="menu">
                    <li>
                        <a href="javascript:void(0)" @click="showFaqModal"
                        >{{lang.frequentlyAskedQuestions}}</a>
                    </li>

                    <li>
                        <a href="javascript:void(0)" @click="showInstructModal">
                            {{ lang.instructionsUse }}
                        </a>
                    </li>

                    <li>
                        <a href="https://crc.gov.mn/k/2lc" target="_blank">
                            {{lang.toContaqt}}
                        </a>
                    </li>
                </ul>
            </div>

            <div class="footer">
                <h3>{{lang.downloadAppHere}}</h3>
                <div class="box-row app">
                    <a
                        :href="androidd"
                    >
                        <img src="/assets/parental/images/icon-android.svg" alt=""/> Play
                        store
                    </a>

                    <a
                        :href="windowsd"
                    >
                        <img src="/assets/parental/images/icon-windows.svg" alt=""/> Windows
                    </a>
                </div>
            </div>
        </div>

        <div class="auth">
            <div class="form-wrap">
                <router-view></router-view>
                <div class="copyright" v-html="copyright"></div>
            </div>
        </div>

        <v-modal
            name="faq-modal"
            :pivot-y="0.5"
            :adaptive="true"
            :reset="true"
            :draggable="false"
            height="90%"
            width="70%"
        >
            <div class="d-modal">
                <div class="modal-header">
                    <h2 class="title">{{lang.frequentlyAskedQuestions}}</h2>
                    <a
                        href="javascript:void(0)"
                        @click="$modal.hide('faq-modal')"
                        class="close"
                    >
                        <Icon type="ios-close"/>
                    </a>
                </div>
                <div class="modal-body np">
                    <Spin v-if="isLoading" fix></Spin>
                    <Collapse simple>
                        <Panel v-for="item in faqs" :key="item.index" :name="item.index">
                            {{ item.title }}
                            <p slot="content">
                                <span v-html="item.content"></span>
                            </p>
                        </Panel>
                    </Collapse>
                </div>
            </div>
        </v-modal>

        <v-modal
            name="instruct-modal"
            :pivot-y="0.5"
            :adaptive="true"
            :reset="true"
            :draggable="false"
            height="90%"
            width="70%"
        >
            <div class="d-modal">
                <div class="modal-header">
                    <h2 class="title">{{lang.instructionsUse}}</h2>
                    <a
                        href="javascript:void(0)"
                        @click="$modal.hide('instruct-modal')"
                        class="close"
                    >
                        <Icon type="ios-close"/>
                    </a>
                </div>
                <div class="modal-body np">
                    <p v-if="help" v-html="help.body"></p>
                </div>
            </div>
        </v-modal>
    </div>
</template>

<script>
import Vue from "vue";
import iView from "iview";
import lang from "iview/dist/locale/en-US";
import vModal from "vue-js-modal";

Vue.use(iView);
iView.locale(lang);
Vue.use(vModal, {componentName: "v-modal"});

export default {

    computed: {
        lang() {
            const labels = ['instructionsUse', 'frequentlyAskedQuestions', 'downloadAppHere', 'toContaqt', 'title', 'subtitle',];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('user.' + labels[i]);
                return obj;
            }, {});
        },
    },
    data() {
        return {
            isLoading: false,
            loading: false,
            isSuccess: false,
            isError: false,
            credentials: {
                login: null,
                password: null,
            },
            copyright: window.lambda.copyright,
            windowsd: window.lambda.windowslink,
            androidd: window.lambda.androidlink,
            lambda: window.lambda,
            faqs: [],
            help: null,
        };
    },

    mounted() {
        // setTimeout(() => {
        //     var options = {
        //         facebook: "416936338507897", // Facebook page ID
        //         call_to_action: "Бидэнтэй холбогдох", // Call to action
        //         position: "right", // Position may be 'right' or 'left'
        //     };
        //     var proto = document.location.protocol,
        //         host = "getbutton.io",
        //         url = proto + "//static." + host;
        //     var s = document.createElement("script");
        //     s.type = "text/javascript";
        //     s.async = true;
        //     s.src = url + "/widget-send-button/js/init.js";
        //     s.onload = function () {
        //         WhWidgetSendButton.init(host, proto, options);
        //     };
        //     var x = document.getElementsByTagName("script")[0];
        //     x.parentNode.insertBefore(s, x);
        // }, 1000);
    },
    created() {
        this.getFaqs();
    },
    methods: {
        getFaqs() {
            this.isLoading = true;
            axios.get("/api/loginContent").then(({data}) => {
                this.faqs = data.faq;
                this.help = data.help;
                setTimeout(() => {
                    this.isLoading = false;
                }, 1000);
            });
        },

        showFaqModal(row) {
            this.isLoading = false;
            if (this.faqs.length == 0) {
                this.getFaqs();
            }
            this.$modal.show("faq-modal");
        },

        showInstructModal(row) {
            if (this.faqs.length == 0) {
                this.getFaqs();
            }
            this.$modal.show("instruct-modal");
        },

        showDetail(item) {
            this.currentNews = item;
            this.isList = false;
        },

        goBack() {
            this.isList = true;
        },
    },
};
</script>

<style lang="scss">
@import "../../../scss/theme/parental/style";
</style>
