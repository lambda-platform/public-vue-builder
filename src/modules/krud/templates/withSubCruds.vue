<template>
    <section class="offcanvas-template">
        <div class="crud-page">
            <portal to="header-left" v-if="withoutHeader">

                <h3>{{title}}</h3>

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
                        {{lang._add}}
                    </Button>
                </div>

                <div v-else :class="`crud-page-header-left ${hasNavSlot ? '' : 'no-nav'}`">
                    <h3 v-if="$props.title != null">{{ $props.title.replace('-', ' ') }}</h3>
                    <span v-if="permissions ? permissions.c : true" class="divider"></span>
                    <Button v-if="permissions ? permissions.c : true" type="success"
                            @click="openSlidePanel = true; editMode = false;" shape="circle" size="small"
                            icon="md-add">
                        {{lang._add}}
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
                              :onRowSelect="$props.onRowSelect"
                              :permissions="permissions"
                              :page_id="page_id"
                              :custom_condition="$props.custom_condition? $props.custom_condition :null"
                              :user_condition="user_condition ? user_condition.gridCondition : null">
                    </datagrid>
                </div>
            </div>

            <slide-panel v-model="openSlidePanel" :widths="[form_width ? form_width :'600px']"
                         @close="coleSidePanel" :closeByBtn="true" :withCrudLog="withCrudLog">
                <div :class="withCrudLog && editMode ? 'with-crud-log' : ''">
                    <div class="dataform-header">
                        <h3>{{ title }}</h3>
                    </div>
                    <Tabs :value="selectedTab" class="crud-tabs">
                        <TabPane :label="main_tab_title" name="0">
                            <dataform ref="form" :schemaID="form"
                                      :url="url"
                                      :editMode="editMode"
                                      :onSuccess="onSuccess"
                                      :onReady="onReady"
                                      :do_render="openSlidePanel"
                                      :permissions="permissions"
                                      :page_id="page_id"
                                      :user_condition="user_condition ? user_condition.formCondition : null"
                                      :onError="onError"></dataform>
                            <crud-log v-if="withCrudLog && editMode" :form="form" :rowId="rowId" :grid="grid"/>
                        </TabPane>
                        <TabPane :label="subCrud.title" :name="`${index + 1}`" v-for="(subCrud, index) in subCruds" :key="index" :disabled="!editMode">
                            <div class="sub-cruds" v-if="editMode && rowId !== null">
                                <div class="sub-descriptiom"  v-html="subCrud.description"></div>

                                <div class="crud-section" v-for="section in subCrudSection.filter(sec=>sec.parint_id == subCrud.id)" :key="section.key" v>
                                    <legend >{{section.sesction_title}}</legend>

                                    <sub-crud v-for="(crud, cindex) in subCrudFormGrid.filter(c=>c.section_code == section.section_code && c.parent_id == section.parint_id)"

                                              :key="cindex"
                                              :order="cindex"
                                              :crud="crud"
                                              :permissions="permissions"
                                              :page_id="page_id"
                                              :parentID="rowId"
                                              :user_condition="user_condition"
                                              :form_width="form_width"

                                    />

                                </div>
                            </div>
                        </TabPane>

                    </Tabs>
<!--                    <portal-target name="sub-forms" multiple />-->
                </div>
            </slide-panel>
        </div>
    </section>
</template>

<script>
import slidePanel from "../components/slidePanel";
import crudLog from "../components/crudLog";
import subCrud from "../components/subCrud";
import mixins from "./mixins";
export default {
    mixins: [mixins],
    data() {
        return {
            form_width: 800,
            openSlidePanel: false,
            exportLoading:false,
            selectedTab:"0",
            subCrudFormGrid:window.init.subCrudFormGrid,
            subCrudSection:window.init.subCrudSection,
            subCruds:window.init.subCruds,
        };
    },
    components: {
        "slide-panel": slidePanel,
        "crud-log": crudLog,
        "sub-crud": subCrud,
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
        url(){
            if(this.projects_id !== null && this.projects_id != "" && this.projects_id != undefined){
                if(window.init.microserviceSettings){
                    if(window.init.microserviceSettings.length >= 1){
                        let si = window.init.microserviceSettings.findIndex(set=>set.project_id == this.projects_id);
                        if(si >= 0){
                            return  window.init.microserviceSettings[si].production_url;
                        }
                    }
                }
            }
            return "";
        }
    },
    methods: {
        templateEdit() {
            this.openSlidePanel = true;
        },
        templateOnSuccess(formData) {
            this.rowId = formData["id"];
            this.editMode = true;
            this.$refs.form.editModel(this.rowId);
        },
        templateOnError() {
            // this.openSlidePanel = false;
        },
        onReady(formOption) {

            this.form_width = formOption.width;

        },
        coleSidePanel(){
            this.openSlidePanel = false;
            this.rowId = null;
        }
    },
};
</script>
