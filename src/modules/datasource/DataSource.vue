<template>
    <div class="data-source">

        <div class="data-source-sidebar">
            <div class="data-source-header">
                <h3>
                    <Button
                            shape="circle"
                            size="small"
                            icon="md-arrow-back"
                    ></Button>
                    {{lang.dataProcessing}}
                </h3>
            </div>

            <div class="data-source-sidebar-wrapper">
                <div class="field-editor">
                    <h5
                            class="ve-title"
                            style="font-size: 12px"
                    >{{lang.characteristics}}</h5>
                    <Tabs
                            :value="properties"
                            @on-click="changeTab"
                    >
                        <TabPane :label="lang.basic" name="main" >
                            <div>
                                <Input
                                        v-model="viewName"
                                        :placeholder="lang.name +'...'"
                                        size="small"
                                        class="table-col-search"
                                ></Input>

                                <br>
                                <br>
                                <Input
                                        v-model="extraQuery"
                                        :placeholder="lang.additional+' query'"
                                        size="small"
                                        class="table-col-search"
                                ></Input>
                                <br>
                                <br>

                                <Checkbox
                                        v-model="withFilter"
                                        @on-change="doFilter"
                                >
                                    <Icon type="search"></Icon>
                                    <span>
                                            {{lang.filter}}
                                        </span>
                                </Checkbox>
                                <br>

                                <!--<button @click="exportSQL">-->
                                <!--get SQL-->
                                <!--</button>-->
                                <div id="builder"></div>

                            </div>
                        </TabPane>
                        <TabPane :label="lang.column" name="field" >
                            <div>
                                <table>
                                    <tr>
                                        <td>
                                            {{lang.aggregation}}:
                                        </td>
                                        <td>
                                            <Select
                                                    v-model="field.aggregate"
                                                    size="small"
                                                    style="width:100px"
                                            >
                                                <Option value="none">{{lang.no}}</Option>
                                                <Option value="count">Count</Option>
                                                <Option value="max">Max</Option>
                                                <Option value="min">Min</Option>
                                                <Option value="avg">Avg</Option>
                                                <Option value="sum">Sum</Option>
                                                <Option value="countDistinct">CountDistinct</Option>
                                                <Option value="avgDistinct">AvgDistinct</Option>
                                                <Option value="sumDistinct">SumDistinct</Option>

                                            </Select>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{lang.sort}}:
                                        </td>
                                        <td>
                                            <Select
                                                    v-model="field.sortType"
                                                    size="small"
                                                    style="width:100px"
                                            >
                                                <Option value="none">{{lang.noSort}}</Option>
                                                <Option value="ASC">A-Z</Option>
                                                <Option value="DESC">Z-A</Option>
                                            </Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <Checkbox
                                                    v-model="field.output"
                                                    size="small"
                                            >{{lang.use}}
                                            </Checkbox>

                                        </td>

                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <Checkbox
                                                    v-model="field.groupBy"
                                                    size="small"
                                            >{{lang.grouping}}
                                            </Checkbox>

                                        </td>

                                    </tr>
                                    <tr>
                                        <td>
                                            {{lang.name}}:
                                        </td>
                                        <td>
                                            <Input
                                                    v-model="field.name"
                                                    disabled
                                                    size="small"
                                                    class="table-col-search"
                                            ></Input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{lang.type}}:
                                        </td>
                                        <td>
                                            <Input
                                                    v-model="field.dbType"
                                                    disabled
                                                    size="small"
                                                    class="table-col-search"
                                            ></Input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{lang.alias}}:
                                        </td>
                                        <td>
                                            <Input
                                                    :disabled="!field.output"
                                                    v-model="field.alias_db"
                                                    placeholder=""
                                                    size="small"
                                                    class="table-col-search"
                                            ></Input>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {{lang.sort}} #:
                                        </td>
                                        <td>
                                            <InputNumber
                                                    :min="1"
                                                    :disabled="field.sortType == 'none'"
                                                    v-model="field.sortOrder"
                                                    type="number"
                                                    size="small"
                                                    class="table-col-search"
                                            ></InputNumber>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td> {{lang.grouping}} #: </td>
                                        <td>
                                            <InputNumber
                                                    :min="1"
                                                    :disabled="!field.groupBy"
                                                    v-model="field.groupOrder"
                                                    type="number"
                                                    size="small"
                                                    class="table-col-search"
                                            ></InputNumber>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </TabPane>

                    </Tabs>

                </div>

                <div class="table-selector">
                    <h5
                            class="ve-title"
                            style="font-size: 12px"
                    > {{lang.bolomjitTableAndView}}</h5>
                    <br>
                    <h5>{{lang.tableList}}

                    </h5>
                    <Button
                            icon="ios-list"
                            class="data-source-table"
                            type="ghost"
                            long
                            :key="st_index"
                            v-for="(source_table, st_index) in tableList"
                            @click="addTable(source_table)"
                    >
                        {{source_table}}
                    </Button>
                    <h5>{{lang.viewList}}</h5>
                    <Button
                            icon="ios-list-box"
                            class="data-source-table"
                            type="ghost"
                            long
                            :key="st_index"
                            v-for="(source_table, st_index) in viewList"
                            @click="addTable(source_table)"
                    >
                        {{source_table}}
                    </Button>
                </div>
            </div>

        </div>
        <div class="data-source-workspace">
            <div class="data-source-header">

                <div class="data-source-header-buttons">
                    <Button icon="ios-eye" >{{lang.data}} </Button>
                    <!--<Button-->
                            <!--icon="ios-eye"-->
                            <!--@click="previewQuery"-->
                    <!--&gt;Query-->
                    <!--</Button>-->
                    <Button type="success" @click="saveSchema" >{{lang.save}} </Button>
                </div>

            </div>

            <div
                    class="data-source-wrapper"
                    id="data-source-editor"
            >
                <diagram
                        @selectField="selectField"
                        @changeChecked="changeChecked"
                        :model="model"
                        v-if="editorH >= 1 && editorW >= 1"
                        :width="editorW"
                        :height="editorH"
                        :selectedNodeIndex="selectedNodeIndex"
                        :selectedFieldIndex="selectedFieldIndex"
                ></diagram>
                <!--<div class="preview">-->
                    <!--<pre style="max-width: 100%;">-->
    <!--{{sql_query}}-->
                <!--</pre>-->
                </div>
            </div>

    </div>
</template>

<script>
    import {
        Diagram
    } from "./diagram/index";
    import axios from "axios";
    import {
        getFields,
        getQuery
    } from "./utils/queryGenerator";
    import * as sqlFormatter from "sql-formatter";

    window.jQuery = require("jquery");
    require("dot");
    require("jQuery-QueryBuilder");
    require("./utils/queryBuilder.i18.mn.js");
    import {getTableView} from "../../utils";

    export default {
        props: ["onCreate", "onUpdate", "src", "editMode", "projectID"],
        created() {
            this.init();
        },
        methods: {
            saveSchema() {

                let schema = {
                    _model: this.model._model,
                    extraQuery: this.extraQuery,
                    withFilter: this.withFilter,
                    filters: this.exportSQL(),
                    query: this.getQueryPre()
                };

                let data = {
                    name: this.viewName,
                    schema: JSON.stringify(schema)
                };
                let defualtURL = `/lambda/puzzle/schema/datasource`;
                if(this.projectID){
                    defualtURL = `/lambda/puzzle/project/${this.projectID}/datasource`
                }
                let submitUrl = this.$props.editMode ?
                    this.$props.src :
                    defualtURL;



                axios.post(submitUrl, data).then(o => {
                    if (o.data.status) {
                        this.$Message.info("Амжилттай хадгаллаа");
                        this.$props.onCreate();
                    } else {
                        let error = "";
                        if(o.data.error){
                            error = o.data.error
                        }
                        this.$Notice.error({
                            title:"Хадгалах үед алдаа гарлаа!",
                            desc:error +"\n"+this.getQueryPre()
                        });
                    }
                });
            },
            init() {
                if (this.$props.editMode == true) {
                    axios
                        .get(this.$props.src)
                        .then(o => {
                            this.viewName = o.data.data.name;

                            var schema = JSON.parse(o.data.data.schema);


                            if(schema.extraQuery){
                                this.extraQuery = schema.extraQuery
                            }
                            if(schema.withFilter){
                                this.withFilter = schema.withFilter
                            }

                            if(schema.filters){
                                this.filters = schema.filters;


                            }

                           // this.extraQuery
                            this.model._model = schema._model;

                            this.doFilter(true)
                        })
                        .catch(o => {

                        });
                }
            },

            getFilterType(type) {


                if (type.indexOf("int") >= 0) {
                    return "integer";
                }
                if (type.indexOf("float") >= 0 || type.indexOf("doable") >= 0) {
                    return "double";
                }
                if (type.indexOf("date") >= 0) {
                    return "date";
                }
                if (type.indexOf("datetime") >= 0) {
                    return "datetime";
                }
                if (type.indexOf("time") >= 0) {
                    return "time";
                }
                return "string";
            },
            changeChecked(nodeIndex, portIndex) {

                if(nodeIndex >= 0){
                    let uncheck_index = this.model._model.nodes[nodeIndex].ports.findIndex(port=>port.field.output === false);

                    this.model._model.nodes[nodeIndex].all_checked = true;
                    if(uncheck_index >= 0)
                        this.model._model.nodes[nodeIndex].all_checked = false;
                    else
                        this.model._model.nodes[nodeIndex].all_checked = true;




                }


                this.doFilter(true);
            },
            doFilter(ignoreError) {
                if (this.withFilter) {
                    let fields = getFields(this.model._model);

                    let filters = fields.map(field => {

                        return {
                            id: field.table+"."+field.name,
                            label: field.table+"."+field.name,
                            type: this.getFilterType(field.dbType)
                        };
                    });




                    if (fields.length >= 1) {
                        jQuery("#builder").queryBuilder("destroy");
                        jQuery("#builder").queryBuilder({
                            filters: filters,
                            icons: {
                                add_rule: "ivu-icon ivu-icon-plus",
                                add_group: "ivu-icon ivu-icon-plus-circled",
                                remove_group: "ivu-icon ivu-icon-trash-b",
                                remove_rule: "ivu-icon ivu-icon-trash-b",
                                error: "ivu-icon ivu-icon-trash-b"
                            }
                        });

                        if (this.filters !== null) {
                            let rules = jQuery("#builder").queryBuilder(
                                "getRulesFromSQL",
                                this.filters
                            );
                            if (rules != null) {
                                jQuery("#builder").queryBuilder("setRules", rules);
                            }
                        }

                    } else {
                        if (!ignoreError)
                            this.$Message.warning(
                                "Хүснэгтээс, багана байхгүй байна"
                            );

                        jQuery("#builder").queryBuilder("destroy");
                    }



                } else {
                    jQuery("#builder").queryBuilder("destroy");
                }
            },
            exportSQL() {
                if (this.withFilter) {
                    return jQuery("#builder").queryBuilder("getSQL", false);
                } else {
                    return null;
                }
            },
            changeTab(name) {
                this.properties = name;
            },
            queryUpdated(query) {
                this.query = query;
            },
            selectField(nodeIndex, fieldIndex, field) {
                this.selectedNodeIndex = nodeIndex;
                this.selectedFieldIndex = fieldIndex;
                this.field = field;
                this.properties = "field";
            },

            async getTableMeta(table){
              if(window.init.dbSchema.tableMeta) {
                if (window.init.dbSchema.tableMeta[table]) {
                 return window.init.dbSchema.tableMeta[table]
                } else {
                   let res = await axios.get(`/lambda/puzzle/table-schema/${table}`)

                  return  res.data
                }
              } else {
                let res = await axios.get(`/lambda/puzzle/table-schema/${table}`)

                return  res.data
              }
            },
            async addTable(table, index) {
                // axios.get("/lambda/vb/dbschema/" + table).then(response => {
                    let tableMeta = await this.getTableMeta(table);
                    let fields = tableMeta.map(field => {
                        return {
                            name: field.model,
                            dbType: field.dbType,
                            alias: table + "_as_" + field.model,
                            alias_db: field.model,
                            output: false,
                            sortType: "none",
                            sortOrder: 1,
                            groupBy: false,
                            groupOrder: 1,
                            aggregate: "none",
                            color: null,
                            table: table
                        };
                    });

                    let x = index ?
                        index * 250 :
                        this.model._model.nodes.length * 240;
                    const new_table = this.model.addNode(
                        table,
                        x + 20,
                        30,
                        160,
                        fields.length * 20 + 50
                    );

                    fields.map((field, f_index) => {
                        new_table.addInPort(field, f_index);
                        new_table.addOutPort(field, f_index);
                    });


                // });
            },
            createDiagram() {
                const editorDOM = document.getElementById("data-source-editor");

                this.editorW = editorDOM.clientWidth;
                this.editorH = editorDOM.clientHeight ;

                this.tables.map((table, index) => {

                    this.addTable(table, index);
                });
            },
            previewData() {
            },
            getQueryPre() {
                let filters = this.exportSQL();

                let query = getQuery(this.model._model, filters, this.extraQuery);

                // return sqlFormatter.format(query);
                return query;
            },
            previewQuery() {
                this.sql_query = this.getQueryPre();
            },
            getTables() {


                this.createDiagram();

            }
        },
        data() {
            const model = new Diagram.Model();
            return {
                model: model,
                tableMeta: window.init.dbSchema.tableMeta,
                tables: [],
                source_tables: [],
                queryModal: false,
                withFilter: false,
                search: "",
                sql_query: "",
                editorW: 0,
                editorH: 0,
                selectedNodeIndex: null,
                selectedFieldIndex: null,
                field: {
                    name: ""
                },
                filters:null,
                properties: "main",
                viewName: "",
                extraQuery: "",
                query: null
            };
        },
        mounted() {
            this.getTables();
        },
        components: {
            Diagram
        },
        computed: {
            lang () {
                const labels = ['dataProcessing', 'characteristics', 'basic', 'column', 'name', 'additional', 'filter', 'aggregation',
                    'sort', 'use', 'grouping', 'select', 'noSort', 'type', 'alias', 'no', 'data', 'save', 'bolomjitTableAndView', 'tableList', 'viewList'];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataSource.' + labels[i]);
                    return obj;
                }, {});
            },
            total_nodes(){
                return this.model._model.nodes.length;
            },
            tableList(){
                return getTableView("table")
            },
            viewList(){
                return getTableView("view")
            }
        },
        watch: {
             total_nodes: function(value, old){
                if (old <= 0 && value >= 1 && this.editMode) {

                    this.model._model.nodes.map((node, index)=>{
                        //DB field sync

                      if(window.init.dbSchema.tableMeta){
                        if(window.init.dbSchema.tableMeta[node.title]){
                          let dbSchema = window.init.dbSchema.tableMeta[node.title]


                          //Sync added DB field
                          dbSchema.map((item, i_index) => {
                            let found = false;
                            node.ports.map(port=>{
                              if(port.field.name == item.model)
                                found = true;
                            });
                            node.ports.map(port=>{
                              if(port.field.name == item.model)
                                found = true;
                            });

                            if (!found) {
                              this.model._model.nodes[index].ports.push(
                                  {
                                    f_index:i_index,
                                    field:{
                                      name: item.model,
                                      dbType: item.dbType,
                                      alias: node.title + "_as_" + item.model,
                                      alias_db:item.model,
                                      output: true,
                                      sortType: "none",
                                        color: null,
                                      sortOrder: 1,
                                      groupBy: false,
                                      groupOrder: 1,
                                      aggregate: "none",
                                      table: node.title
                                    },
                                    id:node.title + "_as_" + item.model+"_in",
                                    type:'in'
                                  }
                              );
                              this.model._model.nodes[index].ports.push(
                                  {
                                    f_index:i_index,
                                    field:{
                                      name: item.model,
                                      dbType: item.dbType,
                                      alias: node.title + "_as_" + item.model,
                                      alias_db: item.model,
                                      output: true,
                                      sortType: "none",
                                        color: null,
                                      sortOrder: 1,
                                      groupBy: false,
                                      groupOrder: 1,
                                      aggregate: "none",
                                      table: node.title
                                    },
                                    id:node.title + "_as_" + item.model+"_out",
                                    type:'out'
                                  }
                              );
                            }
                          });
                          //Sync removed DB field

                          node.ports.map((port, Pindex)=>{
                            let found = false;
                            dbSchema.map((item, i_index) => {
                              if(port.field.name == item.model)
                                found = true;
                            });
                            if(!found){
                              node.ports.splice(Pindex, 1)
                            }
                          });

                          this.model._model.nodes[index].height = dbSchema.length * 20 + 50;
                        } else {
                          axios.get(`/lambda/puzzle/table-schema/${node.title}`).then(res=>{
                            let dbSchema = res.data;

                            //Sync added DB field
                            dbSchema.map((item, i_index) => {
                              let found = false;
                              node.ports.map(port=>{
                                if(port.field.name == item.model)
                                  found = true;
                              });
                              node.ports.map(port=>{
                                if(port.field.name == item.model)
                                  found = true;
                              });

                              if (!found) {
                                this.model._model.nodes[index].ports.push(
                                    {
                                      f_index:i_index,
                                      field:{
                                        name: item.model,
                                        dbType: item.dbType,
                                        alias: node.title + "_as_" + item.model,
                                        alias_db:item.model,
                                        output: true,
                                        sortType: "none",
                                          color: null,
                                        sortOrder: 1,
                                        groupBy: false,
                                        groupOrder: 1,
                                        aggregate: "none",
                                        table: node.title
                                      },
                                      id:node.title + "_as_" + item.model+"_in",
                                      type:'in'
                                    }
                                );
                                this.model._model.nodes[index].ports.push(
                                    {
                                      f_index:i_index,
                                      field:{
                                        name: item.model,
                                        dbType: item.dbType,
                                        alias: node.title + "_as_" + item.model,
                                        alias_db: item.model,
                                        output: true,
                                        sortType: "none",
                                          color: null,
                                        sortOrder: 1,
                                        groupBy: false,
                                        groupOrder: 1,
                                        aggregate: "none",
                                        table: node.title
                                      },
                                      id:node.title + "_as_" + item.model+"_out",
                                      type:'out'
                                    }
                                );
                              }
                            });
                            //Sync removed DB field

                            node.ports.map((port, Pindex)=>{
                              let found = false;
                              dbSchema.map((item, i_index) => {
                                if(port.field.name == item.model)
                                  found = true;
                              });
                              if(!found){
                                node.ports.splice(Pindex, 1)
                              }
                            });

                            this.model._model.nodes[index].height = dbSchema.length * 20 + 50;
                          })
                        }
                      } else {
                        axios.get(`/lambda/puzzle/table-schema/${node.title}`).then(res=>{
                          let dbSchema = res.data;

                          //Sync added DB field
                          dbSchema.map((item, i_index) => {
                            let found = false;
                            node.ports.map(port=>{
                              if(port.field.name == item.model)
                                found = true;
                            });
                            node.ports.map(port=>{
                              if(port.field.name == item.model)
                                found = true;
                            });

                            if (!found) {
                              this.model._model.nodes[index].ports.push(
                                  {
                                    f_index:i_index,
                                    field:{
                                      name: item.model,
                                      dbType: item.dbType,
                                      alias: node.title + "_as_" + item.model,
                                      alias_db:item.model,
                                      output: true,
                                      sortType: "none",
                                        color: null,
                                      sortOrder: 1,
                                      groupBy: false,
                                      groupOrder: 1,
                                      aggregate: "none",
                                      table: node.title
                                    },
                                    id:node.title + "_as_" + item.model+"_in",
                                    type:'in'
                                  }
                              );
                              this.model._model.nodes[index].ports.push(
                                  {
                                    f_index:i_index,
                                    field:{
                                      name: item.model,
                                      dbType: item.dbType,
                                      alias: node.title + "_as_" + item.model,
                                      alias_db: item.model,
                                      output: true,
                                      sortType: "none",
                                        color: null,
                                      sortOrder: 1,
                                      groupBy: false,
                                      groupOrder: 1,
                                      aggregate: "none",
                                      table: node.title
                                    },
                                    id:node.title + "_as_" + item.model+"_out",
                                    type:'out'
                                  }
                              );
                            }
                          });
                          //Sync removed DB field

                          node.ports.map((port, Pindex)=>{
                            let found = false;
                            dbSchema.map((item, i_index) => {
                              if(port.field.name == item.model)
                                found = true;
                            });
                            if(!found){
                              node.ports.splice(Pindex, 1)
                            }
                          });

                          this.model._model.nodes[index].height = dbSchema.length * 20 + 50;
                        })
                      }





                    });




                }
            }
        }
    };
</script>
