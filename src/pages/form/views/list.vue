<template>
    <div>
        <list-view v-if="$project" :src="`/lambda/puzzle/project/${$project.id}/form`" :title="lang._form" type="form" :data="listData" ></list-view>
        <list-view v-else src="/lambda/puzzle/schema/form" :title="lang._form" type="form" :data="listData" ></list-view>
    </div>
</template>

<script>
import listView from "../../../components/listview.vue";

export default {
    components: {
        "list-view": listView
    },
    data() {
        return {
        };
    },
    methods: {

    },
    computed: {
        lang() {
            const labels = ['_form',];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('puzzle.' + labels[i]);
                return obj;
            }, {});
        },
    }
};
</script>
