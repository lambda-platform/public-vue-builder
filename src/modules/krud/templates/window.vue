<template>
    <section class="window-template">
        <div class="crud-page">
            <portal to="header-left" v-if="withoutHeader">

                <h3>{{ title }}</h3>

                <span v-if="permissions ? permissions.c : true" class="divider"></span>

                <Button v-if="permissions ? permissions.c : true" type="success"
                        @click="openForm" shape="circle" size="small"
                        icon="md-add">{{ lang._add }}</Button>
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
                           :isRefresh="isRefresh"
                           :isSave="isSave"
                           :isSearch="isSearch"
                />
            </portal>

            <div v-if="!withoutHeader">
                <!-- List mode -->
                <div class="crud-page-header" v-if="$route.query.window != 'form'">
                    <div v-if="hasNavSlot" class="crud-page-header-left">
                        <slot name="nav"></slot>
                        <span v-if="permissions ? permissions.c : true" class="divider"></span>
                        <Button v-if="permissions ? permissions.c : true" type="success"
                                @click="openForm" shape="circle" size="small"
                                icon="md-add">
                            {{ lang._add }}}
                        </Button>
                    </div>

                    <div v-else :class="`crud-page-header-left ${hasNavSlot ? '' : 'no-nav'}`">
                        <h3 v-if="$props.title != null">{{ $props.title.replace('-', ' ') }}</h3>
                        <span v-if="permissions ? permissions.c : true" class="divider"></span>
                        <Button v-if="permissions ? permissions.c : true" type="success"
                                @click="openForm" shape="circle" size="small"
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
                                   :isRefresh="isRefresh"
                                   :isSave="isSave"
                        />
                        <slot name="right"></slot>
                    </div>
                </div>
            </div>

            <dataform v-if="$route.query.window === 'form'" ref="form" :schemaID="form"
                      :editMode="editMode"
                      :onSuccess="onSuccessWindow"
                      :onReady="onReady"
                      :do_render="openSlidePanel"
                      :permissions="permissions"
                      :page_id="page_id"
                      template="window"
                      :user_condition="user_condition ? user_condition.formCondition : null"
                      :onError="onError"/>

            <div v-else class="crud-page-body">
                <div class="v-nav" v-if="hasVNavSlot">
                    <slot name="v-nav"></slot>
                </div>
                <div class="dg-flex">
                    <datagrid v-if="permissions ? permissions.r : true" ref="grid"
                              :schemaID="grid"
                              :paginate="50"
                              :fnClone="clone"
                              :fnEdit="edit"
                              :fnQuickEdit="quickEdit"
                              :fnView="view"
                              :actions="$props.actions"
                              :dblClick="$props.dbClickAction"
                              :onRowSelect="$props.onRowSelect"
                              :permissions="permissions"
                              :page_id="page_id"
                              :custom_condition="$props.custom_condition? $props.custom_condition :null"
                              :user_condition="user_condition ? user_condition.gridCondition : null">
                    </datagrid>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import crudLog from "../components/crudLog";
import mixins from "./mixins";

export default {
    mixins: [mixins],
    data() {
        return {
            form_width: 800,
            openSlidePanel: false,
            exportLoading: false
        };
    },
    components: {
        "crud-log": crudLog
    },
    created() {
        // this.$router.push({path: this.$route.path, query: {window: 'list'}});
    },
    computed: {
        lang() {
            const labels = [
                '_add',
                'Information_viewing_history',
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
            this.form_width = formOption.width
        },
        openForm() {
            this.editMode = false;
            this.$router.push({path: this.$route.path, query: {window: 'form'}});
        }
    },
};
</script>
