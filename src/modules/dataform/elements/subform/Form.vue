<template>
    <div class="subform-grid sub-modal-form" :style="subStyle">
        <div class="subform-header" v-if="!form.min_height && !form.disableCreate">
            {{ form.name }}
            <Button shape="circle" type="success" size="small" @click="add" icon="md-add"
                    class="sub-form-add-btn"></Button>
        </div>
        <div class="sub-form-table-wrap">
            <table class="sub-form-grid" border="1" v-if="form.min_height ? true: this.listData.length >= 1">
                <thead>
                <tr>
                    <th class="row-number" v-if="form.showRowNumber">ДД</th>
                    <th @click="sort(item)" v-for="item in form.schema" v-if="item.label != '' && !item.hidden"
                        :key="item.index">
                        <div class="th-title">
                            {{ item.label }} <i class="ti-exchange-vertical"/></div>
                    </th>
                    <th class="action">...</th>
                </tr>
                </thead>

                <tbody>

                <grid-form v-for="(item, index) in listData"
                           :key="index"
                           :f="item.form"
                           :model="item.model"
                           :editMode="editMode"
                           :relations="relations"
                           :formula="formula"
                           :schema="form.schema"
                >
                    <template slot="action">
                        <a href="javscript:void(0)" @click="()=>edit(index)" class="sub-edit" v-if="!form.disableEdit">
                            <Icon type="md-create"/>
                        </a>
                        <a href="javscript:void(0)" @click="()=>remove(index)" v-if="!form.disableDelete">
                            <Icon type="ios-trash"/>
                        </a>
                    </template>
                    <template slot="rowNumber" v-if="form.showRowNumber">
                        <span>{{ index + 1 }}</span>
                    </template>
                </grid-form>
                </tbody>
                <tfoot v-if="hasEq">
                <tr>
                    <td v-for="(item, index) in equationData" :key="index">
                        <span v-if="item.preStaticWord!=null && item.preStaticWord!=''"> {{
                                item.preStaticWord
                            }} </span>
                        <span v-if="item.hasEquation">{{ item.data.toLocaleString() }}</span>
                        <span v-if="item.prefix!=null && item.prefix!=''"> {{ item.prefix }}</span>
                    </td>
                    <td>
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
        <a class="sub-grid-add" href="javascript:void(0)" @click="add" v-if="form.min_height">
            <Icon type="plus"></Icon>
            {{ lang.save }}
        </a>

        <!--        <paper-modal-->
        <!--            :name="`form-modal-${form.formId}`"-->
        <!--            class="form-modal"-->
        <!--            :min-width="200"-->
        <!--            :min-height="100"-->
        <!--            :pivot-y="0.5"-->
        <!--            :adaptive="true"-->
        <!--            :reset="true"-->
        <!--            :draggable="true"-->
        <!--            :resizable="true"-->
        <!--            draggable=".form-tool"-->
        <!--            width="800"-->
        <!--            height="70%"-->
        <!--        >-->
        <Modal
            :min-width="200"
            :min-height="100"
            :draggable="true"
            :footer-hide="true"
            :title="form.name"
            class="dataform-model-form"
            width="80vw"
            v-model="modal_show"

        >
            <section class="form-modal">
                <div class="form-body">
                    <dataform ref="form" v-if="modal_show" :schemaID="form.formId"
                              :do_render="modal_show"
                              :editMode="editIndex >= 0 ? true : false"
                              :isSubForm="true"
                              :onSuccess="onSuccess"
                              :url="url"
                              :onReady="formReady"
                              :onError="onError"></dataform>
                </div>
            </section>
        </Modal>
        <!--        </paper-modal>-->

        <paper-modal
            :name="`grid-modal-${form.sourceGridID}`"
            class="form-modal"
            :min-width="200"
            :min-height="100"
            :pivot-y="0.5"
            :adaptive="true"
            :reset="true"
            :draggable="true"
            :resizable="true"
            draggable=".form-tool"
            width="85%"
            height="80%"
        >
            <section class="form-modal source-grid">
                <div class="form-tool ">

                    <h4>{{ form.sourceGridModalTitle }}</h4>
                    <div class="form-tool-actions">
                        <a href="javascript:void(0)" @click="closeSourceModal">
                            <i class="ti-close"></i>
                        </a>
                    </div>
                </div>

                <div class="form-body" v-if="modal_grid_show">

                    <div v-if="form.sourceGridTitle && form.sourceGridDescription" class="source-grid-description">
                        <h3>
                            {{ form.sourceGridTitle }}
                        </h3>
                        <p v-html="form.sourceGridDescription">

                        </p>
                    </div>
                    <datagrid
                        :schemaID="form.sourceGridID"
                        :url="sourceGridUrl()"
                        :onRowSelect="onRowSelect"
                        :user_condition="user_condition"
                        :paginate="50"
                        :hasSelection="true"
                        :permissions="{
                          c:false,
                          r:true,
                          u:false,
                          d:false,
                      }"
                    />
                    <div class="add-from-pre-source">
                        <Button shape="circle" type="primary" size="small" @click="addByFrom"
                                :disabled="preSource.length >= 1" icon="md-add"
                                class="sub-form-add-btn">Шинээр бүртгэх
                        </Button>
                        <Button shape="circle" type="success" size="small" @click="addFromPreSource"
                                :disabled="preSource.length == 0" icon="md-add"
                                class="sub-form-add-btn">Сонгох
                        </Button>
                    </div>
                </div>
            </section>
        </paper-modal>
    </div>
</template>

<script>
import {element} from "../index";
import GridForm from "./GridForm";
import subFormMix from "./subFormMix";

const DataForm = () => import(/* webpackChunkName: "Dataform-el" */'../../Dataform');
export default {
    props: ["form", "model", "editMode", "relations", "formula", "url"],
    mixins: [subFormMix],
    components: {
        "grid-form": GridForm,
        "dataform": DataForm
    },
    mounted() {
        this.equationRenderer();
        this.form.schema.forEach(field => {
            field.disabled = true;
        })

    },
    computed: {
        lang() {
            const labels = ['pleaseCompleteFirstLine',];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },

        subStyle() {
            if (this.form.min_height) {
                return {
                    minHeight: this.form.min_height + 'px',
                    background: '#f3f4f5'
                }
            } else {
                return undefined;
            }
        },
        Lang() {
            const labels = ['add',];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
    },
    watch: {
        listData: {
            handler: function (curr, old) {
                if (this.hasEq) {
                    this.equationData.map(eq => {
                        if (eq.hasEquation) {
                            eq.data = -1;
                            let count = 0;
                            switch (eq.equation) {
                                case "SUM": {
                                    eq.data = 0;
                                    curr.map(it => {
                                        eq.data += Number(isNaN(parseInt(it.model[eq.model], 10)) ? 0 : it.model[eq.model]);
                                    });
                                    break;
                                }
                                case "COUNT": {
                                    eq.data = 0;
                                    curr.map(it => {
                                        eq.data += Number(1);
                                    });
                                    break;
                                }
                                case "MIN": {
                                    curr.map(it => {
                                        if (eq.data == -1) {
                                            eq.data = it.model[eq.model];
                                        } else {
                                            eq.data = Math.min(eq.data, it.model[eq.model]);
                                        }
                                    });
                                    break;
                                }
                                case "MAX": {
                                    eq.data = 0;
                                    curr.map(it => {
                                        eq.data = Math.max(eq.data, it.model[eq.model]);
                                    });
                                    break;
                                }
                                case "AVG": {
                                    eq.data = 0;
                                    curr.map(it => {
                                        count++;
                                        eq.data += Number(it.model[eq.model]);
                                    });
                                    eq.data = Number(eq.data / count);
                                    break;
                                }
                            }
                        }
                    });
                }
            },
            deep: true
        }
    },
    data() {
        return {
            listData: [],
            equationData: [],
            currentSortDir: 'asc',
            hasEq: false,
            modal_show: false,
            editIndex: -1,

        };
    },
    methods: {
        showAddModal() {
            this.modal_show = true;
            // this.$modal.show(`form-modal-${this.form.formId}`);
        },
        closeModal() {
            this.modal_show = false;
            this.editIndex = -1;
            // this.$modal.hide(`form-modal-${this.form.formId}`);
        },
        formReady(formData, subSchema) {

            let parentFieldIndex = subSchema.findIndex(field => field.model == this.form.parent);

            if (parentFieldIndex > 0) {
                subSchema[parentFieldIndex].hidden = true;
            }

            if (this.editIndex >= 0) {
                this.$nextTick(() => {
                    this.$refs.form.editModel(this.listData[this.editIndex].model[this.form.identity], {...this.listData[this.editIndex].model});
                });
            }


        },
        onError() {

        },
        onSuccess(data) {

            if (this.editIndex >= 0) {
                Object.keys(data).forEach(itemKey => {
                    if (
                        this.listData[this.editIndex].form.identity == itemKey
                    ) {
                        return;
                    }

                    if (
                        (itemKey == "created_at" || itemKey == "updated_at")
                    ) {
                        return;
                    }

                    Vue.set(this.listData[this.editIndex].model, itemKey, data[itemKey]);

                });

            } else {
                let clonedForm = _.cloneDeep(this.form);
                let clonedFormModel = {};
                Object.keys(data).forEach(key => {
                    let schemaIndex = clonedForm.schema.findIndex(schema => schema.model == 'key')
                    if (schemaIndex >= 0) {
                        if (
                            clonedForm.identity == clonedForm.schema[schemaIndex].model ||
                            clonedForm.schema[schemaIndex].formType == null
                        ) {
                            return;
                        }

                        if (
                            clonedForm.timestamp &&
                            (clonedForm.schema[schemaIndex].model == "created_at" || clonedForm.schema[schemaIndex].model == "updated_at")
                        ) {
                            return;
                        }
                    }

                    Vue.set(clonedFormModel, key, data[key]);
                });

                let listItem = {
                    form: clonedForm,
                    model: clonedFormModel
                };

                let subItems = this.model.form[this.model.component];

                if (subItems == undefined) {
                    subItems = [];
                }
                subItems.push(clonedFormModel);
                Vue.set(this.model.form, this.model.component, subItems);

                this.listData.push(listItem);
            }


            this.closeModal();
        },
        element: element,
        checkAddable() {
            return new Promise((resolve, reject) => {
                let obj = this.listData[this.listData.length - 1];
                if (obj) {
                    let hasValue = false;
                    let lastModel = obj.model;

                    for (let key in lastModel) {
                        if (
                            typeof lastModel[key] != undefined &&
                            lastModel[key] != null &&
                            lastModel[key] != "" &&
                            lastModel[key] != false
                        ) {
                            hasValue = true;
                        }
                    }
                    if (hasValue) {
                        resolve(true)
                    } else {
                        alert(this.lang.pleaseCompleteFirstLine);
                        reject(false);
                    }
                } else {
                    resolve(true);
                }
            });
        },
        addSubForm() {
            let clonedForm = _.cloneDeep(this.form);
            let clonedFormModel = {};
            clonedForm.schema.forEach(item => {
                if (
                    clonedForm.identity == item.model ||
                    item.formType == null
                ) {
                    return;
                }

                if (
                    clonedForm.timestamp &&
                    (item.model == "created_at" || item.model == "updated_at")
                ) {
                    return;
                }

                Vue.set(clonedFormModel, item.model, item.default);
            });

            let listItem = {
                form: clonedForm,
                model: clonedFormModel
            };


            if (this.model.form[this.model.component] == undefined) {
                this.model.form[this.model.component] = [];
            }
            this.model.form[this.model.component].push(clonedFormModel);
            this.listData.push(listItem);
        },
        add() {
            if (this.form.addFromGrid && this.form.sourceGridID) {
                this.showAddSourceModal();
            } else {

                this.addByFrom();
            }
        },
        addByFrom() {
            this.closeSourceModal();
            this.editIndex = -1;
            this.showAddModal()
        },
        fillData() {
            this.listData = [];

            setTimeout(() => {

                this.model.form[this.model.component].forEach(item => {
                    let listItem = {
                        form: _.cloneDeep(this.form),
                        model: item
                    };
                    this.listData.push(listItem);
                });

                // console.log(this.model.form[this.model.component]);

            }, 100);
        },
        equationRenderer() {
            this.equationData = [];
            this.form.schema.map(item => {
                if (item.label != '' && !item.hidden) {
                    if (item.hasEquation) this.hasEq = true;
                    this.equationData.push({
                        hasEquation: item.hasEquation,
                        equation: item.equations,
                        prefix: item.prefix,
                        model: item.model,
                        preStaticWord: item.preStaticWord,
                        data: 0
                    });
                }
            });
        },
        edit(index) {
            this.model.form[this.form.model][index];

            this.editIndex = index;
            this.showAddModal();

        },
        remove(index) {
            this.model.form[this.form.model].splice(index, 1);
            this.listData.splice(index, 1);
        },

        reset() {
            this.model.form[this.form.model] = [];
            this.listData = [];
        },

        sort(item) {
            let sortStatus = 1;
            this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
            this.currentSort = this.currentSortDir === 'desc' ? -1 : 1;
            this.currentSort = item.model;
            this.listData.sort((a, b) => {
                if (this.currentSortDir === 'desc') sortStatus = -1;
                if (a.model[this.currentSort] < b.model[this.currentSort]) return -1 * sortStatus;
                if (a.model[this.currentSort] > b.model[this.currentSort]) return 1 * sortStatus;
                return 0;
            });
        }
    }
};
</script>
