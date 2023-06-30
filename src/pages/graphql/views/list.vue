<template>
    <div>
        <list-view v-if="$project" :src="`/lambda/puzzle/project/${$project.id}/graphql`"  :title="lang.graphql_management" type="graphql" :data="listData" preview="hidden"></list-view>
        <list-view v-else src="/lambda/puzzle/schema/graphql" :title="lang.graphql_management" type="graphql" :data="listData" preview="hidden"></list-view>
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
            const labels = ['graphql_management',];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('project.' + labels[i]);
                return obj;
            }, {});
        },
    }
};
</script>
