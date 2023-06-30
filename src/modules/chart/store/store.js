import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import actions from "./actions"
import mutations from "./mutations"

import getters from "./getters";

export const iniState = {
    elementTypes: [
        {
            label: 'Area',
            type: 'AreaChart',
            icon: '/assets/lambda/chart-images/area.svg',
        },
        {label: 'Line', type: 'LineChart', icon: '/assets/lambda/chart-images/line.svg'},
        {label: 'Column', type: 'ColumnChart', icon: '/assets/lambda/chart-images/column.svg'},
        {label: 'Pie', type: 'PieChart', icon: '/assets/lambda/chart-images/pie.svg'},
        {label: 'Funnel', type: 'FunnelChart', icon: '/assets/lambda/chart-images/funnel.svg'},
        {label: 'Radar', type: 'RadarChart', icon: '/assets/lambda/chart-images/radar.svg'},
        {label: 'Table', type: 'DataTable', icon: '/assets/lambda/chart-images/table.svg'},
        {label: 'Treemaps', type: 'TreeMapChart', icon: '/assets/lambda/chart-images/treemaps.svg'},
        {label: 'Count', type: 'countBox', icon: '/assets/lambda/chart-images/count.svg'},
        // {label: 'Map', type: 'Map', icon: require('/assets/lambda/chart-images/globe.svg')},
    ],
    areaLineColumnFields: {
        axis: [],
        lines: [],
    },
    pieColumnFields: {
        title: [],
        value: [],
    },
    tableFields: {
        values: [],
    },
    radarFields: {
        values: [],
    },
    countBox: {
        icon: 'flaticon-dashboard',
        bgColor: '#2ecc71',
        textColor: '#ffffff',
        linkTitle: '',
        link: '',
        countFields: []
    },
    elementType: '',
    title: '',
    table: '',
    data: [],
    fields: [],
    other: {
        filters: [],
    }
};
export default new Vuex.Store({
    state: iniState,
    getters,
    mutations,
    actions,
});
