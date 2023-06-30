<template>
    <div class="subform-grid">
        <FormItem :label=label :prop=rule>
            <div class="subform-header" >
                {{ meta.GSOption.sourceGridModalTitle }}

            </div>
            <table border="1" v-if="meta.GSOption">
                <thead>
                <tr v-if="meta.GSOption.sourceGridTargetColumns && meta.GSOption.sourceGridTargetColumns instanceof Array">

                    <th v-for="(sourceGridTargetColumn, cindex) in meta.GSOption.sourceGridTargetColumns.filter(c=>c!== null)"
                        :key="cindex">
                        {{ sourceGridTargetColumn.label }}
                    </th>
                    <th class="action">...</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="meta.GSOption.sourceGridTargetColumns && meta.GSOption.sourceGridTargetColumns instanceof Array">

                    <td v-for="(sourceGridTargetColumn, cindex) in meta.GSOption.sourceGridTargetColumns.filter(c=>c!== null)"
                        :key="cindex">
                        {{selectedRow[sourceGridTargetColumn.model]}}
                    </td>
                    <td class="action">
                        <a href="javascript:void(0);" @click="showAddSourceModal" v-if="!meta.disabled">
                            <Icon type="md-search" />
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </FormItem>

        <paper-modal
            :name="`grid-modal-${meta.GSOption.sourceGridID}`"
            class="form-modal"
            :min-width="200"
            :min-height="100"
            :pivot-y="0.5"
            :adaptive="true"
            :reset="true"
            :draggable="true"
            :resizable="true"
            draggable=".form-tool"
            width="85%"
            height="85%"
        >
            <section class="form-modal source-grid">
                <div class="form-tool ">

                    <h4>{{ meta.GSOption.sourceGridModalTitle }}</h4>
                    <div class="form-tool-actions">
                        <a href="javascript:void(0)" @click="closeSourceModal">
                            <i class="ti-close"></i>
                        </a>
                    </div>
                </div>

                <div class="form-body" v-if="modal_grid_show">

                    <div v-if="meta.GSOption.sourceGridTitle && meta.GSOption.sourceGridDescription" class="source-grid-description">
                        <h3>
                            {{meta.GSOption.sourceGridTitle}}
                        </h3>
                        <p v-html="meta.GSOption.sourceGridDescription">

                        </p>
                    </div>
                    <datagrid
                        :schemaID="meta.GSOption.sourceGridID"
                        :url="sourceGridUrl()"
                        :onRowSelect="onRowSelect"
                        :paginate="50"
                        :hasSelection="true"
                        :gridSelector="true"
                        :user_condition="user_condition"
                        :permissions="{
                          c:false,
                          r:true,
                          u:false,
                          d:false,
                      }"
                    />
                    <div class="add-from-pre-source">
                        <Button shape="circle" type="success" size="small" @click="addFromPreSource" :disabled="preSource.length == 0" icon="md-add"
                                class="sub-form-add-btn">Сонгох</Button>
                    </div>
                </div>
            </section>
        </paper-modal>
    </div>
</template>

<script>

export default {
    props: ["model", "rule", "label", "meta"],
    data() {
        return {
            preSource:[],
            modal_grid_show: false,
            user_condition:null,
            selectedRow:{}
        };
    },

    computed: {
        value() {
            return this.model.form[this.model.component];


        },
    },

    watch: {
        value(value, oldValue){
            if(this.value === null || this.value === 0 || this.value === ""){
                this.selectedRow = {}
            }
            if (value && !oldValue){
                if(Object.keys(this.selectedRow).length ==0){
                  this.callRowData();
                }

            }
        }
    },

    mounted() {
        if(this.meta.GSOption.sourceGridUserCondition !== undefined && this.meta.GSOption.sourceGridUserCondition !== null && this.meta.GSOption.sourceGridUserCondition != ""){
            this.user_condition = JSON.parse(this.meta.GSOption.sourceGridUserCondition)
        }
    },

    methods: {
        callRowData(){

            let filter = {}

            filter[this.meta.GSOption.sourceGridValueField] = this.value;

            axios.post(`${this.sourceGridUrl()}/lambda/puzzle/grid/data/${this.meta.GSOption.sourceGridID}?&paginate=1&page=1&sort=id&order=desc`, filter).then(({data})=>{

               if(data.data.length >= 1){
                   this.selectedRow = data.data[0];
               }

            })
        },
        onRowSelect(rows){
            this.preSource = rows;
        },
        sourceGridUrl(){

            if(window.init.microserviceSettings) {
                let si = window.init.microserviceSettings.findIndex(set=>set.project_id == this.meta.GSOption.sourceMicroserviceID);

                if(si >= 0){
                    return  window.init.microserviceSettings[si].production_url;
                } else {
                    return ""
                }
            } else {
                return ""
            }
        },
        showAddSourceModal() {
            this.modal_grid_show = true;
            this.$modal.show(`grid-modal-${this.meta.GSOption.sourceGridID}`);
        },
        closeSourceModal() {
            this.modal_grid_show = false;
            this.$modal.hide(`grid-modal-${this.meta.GSOption.sourceGridID}`);
        },
        addFromPreSource(){
            this.selectedRow = {}
            if(this.preSource && this.meta.GSOption.sourceGridTargetColumns){
                if(this.preSource.length >= 1){
                    this.selectedRow = this.preSource[0];

                    this.model.form[this.model.component] = this.selectedRow[this.meta.GSOption.sourceGridValueField]
                }

            }
            this.closeSourceModal();

        },

    }
};
</script>


