<template>
    <i-table :loading="loading" :columns="columns_mirror" :data="data" size="small" v-if="columnAggregations.length >= 1">
    </i-table>
</template>

<script>
import expandOption from "./ExpandOption";
import { elementList } from "./elements";
import { getNumber } from "./utils/number.js";

export default {
    props: ["columns", "columnAggregations", "schemaID"],
    components: {},
    data() {
        return {
            elementList: elementList,
            loading: true,
            data: [],
            columns_mirror: []
        };
    },
    methods: {
        init() {
            if (this.columnAggregations.length >= 1) {
                document.getElementsByClassName(
                    "ivu-table-footer"
                )[0].style.height =
                    "32px";
   let columns  = JSON.parse(JSON.stringify(this.columns));
                axios
                    .post("/lambda/puzzle/grid/aggergation/" + this.schemaID)
                    .then(({ data }) => {
                        let columns_mirror = [];

                        columns.map(column => {

                            column.title = " ";
                            let index_a = this.columnAggregations.findIndex(
                                columnAggregation =>
                                    columnAggregation.column == column.key
                            );

                            if (index_a >= 0) {
                                let data_key =
                                    this.columnAggregations[index_a]
                                        .aggregation +
                                    "_" +
                                    this.columnAggregations[index_a].column;
                                column.title =
                                    getNumber(data[0][data_key]) +
                                    this.columnAggregations[index_a].symbol;
                            }
                            columns_mirror.push({ ...column });
                        });

                        this.columns_mirror = columns_mirror;
                        this.loading = false;
                    })
                    .catch(e => {
                        console.log(e.message);
                    });
            } else {
                document.getElementsByClassName(
                    "ivu-table-footer"
                )[0].style.height =
                    "0";
            }
        }
    },
    mounted() {
        this.init();
    },
    watch: {
        columnAggregations() {
            this.init();
        }
    }
};
</script>


