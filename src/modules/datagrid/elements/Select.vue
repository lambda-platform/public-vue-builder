<template>
    <FormItem :label=label :prop=rule>
        <!--<Input type="text" v-model="model.form[model.component]"-->
        <!--:placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"-->
        <!--:disabled="meta && meta.disabled ? meta.disabled : false"-->

        <!--/>-->
        <!--<mSelect-->
        <!--v-if="!loading"-->
        <!--:multiple="true"-->
        <!--v-model="model.form[model.component]"-->
        <!--:options="options"-->
        <!--:placeholder="meta && meta.placeHolder ? meta.placeHolder : label"-->
        <!--:allow-empty="false">-->
        <!--</mSelect>-->
        <!--<Select v-if="!loading" v-model="model.form[model.component]" :placeholder="meta && meta.placeHolder ? meta.placeHolder : label" filterable>-->
        <!--<Option v-for="item in options" :key=item.index :value="item.value" v-if="isShow(item)">{{ item.label }}</Option>-->
        <!--</Select>-->
        <multiselect v-if="!meta.relation.multiple"
                     v-model="value"
                     :disabled="meta.disabled"
                     :options="options"
                     track-by="value"
                     :searchable="true"
                     @search-change="searchChange"
                     :clear-on-select="true"
                     :placeholder="label ? label : ''"
                     label="label">
            <template slot="singleLabel" slot-scope="{ option }">
                {{ option.label }}
            </template>
            <template slot="clear" slot-scope=""
                      @mousedown.prevent.stop="toggle">
                <div class="clear-container">
                    <Button v-if="clearAble" @click="clearState"
                            shape="circle" size="small"
                            icon="md-close"></Button>
                </div>
            </template>
        </multiselect>
        <multiselect v-else
                     :multiple="true"
                     v-model="value"
                     :disabled="meta.disabled"
                     track-by="value"
                     @search-change="searchChange"
                     :searchable="true"
                     :clear-on-select="true"
                     :placeholder="label ? label : ''"
                     label="label"
                     :options="options"
        >
        </multiselect>
    </FormItem>
</template>

<script>
import Vue from "vue";
import axios from "axios";

import {getRelation} from "../utils/userFilter"

export default {
    props: ["model", "rule", "label", "meta", "relation_data"],

    data() {
        return {
            options: [],
            loading: true,
            value: null,
            clearAble: false,
            searchval: null
        };
    },
    methods: {
        clearState() {
            this.value = null;
            this.clearAble = false;
            Vue.set(this.model.form, this.model.component, null);
        },

        searchChange(val) {
            this.searchval = val;
        }
    },

    watch: {
        value(val) {
            if (val) {
                //trigger ajillah uyd ugugdluu solihgui haav
                //this.ignoreChange = true;
                if (this.meta.relation.multiple == true) {
                    Vue.set(this.model.form, this.model.component, val.map(vv => vv['value']).join(','));
                } else {
                    Vue.set(this.model.form, this.model.component, val['value']);
                }
                this.clearAble = true;
            }
        },
    },
    mounted() {
        let dataUrl = `/lambda/krud/${this.meta.schemaID}/options`;

        if (this.meta.filter.relation.parentFieldOfForm != null && this.meta.filter.relation.parentFieldOfTable != null) {
            this.$watch("model.form." + this.meta.filter.relation.parentFieldOfForm, {
                handler: (value, oldValue) => {
                    this.meta.filter.relation.filter = this.meta.filter.relation.parentFieldOfTable + "='" + value.toString()+"'";
                    axios.post(dataUrl, getRelation(this.meta.filter.relation)).then(({data}) => {
                        this.options = data;
                        this.loading = false;
                    });
                },
                deep: true
            });
        }

        axios.post(dataUrl, getRelation(this.meta.filter.relation)).then(({data}) => {
            this.options = data;
            this.loading = false;

            if(this.model.form[this.model.component] != null && this.model.form[this.model.component] != undefined){

                let valueIndex = this.options.findIndex(el=>el.value == this.model.form[this.model.component]);
                if(valueIndex >= 0){
                    this.value = this.options[valueIndex];
                }

            }
        });
    },
};
</script>
