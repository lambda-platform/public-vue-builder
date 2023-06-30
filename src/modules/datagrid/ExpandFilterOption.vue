<template>
    <div class="expand">
        <Tabs :animated="false" size="small" class="expand-tab">
            <TabPane :label="lang.basicSettings">
                <Row type="flex">
                    <Col span="24" class="rel-col">
                        <ul>
                            <li>
                                <label>{{ lang.default_Value }}</label>
                                <Input type="text" :placeholder="lang.default_Value" v-model="item.filter.default"/>
                            </li>
                            <li>
                                <label>{{ lang.Get_value_parameter }}</label>
                                <Input type="text" :placeholder="lang.Parameter_name" v-model="item.filter.param"/>
                            </li>
                            <li>
                                <label>{{ lang.parameterComparison }}</label>
                                <Select v-model="item.filter.paramCompareType" :placeholder="lang.methodOfComparison"
                                        clearable
                                        filterable>
                                    <Option v-for="item in paramComparisons" :value="item" :key="item">{{ item }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{ lang.whetherLookSidebarSearch }}</label>
                                <i-switch v-model="item.filter.showSideFilter" size="small"></i-switch>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </TabPane>

            <TabPane :label="lang.data_settings"
                     v-if="item.filter.type == 'Select' || item.filter.type == 'RadioButtonFilter'">
                <Row type="flex">
                    <Col span="24" class="rel-col">
                        <div class="title">
                            <h3>{{ lang.dataLink }} </h3>
                        </div>
                        <ul>

                            <li v-if="microservices.length >= 1">
                                <label>Microservice</label>

                                <Select v-model="item.filter.relation.microservice_id" placeholder="Microservice"
                                        clearable
                                        filterable
                                >
                                    <Option v-for="microservice in microservices" :value="microservice.microservice_id"
                                            :key="microservice.index">
                                        {{ microservice.microservice }}
                                    </Option>
                                </Select>

                            </li>
                            <li v-if="microservices.length >= 1">
                                <label>{{ lang.selectTable }}</label>
                                <Select v-model="item.filter.relation.table" :placeholder="lang.selectTable" clearable
                                        filterable
                                        @on-change="relationSchema">
                                    <OptionGroup :label="`${microservice.microservice}: Table list`"
                                                 v-for="microservice in microservices.filter(ms=>ms.microservice_id === item.filter.relation.microservice_id)"
                                                 :key="microservice.index">
                                        <Option v-for="item in microservice.tableList" :value="item" :key="item.index">
                                            {{ item }}
                                        </Option>
                                    </OptionGroup>
                                    <OptionGroup :label="`${microservice.microservice}: View list`"
                                                 v-for="microservice in microservices.filter(ms=>ms.microservice_id === item.filter.relation.microservice_id)"
                                                 :key="microservice.index">
                                        <Option v-for="item in microservice.viewList" :value="item" :key="item.index">
                                            {{ item }}
                                        </Option>
                                    </OptionGroup>
                                </Select>
                            </li>
                            <li v-else>
                                <label>{{ lang.selectTable }}</label>
                                <Select v-model="item.filter.relation.table" :placeholder="lang.selectTable" clearable
                                        filterable
                                        @on-change="relationSchema">
                                    <OptionGroup label="Table list">
                                        <Option v-for="item in tableList" :value="item" :key="item.index">
                                            {{ item }}
                                        </Option>
                                    </OptionGroup>
                                    <OptionGroup label="View list">
                                        <Option v-for="item in viewList" :value="item" :key="item.index">
                                            {{ item }}
                                        </Option>
                                    </OptionGroup>
                                </Select>
                            </li>

                            <!--                            <li>-->
                            <!--                                <label>{{lang.table}}</label>-->
                            <!--                                <Select v-model="item.filter.relation.table" :placeholder="lang.selectTable" clearable-->
                            <!--                                        filterable-->
                            <!--                                         @on-change="relationSchema">-->
                            <!--                                    <OptionGroup :label="lang.tableList">-->
                            <!--                                        <Option v-for="item in tableList" :value="item" :key="item.index">{{ item }}-->
                            <!--                                        </Option>-->
                            <!--                                    </OptionGroup>-->
                            <!--                                    <OptionGroup label="View list">-->
                            <!--                                        <Option v-for="item in viewList" :value="item" :key="item.index">{{ item }}-->
                            <!--                                        </Option>-->
                            <!--                                    </OptionGroup>-->
                            <!--                                </Select>-->
                            <!--                            </li>-->
                            <li>
                                <label>{{ lang.Related_fields }}</label>
                                <Select v-model="item.filter.relation.key" :placeholder="lang.Related_fields" clearable
                                        filterable>
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                            item.model
                                        }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{ lang.Visible_fields }}</label>
                                <Select v-model="item.filter.relation.fields" :placeholder="lang.Select_fields"
                                        clearable
                                        filterable multiple>
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                            item.model
                                        }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{ lang.Sort_field }}</label>
                                <Select v-model="item.filter.relation.sortField" :placeholder="lang.Select_field"
                                        clearable
                                        filterable>
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                            item.model
                                        }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label></label>
                                <RadioGroup v-model="item.filter.relation.sortOrder">
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
                            <li>
                                <label>{{ lang.Father_column }} ( {{ lang.inSearch }} )</label>
                                <Select v-model="item.filter.relation.parentFieldOfForm"
                                        :placeholder="lang.Father_column"
                                        clearable filterable>
                                    <Option v-for="it in schema" :value="it.model" :key="it.index">{{
                                            it.model
                                        }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{ lang.Father_column }} ( {{ lang.this_table }} )</label>
                                <Select v-model="item.filter.relation.parentFieldOfTable"
                                        :placeholder="lang.Father_column"
                                        clearable
                                        filterable>
                                    <Option v-for="it in relSchema" :value="it.model" :key="it.index">{{
                                            it.model
                                        }}
                                    </Option>
                                </Select>
                            </li>
                        </ul>

                        <div class="title">
                            <h3>{{ lang.Link_terms }}</h3>
                        </div>

                        <query-builder v-if="relSchema && relSchema.length >=1" @change="changeItemFilter"
                                       :query="item.filter.relation.filter" :fields="relSchema"></query-builder>


                        <div style="height: 400px">
                            <div class="title">
                                <h3>{{ lang.Link_terms }} ({{ lang.Get_customer }})</h3>
                            </div>
                            <div>
                                <Row>
                                    <Col span="10">
                                        <Select v-model="optionSelectFilterWithUser.userField" filterable
                                                :placeholder="lang.custom_column">
                                            <Option v-for="item in user_fields" :value="item" :key="item">{{
                                                    item
                                                }}
                                            </Option>
                                        </Select>
                                    </Col>
                                    <Col span="10">
                                        <Select v-model="optionSelectFilterWithUser.tableField" filterable
                                                :placeholder="lang.judgment_column">
                                            <Option v-for="item in relSchema" :value="item.model" :key="item.model">
                                                {{ item.model }}
                                            </Option>
                                        </Select>
                                    </Col>
                                    <Col span="4">
                                        <Button type="primary" shape="circle" icon="md-add"
                                                @click="addSelectUserFilter"></Button>
                                    </Col>
                                </Row>

                                <Row v-for="(condition, index) in item.filter.relation.filterWithUser" :key="index">
                                    <Col span="10">
                                        {{ condition.userField }}
                                    </Col>
                                    <Col span="10">
                                        {{ condition.tableField }}
                                    </Col>
                                    <Col span="4">
                                        <Button type="primary" shape="circle" icon="ios-trash"
                                                @click="deleteSelectUserFilter(index)"></Button>
                                    </Col>
                                </Row>

                            </div>
                        </div>
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
    props: ["item", "schema", "edit"],
    computed: {
        // ...mapGetters({
        //     user: "user"
        // }),
        lang() {
            const labels = ['default_Value', 'Parameter_name', 'Get_value_parameter', 'parameterComparison', 'methodOfComparison', 'whetherLookSidebarSearch',
                'dataLink', 'data_settings', 'basicSettings', 'selectTable', 'tableList', 'Select_fields', 'Select_field', 'Related_fields', 'Visible_fields',
                'Sort_field', 'Link_terms', 'Father_column', 'inSearch', 'this_table', 'custom_column', 'judgment_column', '', '', '', '', '', '',
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
            microservices: window.init.microservices ? window.init.microservices : [],
            elementList: elementList,
            relSchema: [],
            paramComparisons: [
                "equals",
                "notEqual",
                "contains",
                "notContains",
                "startsWith",
                "endsWith",
                "greaterThan",
                "greaterThanOrEqual",
                "lessThan",
                "lessThanOrEqual",
                "lessThanOrEqual",
                "inRange",
            ],
            optionSelectFilterWithUser: {
                userField: null,
                tableField: null,
            },
            user_fields: window.init.user_fields,
        };
    },
    created() {
        if (this.item.filter.relation.table !== null) {
            this.relationSchema(this.item.filter.relation.table);
        }
    },
    methods: {
        async relationSchema(val) {
            this.relSchema = await getTableMeta(val)
        },

        //Filter event
        changeItemFilter(query) {
            if (query) {
                this.$props.item.filter.relation.filter = query.sql;
            } else {
                this.$props.item.filter.relation.filter = undefined;
            }
        },

        addSelectUserFilter() {
            console.log('here');

            if (!this.$props.item.filter.relation.filterWithUser) {
                this.$props.item.filter.relation.filterWithUser = [];
            }
            this.$props.item.filter.relation.filterWithUser.push({
                userField: this.optionSelectFilterWithUser.userField,
                tableField: this.optionSelectFilterWithUser.tableField,
            });

            this.optionSelectFilterWithUser = {
                userField: null,
                tableField: null,
            };
        },

        deleteSelectUserFilter(index) {
            this.$props.item.filter.relation.filterWithUser.splice(index, 1);
        },
    }
};
</script>


