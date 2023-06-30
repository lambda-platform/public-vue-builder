<template>
    <section class="offcanvas-template">
        <div class="crud-page">
            <portal to="header-left" v-if="withoutHeader">
                <h3>{{ title }}</h3>

                <span v-if="permissions ? permissions.c : true" class="divider"></span>

                <Button v-if="permissions ? permissions.c : true" type="success"
                        @click="openSlidePanel = true; editMode = false;" shape="circle" size="small"
                        icon="md-add">
                    {{ lang._add }}
                </Button>
            </portal>

            <portal to="header-right" v-if="withoutHeader">
                <krudtools :search="search"
                           :refresh="refresh"
                           :exportExcel="exportExcel"
                           :importExcel="importExcel"
                           :exportLoading="exportLoading"
                           :print="print"
                           :save="save"
                           :isPrint="isPrint"
                           :isExcel="isExcel"
                           :isExcelUpload="isExcelUpload"
                           :excelUploadCustomUrl="excelUploadCustomUrl"
                           :excelUploadMethod="excelUploadMethod"
                           :isRefresh="isRefresh"
                           :isSave="isSave"
                />
            </portal>

            <div class="crud-page-header" v-if="!withoutHeader">
                <div v-if="hasNavSlot" class="crud-page-header-left">
                    <slot name="nav"></slot>
                    <span v-if="permissions ? permissions.c : true" class="divider"></span>
                    <Button v-if="permissions ? permissions.c : true" type="success"
                            @click="openSlidePanel = true; editMode = false;" shape="circle" size="small"
                            icon="md-add">
                        {{ lang._add }}
                    </Button>
                </div>

                <div v-else :class="`crud-page-header-left ${hasNavSlot ? '' : 'no-nav'}`">
                    <h3 v-if="$props.title != null">{{ $props.title.replace('-', ' ') }}</h3>
                    <span v-if="permissions ? permissions.c : true" class="divider"></span>
                    <Button v-if="permissions ? permissions.c : true"
                            @click="openSlidePanel = true; editMode = false;" type="success" shape="circle" size="small"
                            icon="md-add">
                        {{ lang._add }}
                    </Button>

                </div>

                <div class="crud-page-header-right">
                    <div class="tooloptions">
                        <slot name="tooloptions"></slot>
                    </div>
                    <krudtools :search="search"
                               :refresh="refresh"
                               :exportExcel="exportExcel"
                               :exportLoading="exportLoading"
                               :print="print"
                               :save="save"
                               :isPrint="isPrint"
                               :isExcel="isExcel"
                               :isExcelUpload="isExcelUpload"
                               :excelUploadMethod="excelUploadMethod"
                               :excelUploadCustomUrl="excelUploadCustomUrl"
                               :isRefresh="isRefresh"
                               :isSave="isSave"
                               :isSearch="isSearch"
                    />
                    <Button v-if="exportSelectedRows" @click="exportByPath" :disabled="selectedData.length < 1"
                            type="success" shape="circle" size="small">{{ exportLabel }}
                    </Button>
                    <slot name="right"></slot>

                </div>
            </div>

            <div class="crud-page-body">
                <div class="v-nav" v-if="hasVNavSlot">
                    <slot name="v-nav"></slot>
                </div>
                <div class="dg-flex">
                    <datagrid v-if="permissions ? permissions.r : true" ref="grid"
                              :url="url"
                              :schemaID="grid"
                              :paginate="50"
                              :fnClone="clone"
                              :fnEdit="edit"
                              :fnQuickEdit="quickEdit"
                              :fnView="view"
                              :actions="$props.actions"
                              :dblClick="$props.dbClickAction"
                              :onRowSelect="onRowSelectedEvent"
                              :hasSelection="hasSelection"
                              :permissions="permissions"
                              :page_id="page_id"
                              :custom_condition="$props.custom_condition? $props.custom_condition :null"
                              :user_condition="user_condition ? user_condition.gridCondition : null">
                    </datagrid>
                </div>
            </div>

            <slide-panel v-model="openSlidePanel" :widths="[form_width ? form_width :'1024px']"
                         @close="coleSidePanel" :closeByBtn="true" :withCrudLog="withCrudLog">
                <div :class="withCrudLog && editMode ? 'with-crud-log' : ''" style="height: 100%">
                    <dataform ref="form"
                              :schemaID="form"
                              :title="title"
                              :url="url"
                              :editMode="editMode"
                              mode="refresh"
                              :onSuccess="onSuccess"
                              :onReady="onReady"
                              :do_render="openSlidePanel"
                              :permissions="permissions"
                              :page_id="page_id"
                              :user_condition="user_condition ? user_condition.formCondition : null"
                              :onError="onError"
                              :close="coleSidePanel"
                    />
                    <crud-log v-if="withCrudLog && editMode" :form="form" :rowId="rowId" :grid="grid"/>
                </div>
            </slide-panel>
        </div>
    </section>
</template>

<script>
import slidePanel from "../components/slidePanel";
import crudLog from "../components/crudLog";
import mixins from "./mixins";

export default {
    mixins: [mixins],
    data() {
        return {
            form_width: '800px',
            openSlidePanel: false,
            exportLoading: false
        };
    },
    created() {

    },
    components: {
        "slide-panel": slidePanel,
        "crud-log": crudLog,
    },
    computed: {
        lang() {
            const labels = [
                '_add',
                'Information_viewing_history', 'excelUpload'
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('crud.' + labels[i]);
                return obj;
            }, {});
        },

    },
    methods: {
        templateEdit() {
            this.openSlidePanel = true;
        },
        templateOnSuccess() {
            this.openSlidePanel = false;
        },
        templateOnError() {
            // this.openSlidePanel = false;
        },
        onReady(formOption) {
            if (formOption.width.includes("%")) {
                this.form_width = formOption.width;
            } else {
                if (!formOption.width.includes("px")) {
                    this.form_width = formOption.width + 'px';
                }
            }
        },
        coleSidePanel() {
            this.openSlidePanel = false;
            this.rowId = null;
        }
    },
};
</script>
