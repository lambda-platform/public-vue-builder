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

                <portal-target name="drawer-left">
                </portal-target>
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
                    <Button v-if="permissions ? permissions.c : true" type="success"
                            @click="openSlidePanel = true; editMode = false;" shape="circle" size="small"
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

            <div class="crud-page-body">

                <div id="drawer-container">
                    <div id="left_panel">
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
                                      :onRowSelect="$props.onRowSelect"
                                      :permissions="permissions"
                                      :page_id="page_id"
                                      :custom_condition="$props.custom_condition? $props.custom_condition :null"
                                      :user_condition="user_condition ? user_condition.gridCondition : null">
                            </datagrid>
                        </div>
                    </div>
                    <div id="right_panel" ref="panel" :class="openSlidePanel ? 'show-panel' : 'hide-panel'">
                        <div class="resizer"></div>
                        <div class="dataform-header" v-if="openSlidePanel"><h3>{{ title}}</h3></div>
                        <a href="#" class="action-close" @click.prevent="hideSide" v-if="openSlidePanel">
                            <Icon type="ios-close-circle-outline" />
                        </a>

                        <dataform ref="form" :schemaID="form"
                                  :title="title"
                                  :url="url"
                                  :editMode="editMode"
                                  :onSuccess="onSuccess"
                                  :onReady="onReady"
                                  :do_render="openSlidePanel"
                                  :permissions="permissions"
                                  :page_id="page_id"
                                  :user_condition="user_condition ? user_condition.formCondition : null"
                                  :onError="onError"></dataform>

                    </div>
                </div>
            </div>


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
            form_width: 800,
            openSlidePanel: false,
            exportLoading: false,
            isResizing: false,
            m_pos: 0,
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.handleResize();
        });

    },
    components: {
        "slide-panel": slidePanel,
        "crud-log": crudLog,

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

        hideSide(){
            this.openSlidePanel = false;
            this.$refs.panel.style.width =   "0px";
            this.$refs.panel.style.flex = `0 0 0px`;
        },
        openSide(){
            this.openSlidePanel = true;
            let unit = (window.innerWidth-300)/100;
            let w= parseInt(unit*70)
            this.$refs.panel.style.width =   w + "px";
            this.$refs.panel.style.flex = `0 0 ${w + "px"}`;
        },
        resize(e) {
            window.getSelection().removeAllRanges();
            const dx = this.m_pos - e.x;
            this.m_pos = e.x;
            this.$refs.panel.style.width = (parseInt(getComputedStyle(this.$refs.panel, '').width) + dx) + "px";
            this.$refs.panel.style.flex = `0 0 ${(parseInt(getComputedStyle(this.$refs.panel, '').width) + dx) + "px"}`;
        },
        handleResize() {

            const BORDER_SIZE = 4;
            this.$refs.panel.addEventListener("mousedown", (e) => {
                if (e.offsetX < BORDER_SIZE) {
                    this.m_pos = e.x;
                    document.addEventListener("mousemove", this.resize, false);
                }
            }, false);

            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", this.resize, false);
            }, false);

        },
        templateEdit() {
            this.openSide();
        },
        templateOnSuccess() {
            this.hideSide();
        },
        templateOnError() {
            // this.openSlidePanel = false;
        },
        onReady(formOption) {
            this.form_width = formOption.width
        },
        coleSidePanel() {
            this.openSlidePanel = false;
            this.rowId = null;
        }
    },
};
</script>
