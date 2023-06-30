<template>
    <div class="expand">

        <Tabs :animated="false" size="small" class="expand-tab">
            <TabPane :label="lang.basicSettings">
                <Row type="flex">
                    <Col :xs="12" class="rel-col">
                        <ul>
                            <li v-if="item.gridType == 'Link'">
                                <label>{{lang.linkSettings}} |
                                    <small>http://google.com/{id}/{model}</small>
                                </label>
                                <Input v-model="item.link" :placeholder="lang.insertList"/>
                            </li>
                            <li v-if="item.gridType == 'Link'">
                                <label>{{lang.linkIcon}}</label>
                                <Input v-model="item.icon" :placeholder="lang.linkIcon"/>
                            </li>
                            <li v-if="item.gridType == 'Link'">
                              <label>{{lang.showOnlyIcon}}</label>
                              <i-switch v-model="item.showOnlyIcon" size="small"></i-switch>
                            </li>
                            <li>
                              <label>{{lang.pinColumn}}</label>
                              <i-switch v-model="item.pinned" size="small"></i-switch>
                            </li>
                            <li v-if="item.gridType == 'Link'">
                                <label>{{lang.linkType}}</label>
                                <Select v-model="item.linkTarget" :placeholder="lang.linkType" :width="250">
                                    <Option v-for="item in linkTargets" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                            </li>

                            <li>
                                <label>{{lang.pinColumn}}</label>
                                <i-switch v-model="item.pinned" size="small"></i-switch>
                            </li>
                            <li v-if="item.pinned">
                                <label>{{lang.pinPosition}}</label>
                                <RadioGroup v-model="item.pinPosition">
                                    <Radio label="left">
                                        <span>{{lang.onLeft}}</span>
                                    </Radio>
                                    <Radio label="right">
                                        <span>{{lang.onRight}}</span>
                                    </Radio>
                                </RadioGroup>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </TabPane>

            <TabPane :label="lang.radioSettings" v-if="item.gridType == 'Radio'">
                <Row type="flex">
                    <Col :xs="24" :sm="24" :md="12" :lg="12">
                        <div class="expand-grid">
                            <Form ref="optionFrm" :model="optionForm" :rules="optionRule" inline>
                                <FormItem prop="value">
                                    <Input type="text" v-model="optionForm.value" :placeholder="lang.values"/>
                                </FormItem>
                                <FormItem prop="label">
                                    <Input type="text" v-model="optionForm.label" :placeholder="lang.visible_word"/>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="addOption">Нэмэх</Button>
                                </FormItem>
                            </Form>

                            <Table border size="small" :columns="optionsColumns"
                                   :data="item.options ? item.options : []"
                                   height="250"></Table>
                        </div>
                    </Col>
                </Row>
            </TabPane>

            <TabPane :label="lang.additionalSettings" v-if="item.gridType == 'Custom'">
                <Row type="flex">
                    <Col :xs="24" :sm="24" :md="24" :lg="24">
                        <div class="expand-grid">
                            <Form ref="customFrm" :model="customEl.form" :rules="customEl.rule" inline>
                                <FormItem prop="value">
                                    <Input type="text" v-model="customEl.form.compareVal"
                                           :placeholder="lang.comparativeValue"/>
                                </FormItem>
                                <FormItem prop="label">
                                    <Input type="text" v-model="customEl.form.label" :placeholder="lang.visible_word"/>
                                </FormItem>
                                <FormItem prop="icon">
                                    <Input type="text" v-model="customEl.form.icon" :placeholder="lang.icon"/>
                                </FormItem>
                                <FormItem prop="color">
                                    <!--<ColorPicker v-model="customEl.form.color"/>-->
                                    <Input type="text" v-model="customEl.form.color" :placeholder="lang.colorCode"/>
                                </FormItem>
                                <FormItem prop="image">
                                    <Input type="text" v-model="customEl.form.image" :placeholder="lang.image"/>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="addCustomEl">{{lang.add}}</Button>
                                </FormItem>
                            </Form>

                            <Table border size="small" :columns="customEl.columns"
                                   :data="item.options ? item.options : []"
                                   height="250"></Table>
                        </div>
                    </Col>
                </Row>
            </TabPane>

            <TabPane :label="lang.data_settings">
                <Row type="flex">

                    <Col :xs="24" :sm="24" :md="12" :lg="12" class="rel-col" >
                        <div class="title">
                            <h3>{{lang.dataLink}} </h3>
                        </div>

                        <ul>
                            <li v-if="item.virtualColumn">
                                <label>Холболтын талбар</label>
                                <Select v-model="item.relation.connection_field" placeholder="Холболтын талбар" clearable filterable>
                                    <Option v-for="field in fieldList" :value="field.model" :key="field.index">{{
                                            field.model }}
                                    </Option>
                                </Select>
                            </li>
                            <li v-if="microservices.length >= 1">
                                <label >Microservice</label>


                                <Select v-model="item.relation.microservice_id" placeholder="Microservice" clearable
                                        filterable
                                >
                                    <Option v-for="microservice in microservices" :value="microservice.microservice_id" :key="microservice.index">
                                        {{ microservice.microservice }}
                                    </Option>
                                </Select>
                                <label>&nbsp;&nbsp;&nbsp;{{ lang.table }}</label>
                                <Select v-model="item.relation.table" :placeholder="lang.selectTable" clearable
                                        filterable
                                        @on-change="relationSchema">
                                    <OptionGroup :label="`${microservice.microservice}: Table list`" v-for="microservice in microservices.filter(ms=>ms.microservice_id === item.relation.microservice_id)"  :key="microservice.index">
                                        <Option v-for="item in microservice.tableList" :value="item" :key="item.index">
                                            {{ item }}
                                        </Option>
                                    </OptionGroup>
                                    <OptionGroup :label="`${microservice.microservice}: View list`" v-for="microservice in microservices.filter(ms=>ms.microservice_id === item.relation.microservice_id)"  :key="microservice.index">
                                        <Option v-for="item in microservice.viewList" :value="item" :key="item.index">
                                            {{ item }}
                                        </Option>
                                    </OptionGroup>
                                </Select>
                            </li>
                            <li v-else>
                                <label>{{lang.table}}</label>
                                <Select v-model="item.relation.table" :placeholder="lang.selectTable" clearable filterable
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
                                <Select v-model="item.relation.key" :placeholder="lang.Related_fields" clearable filterable>
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                        item.model }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{lang.Visible_fields}}</label>
                                <Select v-model="item.relation.fields" :placeholder="lang.Select_fields" clearable
                                        filterable>
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                        item.model }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{ lang.Sort_field }}</label>
                                <Select v-model="item.relation.sortField" :placeholder="lang.Select_field" clearable
                                        filterable>
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                        item.model }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label></label>
                                <RadioGroup v-model="item.relation.sortOrder">
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
                                       :query="item.relation.filter" :fields="relSchema"></query-builder>


                    </Col>
                </Row>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import {elementList} from "./elements";
    import ColorPicker from "./elements/ColorPicker";
    import {getTableMeta} from "./utils/helpers";
    import {getTableView} from "../../utils/index";

    export default {
        components: {ColorPicker},
        props: ["item", "edit", "fieldList"],
        computed: {
            // ...mapGetters({
            //     user: "user"
            // }),
            lang(){
                const labels = [ "linkSettings", "insertList", "linkIcon", "showOnlyIcon", "pinColumn", "linkType", "pinPosition", "onLeftonLeft",
                    "onRight", "radioSettings", "additionalSettings", "comparativeValuecomparativeValue", "values", "visible_word",  "icon", "colorCode",
                    "dataLink", "Select_fields", "Select_field", "Related_fields", "tableList", "viewList", "Visible_fields", "Sort_field", "Link_terms",
                    'plseEnterValue', 'data_settings', 'basicSettings', 'table'
                ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataGrid.' + labels[i]);
                    return obj;
                }, {});
            },
            // tableList(){
            //     return getTableView("table")
            // },
            // viewList(){
            //     return getTableView("view")
            // }
        },
        data() {
            return {
                expanded: false,
                tableList: window.init.dbSchema.tableList,
                microservices: window.init.microservices ? window.init.microservices : [],
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
            if (this.item.relation.table !== null) {
                this.relationSchema(this.item.relation.table);
            }
        },
        methods: {
            async relationSchema(val) {
                if(window.init.projectSettings){
                    if(window.init.projectSettings.project_id === this.item.relation.microservice_id){
                        this.item.relation.self = true;
                    } else {
                        this.item.relation.self = false;
                    }
                } else {
                    this.item.relation.self = true;
                }

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


