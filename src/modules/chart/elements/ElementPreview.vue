<template>
    <div class="element-preview ve-column">
        <h1>{{type}}</h1>
        <Input v-model="title" :placeholder="lang.enter_name" style="width: 300px" @on-change="changeTitle"></Input>
        <Button type="success" @click="save">{{ lang._save }}</Button>

        <component :is="element(elementType)" v-bind="currentProperties" :projectDomain="projectDomain"></component>
    </div>
</template>

<script>

import { mapGetters } from "vuex";
import {element} from "./index";

export default {
    props:["projectDomain"],
    methods: {

        element:element,
        save() {
            this.$emit("saveSchema", this.title, this.currentProperties);
        },
        changeTitle(e) {
            this.$store.commit("setTitle", e.target.value);
        }
    },
    data() {
        return {};
    },
    mounted() {},

    computed: {
        ...mapGetters({
            elementTypes: "elementTypes",
            elementType: "elementType",
            data: "data",
            areaLineColumnFields: "areaLineColumnFields",
            pieColumnFields: "pieColumnFields",
            tableFields: "tableFields",
            radarFields: "radarFields",
            CountBoxData: "countBox",
            title: "title",
            table: "table",
        }),
        currentProperties() {
            if (
                this.elementType === "AreaChart" ||
                this.elementType === "LineChart" ||
                this.elementType === "ColumnChart"
            ) {
                return {
                    axis: this.areaLineColumnFields.axis,
                    lines: this.areaLineColumnFields.lines,
                    type: this.elementType,
                    chart_title: this.title,
                    table: this.table
                };
            }
            if (
                this.elementType === "PieChart" ||
                this.elementType === "FunnelChart" ||
                this.elementType === "TreeMapChart"
            ) {
                return {
                    value: this.pieColumnFields.value,
                    title: this.pieColumnFields.title,
                    type: this.elementType,
                    chart_title: this.title,
                    table: this.table
                };
            }
            if (this.elementType === "DataTable") {
                return {
                    values: this.tableFields.values,
                    type: this.elementType,
                    chart_title: this.title,
                    table: this.table
                };
            }
            if (this.elementType === "RadarChart") {
                return {
                    values: this.radarFields.values,
                    type: this.elementType,
                    chart_title: this.title,
                    table: this.table
                };
            }
            if (this.elementType === "countBox") {

                return {
                    bgColor: this.CountBoxData.bgColor,
                    countFields: this.CountBoxData.countFields,
                    icon: this.CountBoxData.icon,
                    link: this.CountBoxData.link,
                    linkTitle: this.CountBoxData.linkTitle,
                    textColor: this.CountBoxData.textColor,
                    type: this.elementType,
                    chart_title: this.title,
                    table: this.table
                };
            }
        },
        lang() {
            const labels = ['_save','enter_name'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('chart.' + labels[i]);
                return obj;
            }, {});
        },
    }
};
</script>
