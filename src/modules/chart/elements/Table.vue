<template>
    <div class="line">
        <div id="table" style="width: 100%; height: 100%">
            <h5>{{chart_title}}</h5>
            <Table :columns="columns" height="300" :data="elementData"></Table>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    props: ["values", "type", "chart_title"],
    methods: {
        getSeries() {},
        callData() {
            this.columns = [];
            this.elementData = [];
            if (this.values.length >= 1) {
                this.values.map(va => {
                    this.columns.push({
                        key: va.name,
                        title: va.title
                    });
                });
                if (this.values.length >= 1) {
                    axios
                        .post("/ve/get-data-table", { values: this.values })
                        .then(response => {
                            this.elementData = response.data;
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            } else {
            }
        }
    },
    mounted() {
        this.callData();
    },
    data() {
        return {
            columns: [],
            elementData: [],
            instance: null
        };
    },
    watch: {
        type: function(val) {
            this.initChart();
        },
        values: function(val) {
            this.callData();
        }
    }
};
</script>
