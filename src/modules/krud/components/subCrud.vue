<template>
    <div class="sub-crud">
        <div class="sub-title">
            <h3>{{ crud.title }}</h3>
            <Button v-if="permissions ? permissions.c : true" type="success" @click="showAddModal" shape="circle"
                    size="small" icon="md-add">
                Нэмэх
            </Button>
        </div>


        <div class="sub-grid">
            <datagrid v-if="permissions ? permissions.r : true" ref="grid"
                      :url="url"
                      :schemaID="crud.grid"
                      :paginate="50"
                      :fnEdit="edit"
                      :fnView="view"
                      :dblClick="editDB"
                      :permissions="permissions"
                      :page_id="page_id"
                      :custom_condition="condition"/>
        </div>


        <Modal
            :name="`form-modal-${crud.form}`"
            class="form-modal"
            :min-width="200"
            :min-height="100"
            :title="crud.title"
            :draggable="true"
            :footer-hide="true"
            width="800"
            height="70%"
            v-model="openSlidePanel"
        >
            <!--        <portal to="sub-forms" :order="order">-->
            <!--            <paper-modal-->
            <!--                :name="`form-modal-${crud.form}`"-->
            <!--                class="form-modal"-->
            <!--                :min-width="200"-->
            <!--                :min-height="100"-->
            <!--                :pivot-y="0.5"-->
            <!--                :adaptive="true"-->
            <!--                :reset="true"-->
            <!--                :draggable="true"-->
            <!--                :resizable="true"-->
            <!--                draggable=".form-tool"-->
            <!--                width="800"-->
            <!--                height="70%"-->
            <!--            >-->
            <section class="form-modal">
                <!--                    <div class="form-tool">-->

                <!--                        <h4>{{ crud.title }}</h4>-->
                <!--                        <div class="form-tool-actions">-->
                <!--                            <a href="javascript:void(0)" @click="coleSidePanel">-->
                <!--                                <i class="ti-close"></i>-->
                <!--                            </a>-->
                <!--                        </div>-->
                <!--                    </div>-->

                <div class="form-body">
                    <dataform ref="form" :schemaID="crud.form"
                              :url="url"
                              :editMode="editMode"
                              :onSuccess="onSuccess"
                              :onReady="onReady"
                              :do_render="openSlidePanel"
                              :permissions="permissions"
                              :page_id="page_id"
                              :formCustomData="formCustomData"
                              :onError="onError"></dataform>
                </div>
            </section>
        </Modal>
        <!--            </paper-modal>-->
        <!--        </portal>-->

    </div>
</template>

<script>


export default {
    props: ["crud", "permissions", "page_id", "user_condition", "parentID", "order"],
    name: "subCrud",
    components: {},
    data() {
        return {
            openSlidePanel: false,
            editMode: false,
            rowId: null,
        }
    },

    methods: {
        showAddModal() {
            this.openSlidePanel = true;
            this.editMode = false;
            this.rowId = null;
            this.$modal.show(`form-modal-${this.crud.form}`);
        },

        coleSidePanel() {
            this.openSlidePanel = false;
            this.rowId = null;
            this.$modal.hide(`form-modal-${this.crud.form}`);
        },
        view(id) {
            // window.open(this.view_url + id, '_blank');
            this.rowId = id;
            this.editMode = true;

            this.openSlidePanel = true;
            this.$refs.form.viewMode = true;
            this.$refs.form.editModel(id);


        },
        edit(id) {
            console.log(id);
            this.openSlidePanel = true;
            this.rowId = id;
            this.editMode = true;

            this.$refs.form.editModel(id);

        },
        editDB(row) {

            this.openSlidePanel = true;
            this.rowId = row.id;
            this.editMode = true;
            this.$refs.form.editModel(row.id);

        },
        onReady(formOption) {


            // setSchemaByModel(this.crud.form_field, "value", this.parentID);
            // setSchemaByModel(this.crud.form_field, "disabled", true);
            this.form_width = formOption.width
        },
        onSuccess(val) {

            this.$refs.grid.refresh();

            this.coleSidePanel();
        },

        onError(val) {
            console.log(val)
        }
    },
    computed: {
        condition() {
            return `${this.crud.grid_field} = ${this.parentID}`
        },
        formCustomData() {
            let data = {}
            data[this.crud.form_field] = this.parentID;
            return data;
        },
        url() {
            if (this.crud.microservice_id !== null && this.crud.microservice_id != "" && this.crud.microservice_id != undefined) {
                if (window.init.microserviceSettings) {
                    if (window.init.microserviceSettings.length >= 1) {
                        let si = window.init.microserviceSettings.findIndex(set => set.project_id == this.crud.microservice_id);
                        if (si >= 0) {
                            return window.init.microserviceSettings[si].production_url;
                        }
                    }
                }
            }
            return "";
        }
    }
}
</script>

<style scoped>

</style>
