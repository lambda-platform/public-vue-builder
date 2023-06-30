<template>
    <div>
        <list-view v-if="$project" :src="`/lambda/puzzle/project/${$project.id}/grid`" :title="lang.table" type="grid" :data="listData"></list-view>
        <list-view v-else src="/lambda/puzzle/schema/grid" :title="lang.table" type="grid" :data="listData"></list-view>
    </div>
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
            const labels = ['table',];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('puzzle.' + labels[i]);
                return obj;
            }, {});
        },
    }
};
</script>
