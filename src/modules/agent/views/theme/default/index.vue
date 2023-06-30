<template>
    <div class="login default-theme"
         :style="{ backgroundImage: 'url(' + lambda.bg + ')', backgroundSize:'cover', backgroundPosition:'center top' }">
        <div class="wrap">
            <div class="content">
                <div class="content-blur"></div>
                <div class="content-color-layer"></div>
                <div id="slideshow">
                    <div class="one">
                        <h2>
                            <span>{{ lang.title }}</span>
                        </h2>
                        <p>
                            {{ lang.subtitle }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="auth">
                <div class="auth-blur"></div>
                <div class="auth-color-layer"></div>
                <div class="lang-switcher" v-if="lambda.has_language && languages.length >= 2">
                    <a v-for="item in languages" :key="item.index"
                       :class="selectedLang == item.value ? 'active' : ''" href="javascript:void(0)"
                       @click="switchLanguage(item.code)">
                        {{ item.label }}
                    </a>
                </div>
                <router-view :selectedLang="selectedLang">
                    <div class="copyright" style="width:70%; text-align:center;" slot="copyright">
                        {{ copyright }}
                    </div>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "default",
    data() {
        return {
            loading: false,
            isSuccess: false,
            isError: false,
            credentials: {
                login: null,
                password: null
            },
            selectedLang: localStorage.getItem("lang") == null ? window.lambda.default_language : localStorage.getItem("lang"),
            languages: window.lambda.languages,
            copyright: window.lambda.copyright,
            lambda: window.lambda,
        }
    },

    computed: {
        lang() {
            const labels = ['title', 'subtitle'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('user.' + labels[i]);
                return obj;
            }, {});
        }
    },
}
</script>

<style lang="scss">
@import "../../../scss/theme/default/style";
</style>
