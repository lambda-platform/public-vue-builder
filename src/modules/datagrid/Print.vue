<template>
    <section class="print-container">
        <div class="print-tools no-print">
            <div class="print-tools-left">
                <label>{{lang.paperSize}}</label>
                <Select v-model="pageSize" @on-change="changeCss" size="small" style="width:160px">
                    <Option disabled value="">{{lang.selectPaperSize}}</Option>
                    <Option value="A3">A3</Option>
                    <Option value="A3 landscape">A3 {{lang.landScape}}</Option>
                    <Option value="A4" selected>A4</Option>
                    <Option value="A4 landscape">A4 {{lang.landScape}}</Option>
                    <Option value="A5">A5</Option>
                    <Option value="A5 landscape">A5 {{lang.landScape}}</Option>
                </Select>
            </div>
            <div class="valut-chooser">
                <Select v-model="valute" size="small" style="width:100px">
                    <Option disabled value="" selected>{{lang.currencySelection}}</Option>
                    <Option value="MNT">{{lang.tugrug}}</Option>
                    <Option value="USD">{{lang.dollar}}</Option>
                    <Option value="EUR">{{lang.euro}}</Option>
                    <Option value="JPY">{{lang.yen}}</Option>
                    <Option value="AUD">{{lang.austDollar}}</Option>
                    <Option value="RUB">{{lang.rubli}}</Option>
                </Select>

                <Button icon="i-icon ti-printer" type="default"
                        @click="refreshData" style="margin-right: 5px">{{lang.reboot}}
                </Button>
            </div>
            <div class="print-tools-right">
                <Button v-shortkey="['ctrl', 'p']" @shortkey="printPage" icon="i-icon ti-printer" type="default"
                        @click="printPage">{{lang.print}}
                </Button>
            </div>
        </div>

        <div class="print-body" v-bind:class="[pageClass, printOnly]">
            <Spin size="large" fix v-if="isLoading"></Spin>

            <section id="printArea" class="sheet padding-5mm print-only">
                <table border="1" class="print-table">
                    <thead v-if="header != null">
                    <tr v-for="tr in computedHeader.structure" :key="tr.index">
                        <td
                            v-for="td in tr.children"
                            :key="td.index"
                            :colspan="td.colspan"
                            :rowspan="td.rowspan">
                            <div :class="td.rotate ? 'vertical-column' : ''">
                                <div>{{ td.label }}</div>
                            </div>
                        </td>
                    </tr>
                    </thead>
                    <thead v-else>
                    <tr>
                        <td
                            v-for="td in computedSchema"
                            :key="td.index"
                            :colspan="td.colspan"
                            :rowspan="td.rowspan">
                            {{ td.label }}
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="tr in data" :key="tr.index">
                        <td v-for="td in computedSchemaBody" :key="td.index">
                            <span v-html="printCell(tr, td)"></span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </section>
</template>

<script>
import axios from "axios"
import {Printd} from 'printd'
import {getPrintStyles} from "./utils/printStyles"

export default {
    props: ["schemaID", "pageSize", "header", "schema", "info", "query", "filter", "search", "isNumber"],

    data() {
        return {
            isLoading: true,
            isFalse: false,
            isTrue: true,
            total: 0,
            data: [],
            scrollOptions: {
                height: '100%',
                size: 7,
                railVisible: true,
                railOpacity: 0.2,
                alwaysVisible: true,
                wheelStep: 5,
                color: '#2C3A47'
            },
            cssText: getPrintStyles,
            templatecss: " @media print{@page {size: A4}}",
            valute: ''
        }
    },

    created() {
        this.d = new Printd();
        this.templatecss = " @media print{@page {size: " + this.pageSize + "}}";
        this.fetchPrintData();
    },

    computed: {
        lang() {
            const labels = ['type', 'selectPaperSize', 'paperSize', 'landScape', 'currencySelection', 'tugrug', 'dollar', 'euro', 'yen', 'austDollar', 'rubli',
                'reboot', 'print', '', '', '', '', '', '',

            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
        pageClass() {
            return this.pageSize;
        },

        computedSchema() {
            return this.schema.filter(td => (td.printable && !td.hide))
        },

        computedSchemaBody() {
            return this.schema.filter(td => td.printable)
        },

        printOnly() {
            return 'print-only';
        },

        computedHeader(){
            if(this.header !== null){
                return this.header.structure.map((tr) => {
                    tr.children = tr.children.filter(td => td.label!=='#');
                    return tr;
                });
            }
            return this.header;
        }
    },

    methods: {
        cssPagedMedia: (function () {
            var style = document.createElement('style');
            document.head.appendChild(style);
            return function (rule) {
                style.innerHTML = rule;
            };
        }()),

        changeCss() {
            this.templatecss = " @media print{@page {size: " + this.pageSize + "}}";
        },

        printPage() {
            this.d.print(document.getElementById('printArea'), [this.templatecss, this.cssText]);
        },
        refreshData() {
            alert(this.valute);
        },

        fetchPrintData() {
            this.isLoading = true;
            let url = `/lambda/krud/print/${this.schemaID}`;
            let filters = Object.keys(this.filter)
                .filter(e => this.filter[e] !== null)
                .reduce((o, e) => {
                    o[e] = this.filter[e];
                    return o;
                }, {});

            axios
                .post(url, filters)
                .then(({data}) => {
                    this.data = data;
                    this.isLoading = false;
                })
                .catch(e => {
                    console.log(e.message);
                    this.isLoading = false;
                });
        },

        printCell(tr, td) {
            switch (td.gridType) {
                case "Number":
                    return Number(tr[td.model]).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                case "Image":
                    return `<img src="${tr[td.model]}"/>`
                case "Html":
                    return tr[td.model];
                case "Date":
                    return tr[td.model] != null ? tr[td.model].substr(0, 10) : ''
                default:
                    return tr[td.model]
            }
        }
    }
};
</script>

<style lang="scss">
@import "scss/print.scss";
</style>
