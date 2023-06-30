<template>
    <div style="width: 100%; height: 100%">
    </div>
</template>

<script>
import axios from "axios"
import {getNumber} from '../utils/number';

export default {
    props: ['title', 'value', 'type', 'chart_title', 'id', 'chart_filter', 'filters', "hideTitle", "limit", "projectDomain", "isRest", "xData", "chartData",],
    methods: {
        getSeries() {
        },
        callData() {
            if (this.value.length >= 1 && this.title.length >= 1) {
                let newFilter = [];
                if (this.filters) {
                    this.filters.map(filter__ => {
                        if (this.chart_filter) {
                            this.chart_filter.map(chart_filter => {
                                if (filter__.name == chart_filter.field && filter__.table == chart_filter.table) {
                                    newFilter.push(chart_filter);
                                }
                            })
                        }
                    })
                }

                if (this.instance === null) {
                    this.dataCaller([]);
                } else {
                    if (newFilter.length >= 1) {
                        this.lastFilter = newFilter
                        this.dataCaller(newFilter);
                    } else {
                        if (this.lastFilter.length >= 1) {
                            this.lastFilter = [];
                            this.dataCaller([]);
                        }
                    }
                }
            }
        },
        sourceUrl() {

            if(window.init.projectSettings){

                // return window.init.projectSettings.dev_url;
                return window.init.projectSettings.production_url;
            } else {
                return ""
            }
        },
        dataCaller(filter) {
            let url = this.sourceUrl()+'/ve/get-data-pie';
            if(this.projectDomain){
                url = this.projectDomain+url;
            }
            axios.post(url, {
                value: this.value,
                title: this.title,
                filters: this.filters,
                limit: this.limit ? this.limit.toString() : undefined
            }).then(response => {
                this.elementData = response.data;
                this.initChart();
            }).catch(error => {
                console.log(error)
            })
        },

        initChart() {
            if (this.instance) {
                this.instance.dispose();
                this.instance = null;
            }
            var dom = this.$el;
            var wrapper = dom.parentElement;
            dom.style.height = wrapper.offsetHeight + 'px';

            var myChart = window.echarts.init(dom, null, {
                renderer: 'canvas',
                useDirtyRect: false
            });
            this.instance = myChart;

            let series = [];
            let seriesData = [];
            let totalValue = 0;

            let value_field = this.value[0].name;
            let title_field = this.title[0].name;

            this.elementData.map(sdata => {

                if(sdata[title_field] !== null && sdata[value_field] !== null){
                    totalValue = totalValue + sdata[value_field];
                    seriesData.push({
                        value: sdata[value_field],
                        name: sdata[title_field]
                    });
                }

            });



            if (this.type == 'PieChart') {


                series.push({
                    name: this.chart_title,
                    type: 'pie',

                    center: ['50%', '50%'],
                    radius: ['35%', '70%'],

                    itemStyle: {
                        borderRadius: 3,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    data: seriesData,
                    // color: ["#FF9B05", "#3350D6", "#6CD0FF", "#6B2D90", "#FF78BE", "#FF6EF8", "#E070FC", "#FF78BE","#7AADFF"],

                    label: {
                        normal: {
                            formatter: col => {
                                var length = 25;

                                var trimmedString = col.name.length > length ?
                                    col.name.substring(0, length - 3) + "..." :
                                    col.name;
                                return trimmedString;
                            },
                            show: false,
                            position: 'top',
                        },
                    },
                });
            }

            if (this.type == 'FunnelChart') {
                series.push({
                    name: this.chart_title,
                    type: 'funnel',
                    radius: '70%',
                    center: ['50%', '60%'],
                    data: seriesData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                });
            }

            if (this.type == 'TreeMapChart') {
                series.push({
                    name: this.chart_title,
                    type: 'treemap',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: seriesData,
                    // color: ["#B3B9F6", "#7AADFF", "#6CD0FF", "#6B2D90", "#FF78BE", "#FF6EF8", "#E070FC"],
                    levels:[

                        {
                            itemStyle: {
                                borderColor: '#fff',
                                borderWidth: 2,
                                gapWidth: 1
                            },
                            emphasis: {
                                itemStyle: {
                                    borderColor: '#fff'
                                }
                            }
                        },
                        {
                            colorSaturation: [0.35, 0.5],
                            itemStyle: {
                                borderWidth: 2,
                                gapWidth: 1,
                                borderColorSaturation: 0.6
                            }
                        }
                    ],
                    roam: 'move',
                    itemStyle: {
                        borderRadius: 3,
                        borderColor: '#fff',

                        normal: {
                            label: {
                                formatter: (e) => {
                                    let percent = Math.round(e.data.value / (totalValue / 100) * 100) / 100;
                                    return `${e.data.name}: ${percent}%, ${getNumber(e.data.value)}`;
                                },
                                textStyle: {
                                    baseline: 'top'
                                }
                            }
                        },
                    }
                });
            }

            let titles = this.elementData.filter(data_ => data_[title_field] !== null).map(data_ => data_[title_field]);

            let options = {

                title: !this.hideTitle ? {
                    text: this.chart_title,
                    textStyle: {
                        fontFamily: 'Arial',
                        fontWeight: "normal"
                    }
                } : undefined,
                toolbox: {
                    feature: {
                        saveAsImage: {
                            title: 'Татах'
                        },
                    }
                },
                tooltip: this.type === 'TreeMapChart' ? {
                    trigger: 'item',
                    formatter: (e) => {
                        let percent = Math.round(e.data.value / (totalValue / 100) * 100) / 100;
                        return `${e.data.name}: ${percent}% <br> ${getNumber(e.data.value)}`;
                    }
                } : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                    // formatter: "{b} : {c} ({d}%)"
                    // formatter: "{b} : {c}"

                },
                legend: {
                    orient: 'horizontal',
                    left: 5,

                    bottom: 0,
                    type: 'scroll',
                    data: titles
                },
                series: series,


            }
            console.log(options)
            console.log(options)
            myChart.setOption(options);

            // myChart.on('click', function (event) {
            //     console.log(event)

            // });

            myChart.on('click', (event) => {
                if (event.data) {
                    this.$emit("changeFilter", {
                        value: event.data.name,
                        id: this.id,
                        field: this.title[0].name,
                        table: this.title[0].table,
                    });
                } else {
                    this.$emit("unFilter");
                }
            });

            window.addEventListener('resize', myChart.resize);

            // myChart.on('legendselectchanged', function (event) {
            //     console.log(event)
            //     console.log('legendselectchanged')
            // });
        },
        initRest() {


            if (this.instance) {
                this.instance.dispose();
                this.instance = null;
            }
            var dom = this.$el;
            var wrapper = dom.parentElement;
            dom.style.height = wrapper.offsetHeight + 'px';
            // console.log(wrapper.offsetWidth);
            // var myChart = window.echarts.init(dom, 'light');
            var myChart = window.echarts.init(dom, 'shine');
            this.instance = myChart;

            let series = [];
            let seriesData = [];
            let totalValue = 0;



            let value_field = this.xData.valueField;
            let title_field = this.xData.labelField;

            this.chartData.map(sdata => {
                totalValue = totalValue + sdata[value_field];
                seriesData.push({
                    value: sdata[value_field],
                    name: sdata[title_field]
                });
            });



            if (this.type == 'PieChart') {


                series.push({
                    name: this.chart_title,
                    type: 'pie',

                    center: ['50%', '40%'],
                    radius: ['35%', '70%'],

                    itemStyle: {
                        borderRadius: 3,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    data: seriesData,
                    // color: ["#FF9B05", "#3350D6", "#6CD0FF", "#6B2D90", "#FF78BE", "#FF6EF8", "#E070FC", "#FF78BE","#7AADFF"],

                    label: {
                        normal: {
                            formatter: col => {
                                var length = 25;
                                var trimmedString = col.name.length > length ?
                                    col.name.substring(0, length - 3) + "..." :
                                    col.name;
                                return trimmedString;
                            },
                            show: true,
                            position: 'top',
                        },
                    },
                });
            }

            if (this.type == 'FunnelChart') {
                series.push({
                    name: this.chart_title,
                    type: 'funnel',
                    radius: '70%',
                    center: ['50%', '60%'],
                    data: seriesData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                });
            }

            if (this.type == 'TreeMapChart') {
                series.push({
                    name: this.chart_title,
                    type: 'treemap',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: seriesData,
                    // color: ["#B3B9F6", "#7AADFF", "#6CD0FF", "#6B2D90", "#FF78BE", "#FF6EF8", "#E070FC"],
                    levels:[

                        {
                            itemStyle: {
                                borderColor: '#fff',
                                borderWidth: 2,
                                gapWidth: 1
                            },
                            emphasis: {
                                itemStyle: {
                                    borderColor: '#fff'
                                }
                            }
                        },
                        {
                            colorSaturation: [0.35, 0.5],
                            itemStyle: {
                                borderWidth: 2,
                                gapWidth: 1,
                                borderColorSaturation: 0.6
                            }
                        }
                    ],
                    roam: 'move',
                    itemStyle: {
                        borderRadius: 3,
                        borderColor: '#fff',

                        normal: {
                            label: {
                                formatter: (e) => {
                                    let percent = Math.round(e.data.value / (totalValue / 100) * 100) / 100;
                                    return `${e.data.name}: ${percent}%, ${getNumber(e.data.value)}`;
                                },
                                textStyle: {
                                    baseline: 'top'
                                }
                            }
                        },
                    }
                });
            }

            let titles = this.chartData.map(data_ => data_[title_field]);



            myChart.setOption({
                theme: "shine",
                name: !this.hideTitle ? {
                    text: this.chart_title,
                    textStyle: {
                        fontFamily: 'Arial',
                        fontWeight: "normal"
                    }
                } : undefined,
                title: !this.hideTitle ? {
                    text: this.chart_title,
                    textStyle: {
                        fontFamily: 'Arial',
                        fontWeight: "normal"
                    }
                } : undefined,
                toolbox: {
                    feature: {
                        saveAsImage: {
                            title: 'Татах'
                        },
                    }
                },
                tooltip: this.type == 'TreeMapChart' ? {
                    trigger: 'item',
                    formatter: (e) => {
                        let percent = Math.round(e.data.value / (totalValue / 100) * 100) / 100;
                        return `${e.data.name}: ${percent}% <br> ${getNumber(e.data.value)}`;
                    }
                } : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                    // formatter: "{b} : {c} ({d}%)"
                    // formatter: "{b} : {c}"

                },
                legend: {
                    orient: 'horizontal',
                    left: 5,

                    bottom: 0,
                    type: 'scroll',
                    data: titles
                },
                series: series,


            });

            // myChart.on('click', function (event) {
            //     console.log(event)

            // });

            myChart.on('click', (event) => {
                if (event.data) {
                    this.$emit("changeFilter", {
                        value: event.data.name,
                        id: this.id,
                        field: this.title[0].name,
                        table: this.title[0].table,
                    });
                } else {
                    this.$emit("unFilter");
                }
            });

        }

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
            timeout: null,
            lastFilter: []
        }
    },

    watch: {

        type: function (val) {
            this.initChart();
        },

        'value': {
            handler: function (after, befor) {

                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.callData();
                }, 1200);

            },
            deep: true
        },

        'chart_filter': {
            handler: function (after, befor) {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.callData();
            },
            deep: true
        },

        'chart_title': {
            handler: function (after, befor) {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }

                this.timeout = setTimeout(() => {
                    this.callData();
                }, 1200);

            },
            deep: true
        },

        'title': {
            handler: function (after, befor) {
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
}
</script>
