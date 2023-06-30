<template>
    <div class="crud-page-header-right-inside">
        <!--        <Tooltip content="Устсан мэдээлэл харах">-->
        <!--            <Button ghost class="crud-tool" icon="eye-disabled" @click="refreshGrid"></Button>-->
        <!--        </Tooltip>-->
        <!--        -->

        <Tooltip :content="lang._save">
            <a @click="$props.save" class="btnLine" v-if="isSave">
                <i class="ti-save"></i>
            </a>
        </Tooltip>

        <Tooltip :content="lang.re_call">
            <a @click="$props.refresh" class="btnLine" v-if="isRefresh">
                <i class="ti-reload"></i>
            </a>
        </Tooltip>

        <Tooltip :content="lang._print" v-if="isPrint">
            <a @click="$props.print" class="btnLine">
                <i class="ti-printer"></i>
            </a>
        </Tooltip>

        <Tooltip :content="lang.excelUpload" v-if="isExcelUpload">
            <a v-if="$props.excelUploadCustomUrl" :href="$props.excelUploadCustomUrl" class="btnLine">
                <i class="ti-layers"></i>
            </a>
            <a v-else @click="$props.excelUploadMethod" class="btnLine">
                <i class="ti-layers"></i>
            </a>
        </Tooltip>

        <Tooltip :content="lang.download_file" v-if="isExcel">
            <a class="btnLine" href="javascript:void(0)" v-if="$props.exportLoading">
                <Spin>
                    <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
                </Spin>
            </a>
            <a @click="$props.exportExcel" v-else class="btnLine">
                <i class="ti-download"></i>
            </a>
        </Tooltip>

        <form v-if="isSearch" @submit="searchGrid">
            <div class="right-search">
                <input v-model="searchModel" :placeholder="$static_words ? $static_words.search : 'Хайх...'"
                       class="right-search-input"/>
                <i class="ti-search"></i>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    props: ["refresh", "exportExcel", "print",
        "search", "save", "options", "isExcel",
        "isExcelUpload", "excelUploadCustomUrl", "excelUploadMethod",
        "isPrint", "isRefresh",
        "isSave", "isSearch", "exportLoading"],
    data() {
        return {
            searchModel: null
        }
    },
    computed: {
        lang() {
            const labels = [
                '_save',
                're_call',
                '_print',
                'download_file',
                'excelUpload'
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('crud.' + labels[i]);
                return obj;
            }, {});
        },
    },
    methods: {
        searchGrid(e) {
            e.preventDefault();
            this.$props.search(this.searchModel);
        },
    }
};
</script>
