<template>
    <div v-if="permissions">
        <div v-if="!inFilter && permissions.u === true">
            <portal to="drawer-left" >
                <div  class="row-updater">
                    <div class="row-update-item" v-for="item in schema" v-if="item.updateable && item.update && item.filter.type">
                        <Button type="success" @click="preUpdate(item.update.label, item.update.updateForm, item.model, item.update.refresh)" :icon="item.update.buttonIcon">
                            {{ item.update.buttonLabel }}
                        </Button>
                    </div>
                </div>

            </portal>
        </div>

        <div class="dg-filter-widget" v-for="item in schema" v-if="item.updateable && item.update && item.filter.type && permissions.u === true && inFilter">
            <div class="dg-filter-widget-header">
                <h3>{{ item.update.updateLabel }}</h3>
            </div>
            <div class="dg-filter-widget-body">
                <Form :model="item.update.updateForm" label-position="top">
                    <FormItem>
                        <component :is="element(item.filter.type)"
                                   :model="{form: item.update.updateForm, component: item.model}"
                                   :label="item.update.label ? item.update.label : item.label"
                                   :meta="setMeta(item)">
                        </component>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" long
                                @click="updateRows(item.update.updateForm, item.model, item.update.refresh)">
                            {{ item.update.buttonLabel }}
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
import {element} from "./elements";
export default {

    props: ["model", "schema", "schemaID", "permissions", "url", "inFilter"],
    name: "GridRowUpdate",
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
        preUpdate(value, updateForm, model, refresh){
            updateForm[model] = value
            this.updateRows(updateForm, model, refresh)
        },
        updateRows(updateForm, model, refresh) {


            let selectedNodes = this.inFilter ? this.$parent.$parent.gridApi.getSelectedNodes() :  this.$parent.gridApi.getSelectedNodes();

            let selectedData = selectedNodes.map(node => {
                let indentity = this.inFilter ? this.$parent.$parent.identity :this.$parent.identity;
                return node.data[indentity];
            });
            if (selectedData.length >= 1) {
                let updateData = {
                    ids: selectedData,
                    value: updateForm[model],
                    model: model
                };
                let baseUrl = this.$props.url ? this.$props.url : '';
                axios.post(`${baseUrl}/lambda/krud/update-row/${this.schemaID}`, updateData).then(res => {
                    if (res.data.status) {
                        if (refresh) {
                            this.inFilter ? this.$parent.$parent.refresh() : this.$parent.refresh();
                        }
                        this.$Message.success(this.lang.updatedSuccessfully);
                        // this.$Message.success(this.lang.updatedSuccessfully);

                        // updateForm[model] = null;

                    } else {
                        this.$Message.error(this.lang.errorOccurredWhileUpdating);
                    }
                }).catch(e => {
                    this.$Message.error(this.lang.errorOccurredWhileUpdating);
                });

            } else {
                this.$Message.warning(this.lang.pleaseSelectUpdateLine);
            }

        },
    }
}
</script>

