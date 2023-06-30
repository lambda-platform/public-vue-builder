<template>
    <mSelect label="label"
             v-if="params.column.model"
             v-model="selected"
             :options="options"
             :placeholder="lang.choosevalue"
             :allow-empty="false"
             @input="valueChanged">
    </mSelect>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import mSelect from "vue-multiselect";
import {element} from "../elements/index";
import {getRelation} from "../utils/userFilter";

export default Vue.extend({
    components: {
        mSelect
    },
    computed: {
        lang() {
            const labels = ['choosevalue'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
    },
    data() {
        return {
            loading: true,
            options: [{'value': null, 'label': 'Бүгд'}],
            selected: {'value': null, 'label': 'Бүгд'},
            currentValue: null,
            isCascade: false,
        }
    },
    mounted() {
        let dataUrl = `/lambda/krud/${this.params.schemaID}/options`;
        //get user condition
        this.params.column.filter.relation = getRelation(this.params.column.filter.relation);

        console.log("api: ", this.params.api.data);

        //get cascading options
        this.$watch(this.params.filterData, {
            handler: (value, oldValue) => {
                if (this.params.column.filter.relation.parentFieldOfForm != null && this.params.column.filter.relation.parentFieldOfTable != null) {
                    console.log("cascade value: ", this.$parent.$parent.filterModel[this.params.column.filter.relation.parentFieldOfForm]);

                    if (this.$parent.$parent.filterModel[this.params.column.filter.relation.parentFieldOfForm]) {
                        let temp_relation = JSON.parse(JSON.stringify(this.params.column.filter.relation));
                        console.log('tmp rel: ', temp_relation);

                        if (temp_relation.parentFieldOfForm != null && temp_relation.parentFieldOfTable != null) {
                            let condition = `${temp_relation.parentFieldOfTable} = '${this.$parent.$parent.filterModel[this.params.column.filter.relation.parentFieldOfForm]}'`;
                            if (temp_relation.filter === "" || typeof temp_relation.filter === "undefined") {
                                temp_relation.filter = condition;
                            } else {
                                temp_relation.filter = temp_relation.filter + " AND " + condition
                            }

                            axios.post(dataUrl, temp_relation).then(({data}) => {
                                this.options = [{'value': null, 'label': 'Бүгд'}];
                                this.options = this.options.concat(data);
                                this.loading = false;
                            });
                        }
                    }
                }
            },
            deep: true,
            immediate: true
        });

        if (!(this.params.column.filter.relation.parentFieldOfForm != null && this.params.column.filter.relation.parentFieldOfTable != null)) {
            axios.post(dataUrl, this.params.column.filter.relation).then(({data}) => {
                this.options = [{'value': null, 'label': 'Бүгд'}];
                this.options = this.options.concat(data);
                this.loading = false;
            });
        }
    },

    methods: {
        element: element,
        setMeta(item) {
            item.schemaID = this.params.schemaID;
            return item;
        },

        valueChanged(v) {
            let val = 'value' in v ? v.value : v[0];
            this.params.filterData(this.params.column.model, val);
        },

        getOptions() {
            // let dataUrl = `/lambda/krud/${this.params.schemaID}/options`;
            // //get user condition
            // this.params.column.filter.relation = getRelation(this.params.column.filter.relation);
            //
            // axios.post(dataUrl, this.params.column.filter.relation).then(({data}) => {
            //     this.options = [{'value': null, 'label': 'Бүгд'}];
            //     this.options = this.options.concat(data);
            //     this.loading = false;
            // });
        }
    }
});
</script>
