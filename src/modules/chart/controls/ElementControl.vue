<template>
    <div class="element-control ve-column">
        <h5 class="ve-title ">{{ lang.element_type }}</h5>
        <div>
            <ul class="ve-types">
                <li v-for="eType in elementTypes" :class="elementType == eType.type ? 'active' : ''">
                    <a href="javascript:;" @click="setType(eType.type)">
                        <Tooltip :content="eType.label"><img :src="getPatch(eType.icon)" alt=""></Tooltip>
                    </a>
                </li>
            </ul>
        </div>
        <div v-if="elementType == 'AreaChart' || elementType =='LineChart' || elementType =='ColumnChart'">
            <AreaLineColumn></AreaLineColumn>
        </div>
        <div v-if="elementType == 'PieChart' || elementType == 'FunnelChart' || elementType == 'TreeMapChart'">
            <Pie></Pie>
        </div>
        <div v-if="elementType == 'DataTable'">
            <TablE></TablE>
        </div>
        <div v-if="elementType == 'RadarChart'">
            <Radar></Radar>
        </div>
        <div v-if="elementType == 'countBox'">
            <CountBox></CountBox>
        </div>

        <h5 class="ve-title">{{ lang._filter }}</h5>
        <div>
            <draggable
                class="dragArea"
                v-model="other.filters"
                :options="{group:'element'}"
            >
                <div
                    v-for="(column, index) in other.filters"
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
                    >{{ column.aggregate }}</span>
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
                        <Icon type="md-close"/>
                    </Button>
                </div>
            </draggable>
        </div>

    </div>
</template>

<script>

import {mapGetters} from 'vuex';
import draggable from 'vuedraggable';

import AreaLineColumn from "./AreaLineColumn";
import Pie from "./Pie";
import TablE from "./Table";
import Radar from "./Radar";
import CountBox from "./CountBox";


export default {
    methods: {

        deleteValues(index) {

            this.other.filters.splice(index, 1);
        },

        setType(type) {
            this.$store.commit('setType', type);
        },
        getPatch(path) {
            return path;
        }

    },
    data() {
        return {}
    },
    mounted() {


    },
    components: {
        AreaLineColumn,
        Pie,
        TablE,
        Radar,
        draggable,
        CountBox
    },

    computed: {
        ...mapGetters({
            elementTypes: 'elementTypes',
            elementType: 'elementType',
            areaLineColumnFields: 'areaLineColumnFields',
            tableFields: 'tableFields',
            radarFields: 'radarFields',
            other: 'other',

        }),
        lang() {
            const labels = ['element_type','_filter','groupBy'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('chart.' + labels[i]);
                return obj;
            }, {});
        },
    },

}
</script>
