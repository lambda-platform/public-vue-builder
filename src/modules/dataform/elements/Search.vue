<template>
    <div>
        <FormItem :prop=rule :label=label class="grid-search-input">
            <Select v-if="meta.gridSearch.multiple" v-model="model.form[model.component]"
                    :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label" multiple
                    @on-open-change="showSearchGrid">
                <Option v-for="item in selectedRows" :value="item[meta.gridSearch['key']]" :key="item.index">{{
                    item[meta.gridSearch['labels']] }}
                </Option>
            </Select>

            <Input v-else type="text" :value="labels" icon="ios-search-strong"
                   :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"
                   @on-focus="showSearchGrid"/>
        </FormItem>

        <Modal v-model="gridModal" class-name="grid-search-modal" :width="1000">
            <h3>{{ meta.label }}</h3>
            <datagrid v-if="meta.gridSearch.multiple" :schemaID="meta.gridSearch.grid" :paginate="50"
                      :highlights="model.form[model.component]" :hasSelection="true"
                      :onSelected="getMultipleValue"></datagrid>
            <datagrid v-else :schemaID="meta.gridSearch.grid" :paginate="50" :dblClick="getValue"></datagrid>
        </Modal>
    </div>
</template>

<script>
    export default {
        props: ["model", "rule", "label", "meta"],

        data() {
            return {
                gridModal: false,
                labels: null,
                selectedRows: []
            };
        },

        methods: {
            showSearchGrid() {
                this.gridModal = true;
            },

            addmethod(){
              console.log(this.selectedRows);
            },

            getValue(row) {
                this.labels = null;
                this.meta.gridSearch.labels.forEach((item, index) => {
                    if(this.labels==null) {
                        this.labels='';
                    }
                        this.labels += row[item];
                        if (this.meta.gridSearch.labels.length - 1 > index) {
                            this.labels += ", ";
                        }

                });

                this.gridModal = false;
                this.model.form[this.model.component] =
                    row[this.meta.gridSearch.key];
            },

            getMultipleValue(rows) {
                this.selectedRows = rows;
                this.labels = [];
                this.model.form[this.model.component] = [];
                rows.forEach(row => {
                    this.meta.gridSearch.labels.forEach((item, index) => {
                        this.labels.push(row[item]);
                    });

                    this.model.form[this.model.component].push(
                        row[this.meta.gridSearch.key]
                    );
                });

                this.labels = this.labels.join(", ");
            }
        }
    };
</script>

