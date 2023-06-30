<template>
    <div class="line">
        <div :id="id ? id : 'vs-chart'" style="width: 100%; height: 100%">
        </div>
    </div>
</template>

<script>

import axios from "axios"

export default {
    props: ['values', 'type', 'id'],
    methods: {
        getSeries() {

        },
        sourceUrl() {

            if(window.init.projectSettings){

                // return window.init.projectSettings.dev_url;
                return window.init.projectSettings.production_url;
            } else {
                return ""
            }
        },
        callData() {
            if (this.values.length >= 1) {
                axios.post(this.sourceUrl()+'/ve/get-data-pie', {values: this.values}).then(response => {
                    this.elementData = response.data;
                    this.initChart();
                }).catch(error => {

                })
            }

        },
        initChart() {

            if (this.instance) {
                this.instance.dispose();
                this.instance = null;
            }
            var dom = document.getElementById(this.id ? this.id : 'vs-chart');
            var wrapper = dom.parentElement;
            dom.style.height = wrapper.offsetHeight + 'px';
            // console.log(wrapper.offsetWidth);
            var myChart = window.echarts.init(dom, 'light');
            this.instance = myChart;

            let series = [];
            let seriesData = [];

            this.values.map(value => {


                this.elementData.map(sdata => {

                    seriesData.push({
                        value: sdata[value.name], name: value.title
                    })

                })


            });

            let radarData = [];
            let values = [];
            let name = '';
            seriesData.map(data => {
                values.push(data.value)
                name = data.name
            });

            if (name && values.length >= 1) {
                radarData.push({
                    value: values,
                    name: name
                });

                if (this.type == 'RadarChart') {
                    series.push({
                        name: 'Budget vs spending',
                        type: 'radar',
                        // areaStyle: {normal: {}},
                        data: radarData
                    })
                }

            }


            let indicator = [];
            let indicatorNotFound = false
            this.values.map(dat => {
                if (dat.indicator) {
                    indicator.push({
                        name: dat.title,
                        max: dat.indicator * 1,
                    })
                } else {
                    indicatorNotFound = true
                }

            });

            if (indicatorNotFound === false && this.values.length >= 1 && radarData.length >= 1) {
                myChart.setOption({

                    toolbox: {
                        feature: {

                            saveAsImage: {title: 'Татах'},

                        }
                    },
                    tooltip: {},
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: this.values.map(dat => dat.title)
                    },
                    radar: {
                        // shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        indicator: indicator
                    },

                    series: series
                });
            }


        }
    },
    mounted() {

    },
    data() {
        return {
            elementData: [],
            instance: null,
            timeout: null
        }
    },
    watch: {

        type: function (val) {

            this.initChart();
        },
        'values': {
            handler: function (after, befor) {


                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.callData();
                }, 1200);


            }, deep: true
        }


    }
}
</script>
