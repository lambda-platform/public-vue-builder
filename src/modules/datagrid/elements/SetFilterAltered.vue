<template>
    <div class="ag-input-wrapper">
        <input ref="sinput" class="ag-floating-filter-input" v-model="selected" @input="valueChanged"/>
    </div>
</template>

<script>
import Vue from "vue";
import {element} from "./index";

export default Vue.extend({
    data() {
        return {
            options: [],
            selected: '',
            currentValue: null
        }
    },

    methods: {
        element: element,

        setMeta(item) {
            item.schemaID = this.params.schemaID;
            return item;
        },

        getValues() {
            this.params.api.forEachLeafNode(node => {
                this.options.push(node.data[this.params.column.model]);
            });

            this.options = [...new Set(this.options)];
        },

        setValue(val) {
            this.selected = val;
            this.params.filterData(this.params.column.model, val, 'equals');
        },

        valueChanged(e) {
            console.log('I am changed', e.target.value);
            if (this.params.isClient) {
                this.params.filterData(this.params.column.model, e.target.value, 'contains');
            } else {
                // this.params.filterModel[this.params.column.model] = e.target.value;
                this.params.filterData(this.params.column.model, e.target.value);
            }
        },

        onParentModelChanged(parentModel) {
            this.currentValue = !parentModel ? null : parentModel.filter
        }
    }
});
</script>
