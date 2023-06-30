<template>
    <div class="login">
        <div class="content">
            <div class="slider">
                <Carousel v-model="currentSlide">
                    <CarouselItem v-for="item in slides" :key="item.index">
                        <div class="bg-cover"
                            :style="{backgroundImage: 'url(' + item.image + ')'}"
                        ></div>
                    </CarouselItem>
                </Carousel>
                <div class="layer"></div>
            </div>

            <div class="header">
                <div class="logo">
                    <img src="/assets/kb/images/logo.png" alt="logo"/>
                </div>

                <ul class="menu">
                    <li>
                        <a href="https://khanbank.com">
                            KHANBANK.COM ВЭБ
                        </a>
                    </li>

<!--                    <li>-->
<!--                        <a href="javascript:void(0)" @click="showInstructModal">-->
<!--                           <i class="ti-info-alt"></i> {{ lang.instructionsUse }}-->
<!--                        </a>-->
<!--                    </li>-->
                </ul>
            </div>

<!--            <div class="footer">-->
<!--                <h3>{{ lang.downloadYourMobileApp }}</h3>-->
<!--                <div class="box-row app">-->
<!--                    <a href="#">-->
<!--                        <img src="/assets/trade/images/playstore.png" alt=""/> Play-->
<!--                        store-->
<!--                    </a>-->

<!--                    <a href="#">-->
<!--                        <img src="/assets/trade/images/appstore.png" alt=""/> Apple-->
<!--                        store-->
<!--                    </a>-->
<!--                </div>-->
<!--            </div>-->
        </div>

        <div class="auth">
            <div class="form-wrap">
                <router-view :selectedLang="selectedLang"></router-view>
                <div class="copyright">
                    {{ copyright }}
                </div>
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
                    <h2 class="title">{{ lang.frequentlyAskedQuestions }}</h2>
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
                    <h2 class="title">{{ lang.instructionsUse }}</h2>
                    <a
                        href="javascript:void(0)"
                        @click="$modal.hide('instruct-modal')"
                        class="close"
                    >
                        <Icon type="ios-close"/>
                    </a>
                </div>
                <div class="modal-body np">

                </div>
            </div>
        </v-modal>

        <v-modal
            name="contact-modal"
            :pivot-y="0.5"
            :adaptive="true"
            :reset="true"
            :draggable="false"
            height="90%"
            width="70%"
        >
            <div class="d-modal">
                <div class="modal-header">
                    <h2 class="title">{{ lang.toContaqt }}</h2>
                    <a
                        href="javascript:void(0)"
                        @click="$modal.hide('contact-modal')"
                        class="close"
                    >
                        <Icon type="ios-close"/>
                    </a>
                </div>
                <div class="modal-body np">
                    <div class="mapouter">
                        <div class="gmap_canvas">
                            <iframe
                                width="100%"
                                height="300"
                                id="gmap_canvas"
                                src="https://maps.google.com/maps?q=premium%20palace&t=&z=17&ie=UTF8&iwloc=&output=embed"
                                frameborder="0"
                                scrolling="no"
                                marginheight="0"
                                marginwidth="0"
                            ></iframe>
                        </div>
                        <div class="contact-info">
                            <ul>
                                <li>
                                    <Icon type="ios-call-outline"/>
                                    <span>+976 90996996, 90000436</span>
                                </li>

                                <li>
                                    <Icon type="ios-mail-outline"/>
                                    <span>info@bitsoft.mn</span>
                                </li>

                                <li>
                                    <Icon type="ios-map-outline"/>
                                    <span
                                    >{{ lang.hayg }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
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
            const labels = ['hayg', 'instructionsUse', 'downloadYourMobileApp', 'toContaqt', 'frequentlyAskedQuestions',];
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
            selectedLang:
                localStorage.getItem("lang") == null
                    ? "mn"
                    : localStorage.getItem("lang"),
            languages: window.lambda.languages,
            copyright: window.lambda.copyright,
            lambda: window.lambda,
            styleObj: {
                backgroundImage: window.lambda.bg + " !important",
            },
            slides: [],
            faqs: [],
            news: [],
            currentSlide: 0,
            currentNews: null,
            isList: true,
        };
    },


    created() {
        this.getSlides();
    },

    mounted() {
        // setTimeout(() => {
        //     var options = {
        //         facebook: "108594218388042", // Facebook page ID
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

    methods: {

        getSlides() {
            axios.get("/api/slides").then(({data}) => {
                this.slides = data;
            });
        },


        showInstructModal(row) {
            if (this.faqs.length == 0) {
                this.getFaqs();
            }
            this.$modal.show("instruct-modal");
        },

        showContactModal(row) {
            if (this.faqs.length == 0) {
                this.getFaqs();
            }
            this.$modal.show("contact-modal");
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
@import "../../../scss/theme/kb/style";
</style>
