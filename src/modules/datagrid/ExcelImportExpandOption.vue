<template>
    <div class="expand">
        <Tabs :animated="false" size="small" class="expand-tab">
            <TabPane :label="lang.data_settings">
                <Row type="flex" v-if="item.hasOwnProperty('excelImportRelationTemp') && item.excelImportRelationTemp.hasOwnProperty('table')">
                    <Col :xs="24" :sm="24" :md="12" :lg="12" class="rel-col">
                        <div class="title">
                            <h3>{{lang.dataLink}} </h3>
                        </div>
                        <ul>
                            <li>
                                <label>{{lang.table}}</label>
                                <Select v-model="item.excelImportRelation.table" :placeholder="lang.selectTable" clearable filterable
                                        @on-change="relationSchema">
                                    <OptionGroup :label="lang.tableList">
                                        <Option v-for="item in tableList" :value="item" :key="item.index">{{ item }}
                                        </Option>
                                    </OptionGroup>
                                    <OptionGroup :label="lang.viewList">
                                        <Option v-for="item in viewList" :value="item" :key="item.index">{{ item }}
                                        </Option>
                                    </OptionGroup>
                                </Select>
                            </li>
                            <li>
                                <label>{{lang.Related_fields}}</label>
                                <Select v-model="item.excelImportRelation.key" :placeholder="lang.Related_fields" clearable filterable>
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                        item.model }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{lang.Visible_fields}}</label>
                                <Select v-model="item.excelImportRelation.fields" :placeholder="lang.Select_fields" clearable
                                        filterable>
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                        item.model }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{ lang.Sort_field }}</label>
                                <Select v-model="item.excelImportRelation.sortField" :placeholder="lang.Select_field" clearable
                                        filterable>
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                        item.model }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label></label>
                                <RadioGroup v-model="item.excelImportRelation.sortOrder">
                                    <Radio label="asc">
                                        <Icon type="arrow-up-c"></Icon>
                                        <span>A-Z</span>
                                    </Radio>
                                    <Radio label="desc">
                                        <Icon type="arrow-down-c"></Icon>
                                        <span>Z-A</span>
                                    </Radio>
                                </RadioGroup>
                            </li>
                        </ul>
                    </Col>
                    <Col :xs="24" :sm="24" :md="12" :lg="8" class="rel-col">
                        <div class="title">
                            <h3>{{lang.Link_terms}} </h3>
                        </div>
                        <query-builder v-if="relSchema && relSchema.length >=1" @change="changeItemFilter"
                                       :query="item.excelImportRelation.filter" :fields="relSchema"></query-builder>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import {elementList} from "./elements";
    import {getTableMeta} from "./utils/helpers";
    export default {
        props: ["item", "edit"],
        computed: {
            // ...mapGetters({
            //     user: "user"
            // }),
            lang(){
                const labels = [ "linkSettings", "insertList", "linkIcon", "showOnlyIcon", "pinColumn", "linkType", "pinPosition", "onLeftonLeft",
                    "onRight", "radioSettings", "additionalSettings", "comparativeValuecomparativeValue", "values", "visible_word",  "icon", "colorCode",
                    "dataLink", "Select_fields", "Select_field", "Related_fields", "tableList", "viewList", "Visible_fields", "Sort_field", "Link_terms",
                    'plseEnterValue', 'data_settings', 'basicSettings'
                ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataGrid.' + labels[i]);
                    return obj;
                }, {});
            },
        },
        data() {
            return {
                expanded: false,
                tableList: window.init.dbSchema.tableList,
                viewList: window.init.dbSchema.viewList,
                elementList: elementList,
                relSchema: [],
                customEl: {
                    form: {
                        compareVal: null,
                        label: null,
                        color: '#666666',
                        icon: null,
                        image: null
                    },
                    rule: {
                        compareVal: [{required: true, message: this.$t('dataGrid.plseEnterValue'), trigger: "blur"}]
                    },
                    columns: [
                        {
                            title: 'Утга',
                            key: "compareVal",
                        },
                        {
                            title: 'Харагдах үг',
                            key: "label",
                        },
                        {
                            title: 'Өнгө',
                            key: "color",
                        },
                        {
                            title: 'Айкон',
                            key: "icon",
                        },
                        {
                            title: 'Зураг',
                            key: "image",
                        },
                        {
                            title: "Устгах",
                            key: "action",
                            width: 100,
                            align: "center",
                            render: (h, params) => {
                                return h("div", [
                                    h(
                                        "Button",
                                        {
                                            props: {
                                                type: "error",
                                                size: "small"
                                            },
                                            on: {
                                                click: () => {
                                                    this.removeOption(params.index);
                                                }
                                            }
                                        },
                                        "Устгах"
                                    )
                                ]);
                            }
                        }
                    ]
                },

                optionForm: {
                    value: null,
                    label: null
                },
                optionRule: {
                    value: [{required: true, message: "Утга оруулна уу", trigger: "blur"}],
                    label: [{required: true, message: "Харагдах үгээ оруулна уу", trigger: "blur"}]
                },
                optionsColumns: [
                    {
                        title: 'Утга',
                        key: "value"
                    },
                    {
                        title: 'Харагдах үг',
                        key: "label"
                    },
                    {
                        title: "Устгах",
                        key: "action",
                        width: 100,
                        align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "error",
                                            size: "small"
                                        },
                                        on: {
                                            click: () => {
                                                this.removeOption(params.index);
                                            }
                                        }
                                    },
                                    "Устгах"
                                )
                            ]);
                        }
                    }
                ],

                linkTargets: ['_blank', '_new', '_self', '_top'],
            };
        },
        created() {
            if (this.item.hasOwnProperty('excelImportRelation') && this.item.excelImportRelation.table !== null) {
                this.relationSchema(this.item.excelImportRelation.table);
            }
        },
        methods: {
            async relationSchema(val) {
              this.relSchema = await getTableMeta(val);
            },

            //Filter event
            changeItemFilter(query) {
                if (query) {
                    this.$props.item.relation.filter = query.sql;
                } else {
                    this.$props.item.relation.filter = undefined;
                }
            },

            addOption() {
                this.$refs["optionFrm"].validate(valid => {
                    if (valid) {
                        this.item.options.push({...this.optionForm});
                        this.optionForm = {value: null, label: null};
                    }
                });
            },

            addCustomEl() {
                this.$refs["customFrm"].validate(valid => {
                    if (valid) {
                        this.item.options.push({...this.customEl.form});
                        this.$refs["customFrm"].resetFields();
                    }
                });
            },

            removeOption(index) {
                this.item.options.splice(index, 1);
            }
        }
    };
</script>


