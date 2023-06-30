<template>
    <section class="puzzle">
        <div class="visual-components">
            <Tabs value="html" size="small">
                <TabPane :label="lang.elements" name="html">
                    <draggable v-model="elements" class="controls-list" :options="dragElOption">
                        <component v-for="item in elements" :key="item.index" :is="item.element">
                            {{ item.element }}
                        </component>
                    </draggable>
                </TabPane>

                <TabPane :label="lang.chart" name="chart">
                    <draggable v-model="charts" class="controls-list" :options="dragElOption">
                        <div v-for="item in charts" :key="item.index" :source="item.source">
                            {{ item.name }}
                        </div>
                    </draggable>
                </TabPane>
            </Tabs>
        </div>

        <div class="pz-workspace">
            <div class="pz-workspace-header">
                <div class="pz-workspace-header-wrapper">
                    <h2>
                        <Input v-model="schemaName" style="width: 150px"/>
                        <span>[{{ mode.label }}]</span>
                    </h2>

                    <div class="view-port-switcher">
                        <a href="javascript:void(0)" :class="`${mode.type} ${mode.type == 'xs' ? 'active' :''}`"
                           @click="setMode('xs', 'Утас')">
                            <Icon type="ios-phone-portrait"/>
                        </a>
                        <a href="javascript:void(0)" :class="`${mode.type} ${mode.type == 'sm' ? 'active' :''}`"
                           @click="setMode('sm', 'Таблет')">
                            <Icon type="ios-tablet-portrait"/>
                        </a>
                        <a href="javascript:void(0)" :class="`${mode.type} ${mode.type == 'md' ? 'active' :''}`"
                           @click="setMode('md', 'Компьютер')">
                            <Icon type="ios-laptop"/>
                        </a>
                        <a href="javascript:void(0)" :class="`${mode.type} ${mode.type == 'lg' ? 'active' :''}`"
                           @click="setMode('lg', 'Том компьютер')">
                            <Icon type="ios-desktop-outline"/>
                        </a>
                    </div>

                    <div class="pz-header-buttons">
                        <!-- <Button type="ghost" icon="ios-gear">Тохиргоо</Button> -->
                        <Button type="success" @click="saveSchema">{{lang.save}}</Button>
                    </div>
                </div>
            </div>

            <div class="pz-workspace-container">
                <div :class="`pz-workspace-container-wrapper ${mode.type}`">
                    <div class="grid-schema-shadow">
                        <Row :gutter="16">
                            <Col v-for="col in 12" :span="2" :key="col.index">
                                <div class="col-shadow"></div>
                            </Col>
                        </Row>
                    </div>

                    <div class="grid-schema">
                        <draggable :list="schema" :options="{group:'row', handle: '.row-drag-handler'}">
                            <Row :gutter="16" v-for="(row, index) in schema" :key="index" :class="`${mode.type}`">
                                <div class="pz-row-control">
                                    <a href="javascript:void(0)" @click="duplicateRow(row.id, index)">
                                        <Icon type="android-funnel"></Icon>
                                    </a>
                                    <a href="javascript:void(0)" @click="deleteFromSchema(row.id)">
                                        <Icon type="android-close"></Icon>
                                    </a>
                                    <a href="javascript:void(0)" class="row-drag-handler">
                                        <Icon type="arrow-move"></Icon>
                                    </a>
                                </div>

                                <Col v-for="(col, index) in row.children" :span="col.span[mode.type]" :key="index">
                                    <div class="pz-col easing">
                                        <div class="pz-col-control">
                                            <div class="pz-col-control-items">
                                                <a href="javascript:void(0)" @click="deleteFromSchema(col.id)">
                                                    <Icon type="android-close"></Icon>
                                                </a>
                                            </div>
                                        </div>

                                        <draggable v-model="col.children" :options="{group:'element'}"
                                                   class="pz-holder">
                                            <component v-for="item in col.children" :key="item.index"
                                                       v-if="item.type == 'html'" :is="item.element">
                                                <editable :content="item.content" @update="item.content = $event"
                                                          :el="item.element"></editable>
                                            </component>
                                            <chart v-for="item in col.children" :key="item.index"
                                                   v-if="item.type == 'chart'"
                                                   :src="`/lambda/puzzle/schema/chart/${item.id}`"></chart>
                                        </draggable>
                                        <div class="resizer" @mousedown="handleResize($event, col.id)"></div>
                                    </div>
                                </Col>

                                <Col span="2">
                                    <div :class="`pz-new-col easing ${mode.type}`" @click="addCol(row.id)"></div>
                                </Col>
                            </Row>
                        </draggable>
                        <div :class="`pz-new-row easing`" @click="addRow"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import draggable from "vuedraggable";
import editable from "./editable";
import data from "./utils/data";
import {idGenerator} from "./utils/methods";


export default {
    computed: {
        // ...mapGetters({
        //     user: "user"
        // }),
        lang() {
            const labels = ['db', 'elements', 'chart', 'save', ''
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('moqup.' + labels[i]);
                return obj;
            }, {});
        },
    },
    props: ["editMode", "src", "onCreate", "onUpdate"],
    components: {
        draggable,
        editable
    },
    data() {
        return data;
    },
    created() {
        this.init();
    },
    methods: {
        idGenerator: idGenerator,

        getCharts() {
            axios.get("/lambda/puzzle/schema/chart").then(({data}) => {
                this.charts = data.data;
            });
        },

        init() {
            if (this.$props.editMode == true) {

                axios
                    .get(this.$props.src)
                    .then(o => {
                        this.schemaName = o.data.data.name;
                        this.schema = JSON.parse(o.data.data.schema);
                    })
                    .catch(o => {
                        console.log(o);
                    });
            } else {
                this.schemaName = "Page builder";
                this.schema = [];
                this.mode = {
                    type: "md",
                    label: "Компьютер"
                };
            }
            this.getCharts();
        },

        setMode(type, label) {
            this.mode = {
                type: type,
                label: label
            };
        },

        logSchema() {
            console.log(this.schema);
        },

        //Row
        addRow() {
            let colItem = {
                type: "col",
                id: this.idGenerator("col"),
                span: {
                    xs: 2,
                    sm: 2,
                    md: 2,
                    lg: 2
                },
                children: []
            };

            let rowItem = {
                type: "row",
                id: this.idGenerator("row"),
                children: [colItem]
            };

            this.schema.push(rowItem);
        },

        duplicateRow(id, index) {
            let vm = this;
            let rowClone = _.cloneDeep(_.find(vm.schema, {id: id}), true);
            rowClone.id = idGenerator("row");
            this.schema.splice(index, 0, rowClone);
        },

        //Column
        addCol(parentId) {
            let vm = this;

            let colItem = {
                type: "col",
                id: this.idGenerator("col"),
                span: {
                    xs: 2,
                    sm: 2,
                    md: 2,
                    lg: 2
                },
                children: []
            };

            _.find(vm.schema, {id: parentId})["children"].push(colItem);
        },

        //Element positioning
        addElement(event, el) {
            console.log("Adding element", el);
        },

        //Resizing options here
        getOffset(el) {
            el = el.getBoundingClientRect();
            return el.left + window.scrollX;
        },

        handleResize(e, id) {
            this.currentDom = e.target.parentElement;
            this.findElId = id;
            e.target.parentElement.classList.remove("easing");
            window.addEventListener("mousemove", this.resize, {
                passive: true
            });
            window.addEventListener("mouseup", this.stopResize);
        },

        resize(e) {
            console.log("resizing");
            document.body.style.cursor = "move";
            let parent = this.currentDom;
            let currentX = this.getOffset(parent);
            let newWidth =
                e.clientX - currentX >= 897 ? 897 : e.clientX - currentX;
            parent.style.width = newWidth + "px";
            // parent.style.height = (e.clientY - parent.offsetTop) + 'px';
        },

        stopResize(e) {
            let vm = this;
            window.removeEventListener("mousemove", this.resize);
            window.removeEventListener("mouseup", this.stopResize);
            this.currentDom.classList.add("easing");

            setTimeout(() => {
                let parent = this.currentDom;
                let currentWidth = parent.style.width.replace("px", "") * 1;
                let colW = 60;
                let colMarg = 16;
                for (let i = 1; i <= 12; i++) {
                    let colStandartW = 0;
                    if (i >= 2) {
                        colStandartW = colW * i + colMarg * (i - 1);
                    } else {
                        colStandartW = 60;
                    }

                    if (
                        currentWidth >= colStandartW - 40 &&
                        currentWidth <= colStandartW + 40
                    ) {
                        let el = this.findInSchema(vm.$data.findElId);
                        el.span[vm.$data.mode.type] = i * 2;
                        // parent.style.width = colStandartW + "px";
                        parent.style.width = "100%";
                    } else if (
                        currentWidth >= colStandartW + 41 &&
                        currentWidth <= colStandartW + 76
                    ) {
                        parent.style.width = "100%"; //colStandartW + "px";
                    }
                }
                this.currentDom = null;
            }, 200);
        },

        findInSchema(id) {
            return _(this.schema)
                .thru(function (coll) {
                    return _.union(coll, _.map(coll, "children"));
                })
                .flatten()
                .find({id: id});
        },

        removeFromTree(parent, childNameToRemove) {
            parent.children = parent.children
                .filter(child => {
                    return child.id !== childNameToRemove;
                })
                .map(child => {
                    return this.removeFromTree(child, childNameToRemove);
                });
            return parent;
        },

        deleteFromSchema(id) {
            this.schema = this.schema
                .filter(item => {
                    return item.id !== id;
                })
                .map(item => {
                    return this.removeFromTree(item, id);
                });
        },

        saveSchema() {
            let data = {
                name: this.schemaName,
                schema: JSON.stringify(this.schema)
            };
            let submitUrl = this.$props.editMode
                ? this.$props.src
                : `/lambda/puzzle/schema/moqup`;

            axios.post(submitUrl, data).then(({data}) => {
                if (data.status) {
                    this.$Message.success("Амжилттай хадгаллаа");
                    this.$props.onCreate();
                } else {
                    this.$Message.info("Хадгалах үед алдаа гарлаа!");
                }
            });
        }
    }
};
</script>

<style lang="sass" scoped>
@import "./scss/style.scss"
</style>
