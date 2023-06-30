import {localeText} from "./agMN.js";

export const data = (vm) => {
    return {
        computed:{
            lang(){
                const labels = ['pleaseWaitForLoading', ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataGrid.' + labels[i]);
                    return obj;
                }, {});
            }
        },
        isLoading: true,
        identity: "id",
        overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Түр хүлээнэ үү</span>',
        init: false,
        model: null,
        template: 2,
        theme: 'normal',
        gridTheme: 'material',
        isClient: false,
        isPrint: false,
        isNumbered: false,
        printSize: 'A4',
        sideBar: false,
        header: null,
        tableWidth: null,
        fullWidth: false,
        fullText: false,
        editableAction: null,
        editType: null,
        editCellValue: null,
        editRowValue: null,
        postModels: [],
        updateModels: [],
        cellStatus: '',
        singleClickEdit: true,
        flashChanges: false,
        editableShouldSubmit: false,
        defaultColDef: {
            sortable: true,
            resizable: true,
            filter: true,
            floatingFilter: false
        },
        gridOptions: {
            debug: false,
            floatingFilter: false,
            suppressMultiSort: true,
            suppressRowClickSelection: true,
            allowContextMenuWithControlKey: true,
            animateRows: false,
            localeText: localeText,
            suppressCellFocus: true,
            groupIncludeFooter: false,
            groupIncludeTotalFooter: false,
            suppressNoRowsOverlay: true,
            // enableCharts: true,
            // enableRangeSelection: true
        },
        info: {
            total: 0,
            totalPage: 0
        },
        query: {
            src: "",
            paginate: 1000,
            currentPage: vm.$route.query.dp ? parseInt(vm.$route.query.dp) : 1,
            sort: "",
            order: ""
        },
        gridActions: [],
        hasContextMenu: false,
        actionPosition: 0,
        schema: [],
        formula: [],
        aggregations: {
            columnAggregations: [],
            columnAggregationsFormula: [],
            data: [],
            loading: true,
            forumlaResult: ""
        },
        columns: null,
        data: [],
        filterModel: {},
        searchModel: null,
        isStatic: false,
        //for header filter
        selectionMethod: 'multiple',
        selected: [],
        autoSelect: false,
        autoSelectModel: null,
        deleteModal: false,
        delLoading: false,
        currentRow: {
            rowId: null,
            rowIndex: null
        },
        frameworkComponents: null,
        changedRowsData: [],
        colMenu: false,
        colFilterButton: true,
        showGrid: false,
        saveFilter: false,
        selectInputModels: [],
        // updateDisableField:null,
        // updateDisableFieldValue:null
    }
}


export const builderData = (vm) => {
    return {
        loading: true,
        scrollOptions: {
            height: '100%',
            size: 7,
            alwaysVisible: true,
            wheelStep: 5,
            color: '#2C3A47'
        },
        loadingSubmit: false,
        isModelSelected: false,
        gridName: null,
        datagrid: {
            model: null,
            isView: false,
            identity: null,
            actions: ["e", "d"],
            actionPosition: 0,
            isContextMenu: false,
            staticWidth: false,
            fullWidth: true,
            hasCheckbox: false,
            isClient: false,
            width: 0,
            sort: null,
            sortOrder: "desc",
            softDelete: false,
            paging: 50,
            template: 0,
            schema: [],
            filter: [],
            formula: [],
            condition: null,
            columnAggregations: [],
            columnAggregationsFormula: [],
            header: {
                render: false,
                preview: false,
                structure: []
            },
            triggers: {
                namespace: '',
                beforeFetch: '',
                afterFetch: '',
                beforeDelete: '',
                afterDelete: '',
                beforePrint: '',
            },
            gridTheme: 'material',
            theme: 'normal',
            fullText: false,
            editableAction: null,
            editFullRow: false,
            editableShouldSubmit: false,
            singleClickEdit: true,
            flashChanges: false,
            colMenu: false,
            colFilterButton: true,
            showGrid: true,
            saveFilter: false,
            isExcel: true,
            isGlobalSearch: true,
        },

        fieldList: [],
        gridThemes: ['material', 'balham'],
        //Formula
        formulaForm: {
            model: "",
            template: ""
        },

        formulaRule: {
            model: [
                {
                    required: true,
                    message: "Үр дүн хадгалах талбар сонгоно уу",
                    trigger: "blur"
                }
            ],
            template: [
                {
                    required: true,
                    message: "Томъёогоо оруулна уу",
                    trigger: "blur"
                }
            ]
        },

        formulaColumns: [
            {
                title: "Томъёо",
                key: "template",
                minWidth: 200
            },
            {
                title: "Талбар",
                key: "model",
                minWidth: 150
            },
            {
                title: "Устгах",
                key: "action",
                width: 80,
                align: "center",
                render: (h, params) => {
                    return h("div", [
                        h("Button", {
                            props: {
                                type: "ghost",
                                shape: "circle",
                                icon: "android-close",
                                size: "small"
                            },
                            on: {
                                click: () => {
                                    vm.removeFormula(params.index);
                                }
                            }
                        })
                    ]);
                }
            }
        ],

        //Column Aggrigation
        aggregations: [
            "SUM",
            "COUNT",
            "MIN",
            "MAX",
            "AVG",
            "CountDistinct",
            "AvgDistinct",
            "SumDistinct"
        ],

        columnAggregationForm: {
            column: "",
            aggregation: "",
            symbol: ""
        },

        columnAggregationRule: {
            column: [
                {
                    required: true,
                    message: "Багана сонгоно уу",
                    trigger: "blur"
                }
            ],
            aggregation: [
                {
                    required: true,
                    message: "Нэгтгэл сонгоно уу",
                    trigger: "blur"
                }
            ],
            symbol: [
                {
                    required: false
                }
            ]
        },

        columnAggregationColumns: [
            {
                title: "Багана",
                key: "column",
                minWidth: 120
            },
            {
                title: "Нэгтгэл төрөл",
                key: "aggregation",
                minWidth: 150
            },
            {
                title: "Тэмдэг",
                key: "symbol",
                minWidth: 100
            },
            {
                title: "Устгах",
                key: "action",
                width: 100,
                align: "center",
                render: (h, params) => {
                    return h("div", [
                        h(
                            "Button",
                            {
                                props: {
                                    type: "ghost",
                                    shape: "circle",
                                    icon: "android-close",
                                    size: "small"
                                },
                                on: {
                                    click: () => {
                                        vm.removeColumnAggergation(
                                            params.index
                                        );
                                    }
                                }
                            },
                            "Устгах"
                        )
                    ]);
                }
            }
        ],

        //Column Aggrigation's Formula
        columnAggregationsFormulaForm: {
            title: "",
            template: "",
            symbol: ""
        },

        columnAggregationsFormulaRule: {
            template: [
                {
                    required: true,
                    message: "Томъёогоо оруулна уу",
                    trigger: "blur"
                }
            ],
            symbol: [
                {
                    required: false
                }
            ],
            title: [
                {
                    required: false
                }
            ]
        },

        columnAggregationsFormulaColumns: [
            {
                title: "Нэр",
                key: "title",
                minWidth: 100
            },
            {
                title: "Томъёо",
                key: "template",
                minWidth: 300
            },
            {
                title: "Тэмдэг",
                key: "symbol",
                minWidth: 200
            },
            {
                title: "Устгах",
                // title: "Устгах",
                key: "action",
                width: 100,
                align: "center",
                render: (h, params) => {
                    return h("div", [
                        h(
                            "Button",
                            {
                                props: {
                                    type: "ghost",
                                    shape: "circle",
                                    icon: "android-close",
                                    size: "small"
                                },
                                on: {
                                    click: () => {
                                        vm.removeColumnAggregationsFormula(
                                            params.index
                                        );
                                    }
                                }
                            },
                            "Устгах"
                        )
                    ]);
                }
            }
        ],

        excelImportForm: {
            excelFile: null,
            rowToRead: 0,
            customUrl:null
        },
    }
};


export const tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{header}{rows}</table></body></html>'
        , base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        }
        , format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };
    return function (header, rows, name) {

        var ctx = {worksheet: name || 'Worksheet', header: header, rows: rows};

        var a = document.createElement("a");
        a.download = name + ".xls";
        a.href = uri + base64(format(template, ctx));


        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
    }
})();

// export default {
//     computed: {
//         lang(){
//             const labels = ['delete',
//             ];
//             return labels.reduce((obj, key, i) => {
//                 obj[key] = this.$t('dataGrid.' + labels[i]);
//                 return obj;
//             }, {});
//         },
//     },
// };
