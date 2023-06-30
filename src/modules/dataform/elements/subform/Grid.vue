<template>
    <div class="subform-grid" :style="subStyle">
        <h3 style="display: none">{{ rowLength }}</h3>
        <div class="subform-header" v-if="!form.min_height && !form.disableCreate">
            {{ form.name }}
            <Button shape="circle" type="success" size="small" @click="add" icon="md-add"
                    class="sub-form-add-btn"></Button>
        </div>
        <div class="sub-form-table-wrap">
            <table border="1">
                <thead>
                <tr>
                    <th class="row-number" v-if="form.showRowNumber">ДД</th>
                    <th @click="sort(item)" v-for="item in form.schema" v-if="item.label != '' && !item.hidden"
                        :key="item.index">
                        <div class="th-title">
                            {{ item.label }}<i class="ti-exchange-vertical"/></div>
                    </th>
                    <th class="action" v-if="!form.disableDelete">...</th>
                </tr>
                </thead>
                <tbody>
                <grid-form v-for="(item, index) in listData"
                           :key="index"
                           :f="item.form"
                           :model="item.model"
                           :editMode="editMode"
                           :relations="relations"
                           :schema="form.schema"
                           :formula="formula">
                    <template slot="action" v-if="!form.disableDelete">
                        <a href="javascript:void(0);" @click="remove(index)">
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
                        <span
                            v-if="item.preStaticWord!=null && item.preStaticWord!=''"> {{ item.preStaticWord }} </span>
                        <span v-if="item.hasEquation">{{ item.data.toLocaleString() }}</span>
                        <span v-if="item.prefix!=null && item.prefix!=''"> {{ item.prefix }}</span>
                    </td>
                    <td>
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
        <a class="sub-grid-add" href="javascript:void(0)" @click="add" v-if="form.min_height && !form.disableCreate">
            <i class="ti-plus"></i>
            {{ lang.add }}
        </a>

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
            height="50%"
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
                        :paginate="50"
                        :hasSelection="true"
                        :user_condition="user_condition"
                        :custom_condition="custom_condition"
                        :permissions="{
                          c:false,
                          r:true,
                          u:false,
                          d:false,
                      }"
                    />
                    <div class="add-from-pre-source">
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

export default {
    props: ["form", "model", "editMode", "relations", "formula"],
    mixins: [subFormMix],
    components: {
        "grid-form": GridForm
    },
    mounted() {
        this.equationRenderer();
    },
    computed: {
        lang() {
            const labels = ['pleaseCompleteFirstLine',
            ];
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
                return {
                    minHeight: '30px',
                    background: '#f3f4f5'
                }
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
            rowLength: 0,
        };
    },
    methods: {

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
            this.rowLength = this.model.form[this.model.component].length;
        },

        add() {

            if (this.form.addFromGrid && this.form.sourceGridID) {
                this.showAddSourceModal();
            } else {
                this.checkAddable()
                    .then(o => {
                        setTimeout(() => {
                            this.addSubForm();
                        }, 200);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }

        },

        fillData() {
            this.listData = [];
            setTimeout(() => {
                this.listData = [];
                this.model.form[this.model.component].forEach(item => {
                    let listItem = {
                        form: _.cloneDeep(this.form),
                        model: item
                    };
                    this.listData.push(listItem);
                });
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

        remove(index) {
            this.model.form[this.form.model].splice(index, 1);
            this.listData.splice(index, 1);
            this.rowLength = this.model.form[this.model.component].length;
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
        },
    }
};
</script>
