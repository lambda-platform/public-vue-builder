<template>
    <i-table :loading="aggregations.loading" :columns="columns_mirror" :data="data" size="small"
             v-if="columns_mirror.length >= 1">
    </i-table>
</template>

<script>
    import {getNumber} from "./utils/number.js";

    export default {
        props: ["aggregations", "columns"],
        components: {},
        data() {
            return {
                data: [],
                columns_mirror: []
            };
        },
        methods: {
            init() {
                console.log("grid footer:", this.aggregations);
                console.log("grid footer:", this.aggregations.columnAggregations);
                if (this.aggregations.columnAggregations.length >= 1) {
                    document.getElementsByClassName(
                        "ivu-table-footer"
                    )[0].style.height =
                        "32px";

                    let a_columns = this.columns.map(column => {
                        return {
                            key: column.key,
                            title: column.title,
                            width: column.width ? column.width : undefined
                        };
                    });
                    let data = this.aggregations.data;

                    this.columns_mirror = [];
                    let columns_mirror = [];
                    if (data.length >= 1) {
                        a_columns.map(column => {
                            column.title = " ";
                            let index_a = this.aggregations.columnAggregations.findIndex(
                                columnAggregation =>
                                    columnAggregation.column == column.key
                            );

                            if (index_a >= 0) {
                                let data_key =
                                    this.aggregations.columnAggregations[index_a]
                                        .aggregation +
                                    "_" +
                                    this.aggregations.columnAggregations[index_a]
                                        .column;
                                column.title =
                                    getNumber(data[0][data_key]) +
                                    this.aggregations.columnAggregations[index_a]
                                        .symbol;
                            }
                            columns_mirror.push({...column});
                        });
                        this.$data.columns_mirror = columns_mirror;
                    }
                } else {
                    document.getElementsByClassName(
                        "ivu-table-footer"
                    )[0].style.height =
                        "0";
                }
            }
        },
        computed: {
            data__() {
                return this.aggregations.data;
            }
        },
        mounted() {
            this.init();
        },
        watch: {
            data__() {
                this.init();
            }
        }
    };
</script>


