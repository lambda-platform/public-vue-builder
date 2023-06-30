<template>
    <div ref="chart" :style="minH ? `width: 100%; height: 100%; min-height: ${minH}` : 'width: 100%; height: 100%;'"></div>
</template>

<script>
import axios from "axios";
import { idGenerator } from "../utils/id";
export default {
    props: ["axis", "lines", "type", "chart_title", "hideTitle", "filters", "hideZoom", "chartTitle", "chartData", "xData", "isRest",  "minH", "chartColor", "projectDomain", "limit", "order"],
    methods: {
        getSeries() {},
        sourceUrl() {

            if(window.init.projectSettings){

                // return window.init.projectSettings.dev_url;
                return window.init.projectSettings.production_url;
            } else {
                return ""
            }
        },
        callData() {
            if (this.axis.length >= 1 && this.lines.length >= 1) {
                let url = this.sourceUrl()+'/ve/get-data';
                if(this.projectDomain){
                    url = this.projectDomain+url;
                }
                axios
                    .post(url, {
                        axis: this.axis,
                        lines: this.lines,
                        filters:this.filters,
                        order: this.order ? this.order.toString() : undefined,
                        limit: this.limit ? this.limit.toString() : undefined
                    })
                    .then(response => {
                        this.elementData = response.data;

                        this.initChart();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        initChart() {
            if (this.instance) {
                this.instance.dispose();
                this.instance = null;
            }
            var dom = this.$el;
            var wrapper = dom.parentElement;
            dom.style.height = wrapper.offsetHeight + "px";
            // console.log(wrapper.offsetWidth);
            var myChart = window.echarts.init(dom, "light");
            this.instance = myChart;

            let axis = [];
            let series = [];

            this.axis.map(ax => {
                this.elementData.map(sdata => {
                    axis.push(`${sdata[ax.name]}`);
                });
            });
            let colors = [];
            this.lines.map(value => {
                let seriesData = [];

                this.elementData.map(sdata => {
                    seriesData.push(sdata[value.name]);
                });
                if (this.type == "AreaChart") {
                    series.push({
                        name: value.title,
                        type: "line",
                        smooth: true,
                        areaStyle: {},

                        data: seriesData
                    });
                }

                if (this.type == "LineChart") {
                    series.push({
                        name: value.title,
                        type: "line",
                        smooth: true,

                        data: seriesData
                    });
                }

                if (this.type == "ColumnChart") {
                    series.push({
                        name: value.title,
                        type: "bar",
                        smooth: true,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        data: seriesData
                    });
                }

                if(value["color"] != null && value["color"] != ""){
                    colors.push(value["color"]);
                }
            });

            if (this.axis.length >= 1 && this.lines.length >= 1) {

                myChart.setOption({
                    title: ! this.hideTitle ? {
                        text: this.chart_title,
                      textStyle:{
                        fontFamily:'Arial',
                        fontWeight:"normal"
                      }
                    } : undefined,
                    tooltip: {
                        trigger: "axis",
                        position: function(pt) {
                            return [pt[0], "10%"];
                        }
                    },

                    legend: {
                        data: this.lines.map(line => line.title),
                        align: 'left',
                        left: 10,
                        top: 25,
                    },
                    toolbox: {
                        feature: {
                            // dataZoom: {
                            //     yAxisIndex: "none",
                            //     title: { zoom: "Зурж Томруулах", back: "Буцах" }
                            // },
                            // restore: { title: "Дахин эхлүүл" },
                            saveAsImage: { title: "Татах" },
                            // brush: {},
                            magicType: {
                                type: ["line", "bar"],
                                title: { line: "Шугман", bar: "Багнан" }
                            }
                        }
                    },
                    xAxis: {
                        type: "category",
                        boundaryGap: true,

                        data: axis
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis: {
                        type: "value",
                        scale: true,
                        max: function (value) {
                            return value.max - 0;
                        },
                        min: function (value) {
                            return value.min - 0;
                        },
                        boundaryGap: [0, "100%"]
                    },
                   dataZoom:  !this.hideZoom ?[
                        {
                            startValue: axis[0]
                        },
                        {
                            type: "inside"
                        }
                    ] : undefined,
                    series: series,
                    color:colors.length >= 1 ? colors :   undefined
                });
            }
            setTimeout(() => {
                this.initing = false;
            }, 2100);
        },
        initRest(){


            if (this.instance) {
                this.instance.dispose();
                this.instance = null;
            }
            var dom = this.$el;
            var wrapper = dom.parentElement;
            dom.style.height = wrapper.offsetHeight + "px";
            // console.log(wrapper.offsetWidth);
            var myChart = window.echarts.init(dom, "shine");
            this.instance = myChart;
            myChart.setOption({
                title: ! this.hideTitle ? {
                    text: this.chartTitle,
                    textStyle:{
                        fontFamily:'Arial',
                        fontWeight:"normal"
                    }
                } : undefined,
                tooltip: {
                    trigger: "axis",
                    position: function(pt) {
                        return [pt[0], "10%"];
                    }
                },

                legend: {
                    data: this.chartData.map(x=>x.name),
                    align: 'left',
                    left: 10,
                    top: 25,
                },
                toolbox: {
                    feature: {
                        // dataZoom: {
                        //     yAxisIndex: "none",
                        //     title: { zoom: "Зурж Томруулах", back: "Буцах" }
                        // },
                        // restore: { title: "Дахин эхлүүл" },
                        saveAsImage: { title: "Татах" },
                        // brush: {},
                        magicType: {
                            type: ["line", "bar"],
                            title: { line: "Шугман", bar: "Багнан" }
                        }
                    }
                },
                "grid": {
                    "top": "25%",
                },
                xAxis: {
                    type: "category",
                    boundaryGap: true,

                    data: this.xData
                },
                yAxis: {
                    type: "value",
                    scale: true,
                    boundaryGap: [0, "100%"]
                },
                dataZoom:  !this.hideZoom ?[
                    {
                        startValue: this.xData[0]
                    },
                    {
                        type: "inside"
                    }
                ] : undefined,
                series: this.chartData,
               color:this.chartColor ? this.chartColor : undefined
            });
        }
    },
    beforeMount() {
        this.id = idGenerator("area");
    },
    mounted() {
        if(!this.isRest){
            this.callData();
        } else {
            this.initRest();
        }

    },
    data() {
        return {
            elementData: [],
            instance: null,
            timeout: null
        };
    },
    watch: {
        type: function(val) {
            this.initChart();
        },
        axis: {
            handler: function(after, befor) {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.callData();
                }, 1200);
            },
            deep: true
        },
        lines: {
            handler: function(after, befor) {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.callData();
                }, 1200);
            },
            deep: true
        }
    }
};
</script>
