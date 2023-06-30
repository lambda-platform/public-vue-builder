<template>
    <list-view src="/lambda/puzzle/schema/report" :title="lang._report" type="report" :data="listData" ></list-view>
</template>

<script>
import listView from "../../../components/listview.vue";
import {loadLanguageAsync} from "../../../locale/index";

export default {
    components: {
        "list-view": listView
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
    },
    computed: {
        lang() {
            const labels = ['_report',];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('puzzle.' + labels[i]);
                return obj;
            }, {});
        },
    }
};
</script>
