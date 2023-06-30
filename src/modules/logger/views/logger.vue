<template>
    <section class="page log-page">
        <div class="log-filter">
            <div class="log-title">
                Хандалтын лог
            </div>
            <div class="log-filter-action">
                <span>Огноо:</span>
                <DatePicker type="date" size="small" v-model="filterModel.start" @on-change="getStartDateValue" placeholder="Эхлэх огноо"
                            style="width: 150px"></DatePicker>
                <span> - </span>
                <DatePicker size="small" type="date" v-model="filterModel.end" @on-change="getEndDateValue" placeholder="Дуусах огноо"
                            style="width: 150px"></DatePicker>
                <span></span>
                <Button type="primary" size="small" @click="fetchData">Шүүх</Button>
            </div>
        </div>

        <div class="log-table">
            <ag-grid-vue style="width: 100%; height: 100%;"
                         class="ag-theme-balham"
                         :gridOptions="gridOptions"
                         :columnDefs="columnDefs"
                         :rowData="rowData"
                         :overlayLoadingTemplate="overlayLoadingTemplate"
                         @grid-ready="onGridReady"
                         :defaultColDef="{
                                    sortable: true,
                                    resizable: true,
                                    filter: true}">
            </ag-grid-vue>
        </div>
    </section>
</template>

<script>
    import io from "socket.io-client";
    import {AgGridVue} from "ag-grid-vue";
    import {getDate} from "./utils/date";
    let host = window.init.mongodb_log_host;
    const socket = io(host);

    export default {
        components: {
            AgGridVue
        },

        data() {
            return {
                gridApi: null,
                gridOptions: {
                    debug: false,
                    floatingFilter: true,
                    suppressMultiSort: true,
                    suppressRowClickSelection: true,
                    allowContextMenuWithControlKey: true,
                    animateRows: false,
                    suppressCellSelection: true,
                    groupIncludeFooter: false,
                    groupIncludeTotalFooter: false,
                    suppressNoRowsOverlay: true,
                },
                columnDefs: null,
                rowData: [],
                page: 1,
                sort: 'time',
                sortDir: 'desc',
                filterModel: {
                    start: '',
                    end: ''
                },
                overlayLoadingTemplate:
                    '<span class="ag-overlay-loading-center">Түр хүлээнэ үү...</span>',
            };
        },

        beforeMount() {
            this.columnDefs = [
                {
                    headerName: '#',
                    field: 'id',
                    width: 50,
                    filter: "agTextColumnFilter",
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                {
                    headerName: 'Цаг',
                    field: 'time',
                    width: 150,
                    filter: "agDateColumnFilter",
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                {
                    headerName: 'Зарын ID',
                    field: 'advert_id',
                    width: 120,
                    filter: "agTextColumnFilter",
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                {
                    headerName: 'Код', field: 'status',
                    width: 70,
                    filter: "agTextColumnFilter",
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                {headerName: 'Ирсэн хүсэлт', field: 'input'},
                {headerName: 'Буцаасан хариу', field: 'output'},
                {
                    headerName: 'Холбоос',
                    field: 'url',
                    width: 150,
                    filter: "agTextColumnFilter",
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                {
                    headerName: 'Тайлбар',
                    field: 'url_desc',
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                // {headerName: 'Параметр', field: 'query_string'},
                {
                    headerName: 'Хэрэглэгч',
                    field: 'name',
                    width: 150,
                    filter: "agTextColumnFilter",
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                {
                    headerName: 'Хэрэглэгч ID',
                    field: 'user_id',
                    width: 80,
                    filter: "agTextColumnFilter",
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                {
                    headerName: 'Хэрэглэгч имэйл',
                    field: 'email',
                    width: 150,
                    filter: "agTextColumnFilter",
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                {
                    headerName: 'Зарын код',
                    field: 'advert_code',
                    width: 120,
                    filter: "agTextColumnFilter",
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                {
                    headerName: 'IP',
                    field: 'ip',
                    width: 110,
                    filter: "agTextColumnFilter",
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                {
                    headerName: 'Хугацаа',
                    field: 'duration',
                    width: 90,
                    filter: "agTextColumnFilter",
                    filterParams: {
                        newRowsAction: "keep",
                    }
                },
                {headerName: 'Хандсан төхөөрөмж', field: 'user_agent'},
            ];
        },

        mounted() {
            socket.on("log", (o) => {
                this.rowData.unshift(o);
            });

            let d = new Date();
            Vue.set('filterModel', 'start', this.getStartDateValue(d))
            // this.filterModel.start = this.getStartDateValue(d);
        },

        methods: {
            onGridReady(params) {
                this.gridApi = params.api;
                this.fetchData();
            },

            fetchData() {
                console.log('called');
                this.gridApi.showLoadingOverlay();

                // if(this.filterModel.start.length > 10) {
                //     this.filterModel.start = this.filterModel.start.substr(0, 10);
                // }
                // if(this.filterModel.end.length > 10) {
                //     this.filterModel.end = this.filterModel.end.substr(0, 10);
                // }

                axios.post(`${host}/log`, this.filterModel)
                    .then(({data}) => {
                        this.rowData = data;
                        setTimeout(() => {
                            this.gridApi.hideOverlay();
                        }, 1000);
                    });
            },

            onSortChanged(event) {
                let sortModel = event.api.getSortModel()[0];
                if (typeof sortModel !== "undefined") {
                    this.sort = sortModel.colId;
                    this.sortDir = sortModel.sort;
                    this.fetchData();
                }
            },

            onFilterChanged(event) {
                this.filter = event.api.getFilterModel();
                this.fetchData();
            },

            getStartDateValue(value){
                if (!(typeof value === "string" || value instanceof String)) {
                    this.filterModel.start = getDate(value);
                }else{
                    this.filterModel.start = value;
                }
            },

            getEndDateValue(value){
                if (!(typeof value === "string" || value instanceof String)) {
                    this.filterModel.end = getDate(value);
                }else{
                    this.filterModel.end = value;
                }
            }
        }
    };
</script>

