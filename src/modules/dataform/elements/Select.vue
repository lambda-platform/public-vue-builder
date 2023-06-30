<template>
    <FormItem class="select-item" :label=label :prop=rule>
        <multiselect v-if="!meta.relation.multiple"
                     v-model="value"
                     :disabled="meta.disabled"
                     :options="options"
                     @search-change="searchChange"
                     track-by="value"
                     :searchable="true"
                     :allow-empty="true"
                     :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label ? label : ''"
                     :class="meta.info_url ? 'with-info-caller' : ''"
                     label="label">
            <template slot="singleLabel" slot-scope="{ option }">
                {{ option.label }}
            </template>

            <template slot="caret"
                      slot-scope="{ toggle }"
                      @mousedown.prevent.stop="toggle">
                <div class="caret-container">
                    <div :class="addAble ? 'multiselect__select addable-caret' : 'multiselect__select'">
                    </div>
                    <Button v-if="addAble" @click="showAddModal" type="success"
                            shape="circle" size="small"
                            icon="md-add"></Button>
                </div>
            </template>
            <template slot="clear" slot-scope="{ search }"
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
                     :searchable="true"
                     @search-change="searchChange"
                     :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label ? label : ''"
                     label="label"
                     :options="options"
                     :class="meta.info_url ? 'with-info-caller' : ''">
            <template slot="caret"
                      slot-scope="{ toggle }"
                      @mousedown.prevent.stop="toggle">
                <div class="caret-container">
                    <div :class="addAble ? 'multiselect__select addable-caret' : 'multiselect__select'">
                    </div>
                    <Button v-if="addAble" @click="showAddModal" type="success"
                            shape="circle" size="small"
                            icon="md-add"></Button>
                </div>
            </template>
        </multiselect>

        <div v-if="meta.info_url" class="info-caller">
            <Button shape="circle" type="primary" icon="ios-help-circle" size="small" @click="showInfoModal"></Button>
        </div>

        <Modal
            :min-width="200"
            :min-height="100"
            :draggable="true"
            :footer-hide="true"
            :title="label"
            width="800"
            height="70%"
            v-model="modal_show"
            v-if="addAble">
            <section class="add-modal" v-if="modal_show">
                <div class="add-body">
                    <dataform ref="form" :schemaID="meta.relation.addFrom"
                              :editMode="false"
                              :onSuccess="onSuccess"
                              :url="addFromUrl()"
                              :do_render="modal_show"
                              :onError="onError"></dataform>
                </div>
            </section>
        </Modal>
    </FormItem>
</template>

<script>

import {isValid} from "../utils/methods"

export default {
    props: ["model", "rule", "label", "meta", "disabled", "relation_data", "do_render", "showInformationModal"],
    computed: {
        lang() {
            const labels = ['dataNotFound',];

            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },

        options() {
            if (isValid(this.meta) && isValid(this.meta.options) && this.meta.options.length >= 1) {
                if (this.searchval)
                    return this.filterOption(this.meta.options).filter(entry => entry.label.toLowerCase().includes(this.searchval.toLowerCase()));
                return this.filterOption(this.meta.options)
            } else {
                if (this.searchval)
                    return this.filterOption(this.relation_data).filter(entry => entry.label.toLowerCase().includes(this.searchval.toLowerCase()));
                return this.filterOption(this.relation_data);
            }
        },
    },
    data() {
        return {
            value: null,
            ignoreChange: false,
            addAble: false,
            clearAble: false,
            modal_show: false,
            searchval: null
        }
    },

    watch: {
        do_render(value) {
            if (value == null) {
                this.value = null;
                this.clearAble = false;
                this.ignoreChange = false;
                Vue.set(this.model.form, this.model.component, this.meta.default ? this.meta.default : undefined);
            } else {
                if (this.model.form[this.model.component] != null && this.model.form[this.model.component] != undefined) {
                    let value = this.model.form[this.model.component];
                    //If multiple
                    if (this.meta.relation.multiple == true) {
                        let selectedData = value.toString().split(',');
                        this.value = this.options.filter(item => selectedData.includes(item.value.toString()));
                    } else {
                        let filtered = this.options.filter(item => item.value == value);
                        this.value = filtered.length >= 1 ? filtered[0] : null;
                    }
                    this.clearAble = true;
                }
            }
        },

        value(val) {
            if (val) {
                //trigger ajillah uyd ugugdluu solihgui haav
                //this.ignoreChange = true;
                if (this.meta.relation.multiple == true) {
                    Vue.set(this.model.form, this.model.component, val.map(vv => vv['value']).join(','));
                } else {
                    if (val['value'] === "" || val['value'] === null) {
                        Vue.set(this.model.form, this.model.component, null);
                    } else if (!isNaN(val['value'])) {
                        Vue.set(this.model.form, this.model.component, val['value'] * 1);
                    } else {
                        Vue.set(this.model.form, this.model.component, val['value']);
                    }
                }
                this.clearAble = true;
            }
        },
    },

    created() {
        if (this.meta.relation.addAble && this.meta.relation.addFrom) {
            this.addAble = true;
        }
    },

    methods: {
        isValid: isValid,
        filterOption(options) {
            if (options) {
                if (this.$props.meta.relation.parentFieldOfForm) {
                    if (this.$props.model.form[this.$props.meta.relation.parentFieldOfForm]) {
                        let filteredOptions = options.filter(option => option.parent_value == this.$props.model.form[this.$props.meta.relation.parentFieldOfForm]);
                        this.initialValue(filteredOptions);
                        return filteredOptions;
                    } else {
                        return options ? options : [];
                    }
                } else {
                    this.initialValue(options);
                    return options ? options : [];
                }
            }
            return [];
        },

        searchChange(val) {
            this.searchval = val;
        },

        initialValue(options) {
            if (!this.ignoreChange) {
                if (this.model.form[this.model.component] != null || this.model.form[this.model.component] != "" || this.model.form[this.model.component] != undefined) {
                    //If multiple
                    if (this.meta.relation.multiple == true && this.model.form[this.model.component] != null) {
                        let selectedData = this.model.form[this.model.component].toString().split(',');
                        let filtered = options.filter(item => selectedData.includes(item.value.toString()));
                        if (filtered.length >= 1)
                            this.value = filtered
                    } else {
                        let filtered = options.filter(item => item.value == this.model.form[this.model.component]);
                        this.value = filtered.length >= 1 ? filtered[0] : null;
                    }
                } else {
                    //trigger ajillah uyd umnuh ugugdluu tseverleh
                    this.value = null;
                }
            }
        },

        addFromUrl() {
            if (window.init.microserviceSettings) {
                let si = window.init.microserviceSettings.findIndex(set => set.project_id == this.meta.relation.addFromMicroservice);

                if (si >= 0) {
                    return window.init.microserviceSettings[si].production_url;
                } else {
                    return ""
                }
            } else {
                return ""
            }
        },

        showAddModal() {
            this.modal_show = true;
            // this.$modal.show(`add-modal-${this.model.component}`);
        },

        clearState() {
            this.value = null;
            this.clearAble = false;
            Vue.set(this.model.form, this.model.component, null);
        },

        closeModal() {
            this.modal_show = false;
            //  this.$modal.hide(`add-modal-${this.model.component}`);
        },

        //Form functions
        onSuccess(val) {
            let label = this.meta.relation.fields.map(field => val[field]);
            label = label.join(', ');
            let newOption = {
                value: val[this.meta.relation.key],
                label: label
            };

            if (this.meta.relation.parentFieldOfTable !== "" && this.meta.relation.parentFieldOfForm !== "") {
                newOption["parent_value"] = val[this.meta.relation.parentFieldOfTable].toString();
            }

            this.relation_data.push(newOption);
            this.closeModal();
        },

        onError(val) {

        },

        showInfoModal() {
            if (this.model.form[this.model.component]) {
                window.showInformationModal(`${this.meta.info_url}${this.model.form[this.model.component]}`, this.meta.placeHolder);
            } else {
                this.$Message.success(this.lang.dataNotFound);
            }
        }
    }
};
</script>
