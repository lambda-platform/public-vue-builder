<template>
    <div :class="chartType == 'AreaChart' || chartType == 'LineChart' || chartType == 'ColumnChart' ? 'chart-element-wide' : chartType == 'countBox' ? 'count-box' :'chart-element'" v-if="!loading" :style="minH ? `min-height: ${minH}`: ''">
        <Spin size="large" fix v-if="loading"></Spin> <component v-else :is="chartType" :isRest="true" :type="chartType" :chartTitle="title" :chart_title="title" :chartData="chartData" :xData="xData" v-bind="currentProperties" :minH="minH" :hideTitle="hideTitle" :filters="filters" :hideZoom="hideZoom" :chartColor="chartColor" :chart_filter="chart_filter" :id="id"></component>
    </div>
</template>

<script>
import AreaLine from "./elements/AreaLine";
import Pie from "./elements/Pie";
import TableE from "./elements/Table";
import Radar from "./elements/Radar";
import CountBox from "./elements/CountBox";

export default {
    props: ["src", "id", "title", "chart_filter", "hideTitle", "filters", "hideZoom", "APIurl", "chartType", "minH", "chartColor", ],
    data() {
        return {
            currentProperties: null,
            chartData:null,
            xData:null,
            loading:true
        };
    },
    methods: {
        init() {
            this.loading = true;
            axios.post(this.$props.APIurl, {filters:this.filters}).then(o => {
                   this.chartData= o.data.data.data;
                   this.xData= o.data.data.xdata;
                   this.loading = false;
                }).catch(o => {
                    console.log(o);
                });
        },

    },

    mounted() {
        this.init();
    },

    components: {
        AreaChart: AreaLine,
        LineChart: AreaLine,
        ColumnChart: AreaLine,
        PieChart: Pie,
        TreeMapChart: Pie,
        FunnelChart: Pie,
        DataTable: TableE,
        RadarChart: Radar,
        countBox: CountBox,
    },
    computed: {
        // currentProperties: function () {
        //     return {
        //         chart_title: this.title,
        //         ...JSON.parse(this.source)
        //     };
        // },
        // type: function () {
        //     let source = JSON.parse(this.source);
        //     return source.type
        // },
    }
};
</script>
