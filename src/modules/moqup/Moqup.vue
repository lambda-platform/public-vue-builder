<template>
    <section :class="disable_preview ? 'moqup-view' : 'puzzle puzzle-preview'">
        <div class="pz-workspace" @click="unFilter" @keydown.esc="unFilter2">
            <div class="pz-workspace-header" v-if="!disable_preview">
                <div class="pz-workspace-header-wrapper">
                    <h2>
                        {{ schemaName }} -
                        <span>[{{ mode.label }}]</span>

                        <a :href="`/pages/moqup/${id}`" target="_blank">{{lang.embedlink}}</a>
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
                        <Button icon="md-create">{{lang.edit}}</Button>
                    </div>
                </div>
            </div>


            <div class="pz-workspace-container">
                <div :class="`pz-workspace-container-wrapper ${mode.type}`">
                    <div class="grid-schema">
                        <Row :gutter="16" v-for="(row, index) in schema" :key="index">
                            <Col v-for="(col, index) in row.children" :span="col.span[mode.type]" :key="index">
                                <div class="pz-col easing">
                                    <component v-for="item in col.children" :key="item.index" :is="item.element"
                                               v-if="item.type=='html'">
                                        {{ item.content == "" ? item.element : item.content }}
                                    </component>

                                    <chart v-for="item in col.children" @changeFilter="chartFilterChanged"
                                           @unFilter="unFilter2" :key="item.index" v-if="item.type == 'chart'"
                                           :src="`/lambda/puzzle/schema/chart/${item.id}`" :id="item.id"
                                           :chart_filter="chartFilters"></chart>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        computed: {
            lang() {
                const labels = ['db', 'embedlink', 'edit', '', ''
                ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('moqup.' + labels[i]);
                    return obj;
                }, {});
            },
        },
        props: ["src", "disable_preview", "id"],
        data() {
            return {
                schemaName: "",
                schema: [],
                mode: {
                    type: "md",
                    label: "Компьютер"
                },
                currentMode: "xs",
                chartFilters: []
            };
        },

        watch: {
            src(val, oldval) {
                this.init();
            }
        },
        mounted() {
            // document.body.addEventListener("keyup", e => {
            //     if (e.keyCode === 27) {
            //         this.unFilter2();
            //     }
            // });
            this.init();
        },

        beforeDestroy() {
            // document.body.removeEventListener("keyup");
        },

        methods: {
            init() {
                axios
                    .get(this.$props.src)
                    .then(o => {
                        this.schemaName = o.data.data.name;
                        this.schema = JSON.parse(o.data.data.schema);
                    })
                    .catch(o => {
                        console.log(o);
                    });
            },

            setMode(type, label) {
                this.mode = {
                    type: type,
                    label: label
                };
            },
            chartFilterChanged(event) {
                let found = false;
                this.chartFilters.map(filter => {
                    if (filter.id == event.value && filter.value == event.value) {
                        found = true;
                    }
                    if (filter.value != event.value && filter.id == event.id) {
                        filter.value = event.value;
                        found = true;
                    }
                });

                if (!found) {
                    this.chartFilters.push(event);
                }
            },
            unFilter(e) {
                if (e.target.getContext) {
                } else {
                    this.unFilter2();
                }
            },
            unFilter2() {
                this.chartFilters = [];
            }
        }
    };
</script>

<style lang="sass" scoped>
    @import "./scss/style.scss"
</style>
