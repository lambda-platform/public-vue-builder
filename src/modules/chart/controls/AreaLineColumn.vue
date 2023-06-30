<template>
    <div>

        <Tabs>
            <TabPane :label="lang.field" icon="ios-list">

                <div>
                    <h5 class="ve-title">{{ lang.horizontal_value }} /Axis/</h5>
                    <div>
                        <draggable class="dragArea" v-model="areaLineColumnFields.axis" :options="{group:'element'}">

                            <div v-for="(column, index) in areaLineColumnFields.axis" :key="index" class="data-element">
 <span
     class="groupBy"
     v-if="column.groupBy"
 >{{ lang.groupBy }}</span>
                                <span
                                    class="aggregation"
                                    v-if="column.aggregate != 'none'"
                                >{{ column.aggregate }}</span>
                                <input v-model="column.title" :placeholder="column.name"
                                       @blur="column.editing = false"></input>
                                <Button class="delete-field" size="small" @click="deleteAxis(index)">
                                    <Icon type="md-close"/>
                                </Button>
                            </div>
                        </draggable>
                    </div>
                    <h5 class="ve-title">{{ lang.line }}</h5>
                    <div>
                        <draggable class="dragArea" v-model="areaLineColumnFields.lines" :options="{group:'element'}">
                            <div v-for="(column, index) in areaLineColumnFields.lines" :key="index"
                                 class="data-element">
 <span
     class="groupBy"
     v-if="column.groupBy"
 >{{ lang.groupBy }}</span>
                                <span
                                    class="aggregation"
                                    v-if="column.aggregate != 'none'"
                                >{{ column.aggregate }}</span>
                                <input v-model="column.title" :placeholder="column.name"
                                       @blur="column.editing = false"></input>
                                <Button class="delete-field" size="small" @click="deleteValues(index)">

                                    <Icon type="md-close"/>
                                </Button>
                            </div>
                        </draggable>
                    </div>

                </div>

            </TabPane>
            <TabPane :label="lang.settings" icon="android-options">
                <div>
                    <i-switch>
                        <span slot="open">{{ lang._big }}</span>
                        <span slot="close">{{ lang._small }}</span>
                    </i-switch>
                </div>
            </TabPane>

        </Tabs>

    </div>

</template>

<script>

import draggable from 'vuedraggable';


import {mapGetters} from 'vuex';


export default {
    methods: {
        showTable(table) {
            console.log('showing ', table)
        },

        deleteAxis(index) {

            this.areaLineColumnFields.axis.splice(index, 1);
        },
        deleteValues(index) {

            this.areaLineColumnFields.lines.splice(index, 1);
        },

    },
    mounted() {

    },
    data() {
        return {
            filters: [],

        }
    },
    computed: {
        ...mapGetters({
            elementTypes: 'elementTypes',
            elementType: 'elementType',
            areaLineColumnFields: 'areaLineColumnFields',
        }),
        lang() {
            const labels = ['horizontal_value','groupBy','line','_big','_small','field','settings'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('chart.' + labels[i]);
                return obj;
            }, {});
        },
    },
    components: {
        draggable,

    },


};
</script>

