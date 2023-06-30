<template>
    <div class="selectable-input-filter">
        <input ref="sinput" v-model="selected" @input="valueChanged"/>
        <div class="selectable-input-filter-arrow">
            <Poptip @on-popper-show="getValues">
                <div class="arrow-down"></div>
                <div slot="content">
                    <ul class="selectable-input-filter-list">
                        <li v-for="item in options" :key="item.index" @click="setValue(item)">
                            {{ item }}
                        </li>
                    </ul>
                </div>
            </Poptip>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import {element} from "../elements";
import {getRelation} from "../utils/userFilter";

export default Vue.extend({
    data() {
        return {
            options: [],
            selected: '',
            currentValue: null
        }
    },

    created() {
        if (!this.params.isClient) {
            let dataUrl = `/lambda/krud/${this.params.schemaID}/options`;

            axios.post(dataUrl, getRelation(this.params.column.filter.relation)).then(({data}) => {
                this.options = data;
                this.loading = false;
            });
        } else {
            // for client side
            // console.log("here");
            // console.log(this.params.api);
            // setTimeout(() => {
            //     this.params.api.forEachLeafNode(node => {
            //         this.options.push(node.data[this.params.column.model]);
            //     });
            // }, 1000);
        }
    },

    methods: {
        element: element,
        setMeta(item) {
            item.schemaID = this.params.schemaID;
            return item;
        },
        getValues() {
            console.log("here");
            console.log(this.params.api);
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
            if (this.params.isClient) {
                this.params.filterData(this.params.column.model, e.target.value, 'contains');
            } else {
                this.params.filterData(this.params.column.model, e.target.value);
            }
        },

        onParentModelChanged(parentModel) {
            this.currentValue = !parentModel ? null : parentModel.filter
        }
    }
});
</script>
