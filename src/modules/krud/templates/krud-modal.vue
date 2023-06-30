<template>
    <section class="modal-template">
        <div class="crud-page">
            <portal to="header-left" v-if="withoutHeader">
                <h3>{{ title }}</h3>
                <span v-if="permissions ? permissions.c : true" class="divider"></span>
                <Button v-if="permissions ? permissions.c : true" type="success" @click="showModal" shape="circle"
                        size="small" icon="md-add">{{ lang._add }}
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
                            @click="showModal" shape="circle" size="small"
                            icon="md-add">
                        {{ lang._add }}}
                    </Button>
                </div>

                <div v-else :class="`crud-page-header-left ${hasNavSlot ? '' : 'no-nav'}`">
                    <h3 v-if="$props.title != null">{{ $props.title.replace('-', ' ') }}</h3>
                    <span v-if="permissions ? permissions.c : true" class="divider"></span>
                    <Button v-if="permissions ? permissions.c : true" type="success"
                            @click="showModal" shape="circle" size="small"
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
                <div class="v-nav" v-if="hasVNavSlot">
                    <slot name="v-nav"></slot>
                </div>
                <div class="dg-flex">
                    <datagrid v-if="permissions ? permissions.r : true" ref="grid"
                              :schemaID="grid"
                              :paginate="50"
                              :fnClone="clone"
                              :fnEdit="editOnModal"
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

            <paper-modal
                name="krud-modal"
                :draggable="false"
                :resizable="true"
                height="80%"
                @opened="fillModalForm"
                :width="[form_width ? form_width :'600px']">
                <dataform ref="form"
                          :schemaID="form"
                          :editMode="editMode"
                          :onSuccess="onSuccess"
                          :onReady="onReady"
                          :do_render="openSlidePanel"
                          :permissions="permissions"
                          :page_id="page_id"
                          :user_condition="user_condition ? user_condition.formCondition : null"
                          template="modal"
                          :onError="onError"/>
            </paper-modal>
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
            exportLoading: false
        };
    },
    components: {
        "crud-log": crudLog
    },
    created() {
        console.log("modal krud")
        this.$modal.show('k-modal');
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
        showModal() {
            this.$modal.show('krud-modal');
            this.editMode = false;
        },

        templateEdit() {
            this.$modal.show('krud-modal');
        },

        templateOnSuccess() {
            this.$modal.hide('krud-modal');
        },

        templateOnError() {
            // this.openSlidePanel = false;
        },

        onReady(formOption) {
            this.form_width = formOption.width
        }
    },
};
</script>
