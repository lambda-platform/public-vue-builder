<template>
<div>

    <Tabs>
        <TabPane
            :label="lang.field"
            icon="ios-list"
        >
            <div>
                <h5 class="ve-title">{{ lang._name }}</h5>
                <div>
                    <draggable
                        class="dragArea"
                        v-model="pieColumnFields.title"
                        :options="{group:'element'}"
                    >
                        <div
                            v-for="(column, index) in pieColumnFields.title"
                            :key="index"
                            class="data-element"
                        >
                            <span
                                class="groupBy"
                                v-if="column.groupBy"
                            >{{ lang.groupBy }}</span>
                                <span class="aggregation" v-if="column.aggregate != 'none'"
                                >{{column.aggregate}}</span>
                                    <input
                                        v-model="column.title"
                                        :placeholder="column.name"
                                        @blur="column.editing = false"
                                    ></input>
                                        <Button
                                            class="delete-field"
                                            size="small"
                                            @click="deleteTitle(index)"
                                        >
                                            <Icon type="md-close" />
                                            </Button>
                </div>
                </draggable>

            </div>

            <h5 class="ve-title">{{ lang.values }}</h5>
            <div>

                <draggable
                    class="dragArea"
                    v-model="pieColumnFields.value"
                    :options="{group:'element'}"
                >
                    <div
                        v-for="(column, index) in pieColumnFields.value"
                        :key="index"
                        class="data-element"
                    >
                        <span
                            class="groupBy"
                            v-if="column.groupBy"
                        >{{ lang.groupBy }}</span>
                            <span
                                class="aggregation"
                                v-if="column.aggregate != 'none'"
                            >{{column.aggregate}}</span>
                                <input
                                    v-model="column.title"
                                    :placeholder="column.name"
                                    @blur="column.editing = false"
                                ></input>
                                    <Button
                                        class="delete-field"
                                        size="small"
                                        @click="deleteValues(index)"
                                    >
                                        <Icon type="md-close" />
                                        </Button>
            </div>
            </draggable>

</div>

<div>
</div>
</div>

</TabPane>
<TabPane
    :label="lang.settings"
    icon="android-options"
>
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

import {
    mapGetters
} from 'vuex';


export default {
    methods: {
        showTable(table) {
            console.log('showing ', table)
        },

        deleteValues(index) {

            this.pieColumnFields.value.splice(index, 1);
        },

        deleteTitle(index) {

            this.pieColumnFields.title.splice(index, 1);
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
            pieColumnFields: 'pieColumnFields',
        }),
        lang() {
            const labels = ['_name','field','groupBy','values','settings','_big','_small'];
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
