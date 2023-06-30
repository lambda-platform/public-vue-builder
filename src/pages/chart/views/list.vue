<template>
    <list-view v-if="$project" :src="`/lambda/puzzle/project/${$project.id}/chart`" :title="lang._chart" type="chart" :data="listData" ></list-view>
    <list-view v-else src="/lambda/puzzle/schema/chart" :title="lang._chart" type="chart" :data="listData" ></list-view>
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
                const labels = ['_chart',];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('puzzle.' + labels[i]);
                    return obj;
                }, {});
            },
        }
    };
</script>
