<template>
    <div class="dg-filter">
        <div class="dg-filter-widget">
            <div class="dg-filter-widget-header">
                <h3>{{lang.infoCourt}}</h3>
            </div>
            <div class="dg-filter-widget-body">
                <Form ref="filterFrm" :model="model" label-position="top">
                    <FormItem v-for="item in schema" v-if="item.filterable && item.filter && item.filter.type && item.filter.showSideFilter !== false"
                              :key="item.index">
                        <component :is="element(item.filter.type)" :model="{form: model, component: item.model}"
                                   :label="item.filter.label ? item.filter.label : item.label" :meta="setMeta(item)">
                        </component>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" long @click="$parent.filterData(1)">{{lang.filtering}}</Button>
                    </FormItem>
                    <br/>
                </Form>
            </div>

        </div>

        <GridRowUpdate :permissions="permissions" :model="model" :schema="schema" :url="url" :inFilter="true" :schemaID="schemaID"  />
    </div>
</template>

<script>
    import {element} from "./elements";
    import GridRowUpdate from "./GridRowUpdate";
    export default {
        props: ["model", "schema", "schemaID", "permissions", "url"],
        components:{
            GridRowUpdate:GridRowUpdate
        },
        computed: {
            // ...mapGetters({
            //     user: "user"
            // }),
            lang() {
                const labels = ['infoCourt', 'filtering', 'updatedSuccessfully', 'errorOccurredWhileUpdating', 'pleaseSelectUpdateLine'
                ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataGrid.' + labels[i]);
                    return obj;
                }, {});
            },
        },

        methods: {
            element: element,
            setMeta(item) {
                item.schemaID = this.$props.schemaID;
                return item;
            },

        }
    };
</script>
