<template>
    <div>
        <list-view v-if="$project" :src="`/lambda/puzzle/project/${$project.id}/datasource`" :title="lang.data_settings" type="datasource" :data="listData" preview="hidden"></list-view>
        <list-view v-else src="/lambda/puzzle/schema/datasource" :title="lang.data_settings" type="datasource" :data="listData" preview="hidden"></list-view>
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

        computed: {
            lang() {
                const labels = ['data_settings',];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('puzzle.' + labels[i]);
                    return obj;
                }, {});
            },
        }
    };
</script>
