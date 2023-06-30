<template>
    <div
        :class="type == 'AreaChart' || type == 'LineChart' || type == 'ColumnChart' ? 'chart-element-wide' : type == 'countBox' ? 'count-box' :'chart-element'"
        :style="minH ? `min-height: ${minH}`: ''">
        <Spin size="large" fix v-if="loading"></Spin>
        <component v-else :is="element(type)" v-bind="currentProperties" @changeFilter="changeFilter" :hideTitle="hideTitle" :projectDomain="projectDomain"
                   :filters="filters" :hideZoom="hideZoom" :chart_filter="chart_filter" @unFilter="unFilter"
                   :limit="limit"
                   :order="order"
                   :id="id"></component>
    </div>
</template>

<script>
import {element} from "./elements";
export default {
    props: ["src", "id", "chart_filter", "hideTitle", "filters", "hideZoom", "minH", "limit", "order", "projectDomain"],
    data() {
        return {
            currentProperties: null,
            type: "",
            loading: true
        };
    },
    methods: {
        element: element,
        init() {
            this.loading = true;

            axios.get(this.$props.src,{transformRequest: (data, headers) => {

                    delete headers.common['X-CSRF-TOKEN'];
                    delete headers['X-CSRF-TOKEN'];
                    delete headers.common['X-Requested-With'];
                }
            })
                .then(o => {
                    this.currentProperties = JSON.parse(o.data.data.schema);
                    this.type = this.currentProperties.type;
                    this.loading = false;
                })
                .catch(o => {
                    console.log(o);
                });
        },
        changeFilter(event) {
            this.$emit("changeFilter", event);
        },
        unFilter() {
            this.$emit("unFilter");
        }
    },

    mounted() {
        this.init();
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
