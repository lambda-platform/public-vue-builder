<template>
    <div class="table-list ve-column">
        <div class="tables">


            <label>{{ lang.data_table }}</label>

            <multiselect

                v-model='table_'
                :placeholder='lang.selectTable'
                :options="[{type:'table',list:tableList}, {type:'view',list:viewList}]"
                @select="selectTable"
                group-values="list" group-label="type" :group-select="true"
            ></multiselect>
            <div class="source-fields">
                <draggable v-model="fields" :options="{group:{name:'element', pull:'clone', put:false}, sort: false }">
                    <Button v-for="(field, index_) in fields" :key="index_" class="data-element" @click="selected_field = field">
                        {{field.name}}

                        <span class="groupBy" v-if="field.groupBy">{{ lang.groupBy }}</span>
                        <span class="aggregation" v-if="field.aggregate != 'none'">{{field.aggregate}}</span>
                    </Button>
                </draggable>
            </div>
            <br>
            <table v-if="selected_field.name" class="column-options">
                <tr>
                    <td>
                        {{ lang.aggregation }}:
                    </td>
                    <td>
                       <div class="selector">
                           <Select v-model="selected_field.aggregate" size="small" style="width:100px">
                               <Option value="none">{{lang.no}}</Option>
                               <Option value="count">{{lang.count}}</Option>
                               <Option value="max">{{lang._max}}</Option>
                               <Option value="min">{{lang._min}}</Option>
                               <Option value="avg">{{lang._avg}}</Option>
                               <Option value="sum">{{lang._sum}}</Option>
                               <Option value="countDistinct">{{lang.count_distinct}}</Option>
                               <Option value="avgDistinct">{{lang.avg_distinct}}</Option>
                               <Option value="sumDistinct">{{lang.sum_distinct}}</Option>

                           </Select>
                       </div>

                    </td>
                </tr>
                <tr>
                    <td>
                        {{lang._sort}}:
                    </td>
                    <td>
                       <div class="selector">
                           <Select v-model="selected_field.sortType" size="small" style="width:100px">
                               <Option value="none">{{ lang.no_sort }}</Option>
                               <Option value="ASC">A-Z</Option>
                               <Option value="DESC">Z-A</Option>
                           </Select>
                       </div>
                    </td>
                </tr>
                <!-- <tr>
                                            <td colspan="2">
                                                <Checkbox
                                                    v-model="selected_field.output"
                                                    size="small"
                                                >Хэрэглэх</Checkbox>

                                            </td>

                                        </tr> -->
                <tr>
                    <td colspan="2">
                        <Checkbox v-model="selected_field.groupBy" size="small">{{ lang.grouping }}</Checkbox>

                    </td>

                </tr>
                <!-- <tr>
                                            <td>
                                                Нэр:
                                            </td>
                                            <td>
                                                <Input
                                                    v-model="selected_field.name"
                                                    disabled
                                                    size="small"
                                                    class="table-col-search"
                                                ></Input>
                                            </td>
                                        </tr> -->
                <tr>
                    <td>
                        {{ lang._type }}:
                    </td>
                    <td>
                        <Input v-model="selected_field.type" disabled size="small" class="table-col-search"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        {{ lang.fictitious_name }}:
                    </td>
                    <td>
                        <Input disabled v-model="selected_field.alias" placeholder="" size="small" class="table-col-search"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        {{ lang._color }}:
                    </td>
                    <td>
                        <Input v-model="selected_field.color"  placeholder="" size="small" class="table-col-search"/>

                    </td>
                </tr>

                <tr>
                    <td>
                        {{lang._sort}} #:
                    </td>
                    <td>
                        <InputNumber :min="1" :disabled="selected_field.sortType == 'none'" v-model="selected_field.sortOrder" type="number" size="small" class="table-col-search"></InputNumber>
                    </td>
                </tr>
                <tr>
                    <td>
                        {{ lang.grouping }} #:
                    </td>
                    <td>
                        <InputNumber :min="1" :disabled="!selected_field.groupBy" v-model="selected_field.groupOrder" type="number" size="small" class="table-col-search"></InputNumber>
                    </td>
                </tr>

            </table>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import axios from "axios";
import { mapGetters } from "vuex";
import {getTableView} from "../../../utils/index";

export default {
    methods: {
        isShowAble(table, field, isTable) {
            if (isTable) {
                let index = table.table.indexOf(this.search);
                if (index >= 0) {
                    return true;
                } else {
                    return false;
                }
            }
        },

        selectTable(table) {
            this.$store.commit("setTable", table);

          if(window.init.dbSchema.tableMeta){
            if(window.init.dbSchema.tableMeta[table]){
              this.selectTableReal(window.init.dbSchema.tableMeta[table], table)
            } else {
              axios.get(`/lambda/puzzle/table-schema/${table}`).then(res=>{
                this.selectTableReal(res.data, table)
              })
            }
          } else {
            axios.get(`/lambda/puzzle/table-schema/${table}`).then(res=>{
              this.selectTableReal(res.data, table)
            })
          }


        },
      selectTableReal(schemaData, table){

          let fields = schemaData.map(field => {
            return {
              name: field.model,
              title: field.model,
              type: field.dbType,
              table: field.table,
              alias: table + "_as_" + field.model,
              output: true,
              sortType: "none",
              sortOrder: 1,
              groupBy: false,
              groupOrder: 1,
              aggregate: "none"
            };
          });
          this.$store.commit("setFields", fields);

      }
    },
    data() {
        return {
            tableMeta:window.init.dbSchema.tableMeta,
            table_: "",
            selected_field: {}
        };
    },
    mounted() {
        if(this.table){
            this.table_ = this.table;
        }

    },
    components: {
        draggable
    },
    computed: {
        tableList() {
            return getTableView("table")
        },
        viewList() {
            return getTableView("view")
        },
        ...mapGetters({
            table: "table",
            fields: "fields"
        }),
        lang() {
            const labels = [
                'data_table',
                'selectTable',
                'groupBy',
                'aggregation',
                'no',
                'count',
                '_max',
                '_min',
                '_avg',
                '_sum',
                'count_distinct',
                'avg_distinct',
                'sum_distinct',
                '_sort',
                'no_sort',
                'grouping',
                '_type',
                'fictitious_name',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('chart.' + labels[i]);
                return obj;
            }, {});
        },
    },
    watch: {
        table: function(val) {

            this.table_ = val;
        }
    }
};
</script>
