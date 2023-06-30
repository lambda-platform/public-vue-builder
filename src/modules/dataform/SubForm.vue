<template>
    <section class='form-builder'>
        <div class='fb-workspace'>
            <div class='fb-control fb-control-sub'>
                <div class='fb-control-sub-item'>
                    <Input v-model='f.name' :placeholder='lang.Form_name' />
                </div>

                <div class='fb-control-sub-item'>
                    <Select v-model='f.subtype' :placeholder='lang.Choose_type' clearable :disabled='isEdit'
                            @on-change='callForms'>
                        <Option v-for='item in subFormType' :value='item.value' :key='item.index'>
                            {{ item.label }}
                        </Option>
                    </Select>
                </div>

                <div class='fb-control-sub-item' v-if="f.subtype === 'Form'">
                    <Select v-model='f.formId' :placeholder='lang._subform' clearable
                            filterable
                            @on-change='setBuilder'>
                        <OptionGroup label='Table list'>
                            <Option v-for='item in otherForms' :value='item.id' :key='item.id'>{{ item.name }}</Option>
                        </OptionGroup>
                    </Select>
                </div>

                <div class='fb-control-sub-item' v-if="f.subtype !== 'Form'">
                    <Select v-model='f.model' :placeholder='lang.selectTable' clearable @on-change='setBuilder'
                            :disabled='isEdit'>
                        <Option v-for='item in tableList' :value='item' :key='item.index'>
                            {{ item }}
                        </Option>
                    </Select>
                </div>

                <div class='fb-control-sub-item'>
                    <Select v-model='f.identity' :placeholder='lang.idField' clearable>
                        <Option v-for='item in f.schema' :value='item.model' :key='item.index'>
                            {{ item.model }}
                        </Option>
                    </Select>
                </div>

                <div class='fb-control-sub-item'>
                    <Select v-model='f.parent' :placeholder='lang.Related_fields' clearable>
                        <Option v-for='item in f.schema' :key='item.index' :value='item.model'>
                            {{ item.model }}
                        </Option>
                    </Select>
                </div>

                <div class='fb-control-sub-item' v-if="f.subtype != 'Form'">
                    <Input v-model='f.min_height' :placeholder='lang.min_height' />
                </div>

            </div>
            <div class='fb-control fb-control-sub'>

                <div class='fb-control-sub-item'>
                    <Checkbox v-model='f.timestamp' v-if="f.subtype != 'Form'">
                        <span>{{ lang.Date_generated_automatically }}</span>
                    </Checkbox>

                    <Checkbox v-model='f.hidden'>
                        <span>{{ lang.hide }}</span>
                    </Checkbox>
                    <Checkbox v-model='f.checkEmpty'>
                        <span>Өгөдөл заавал бөглүүлэх</span>
                    </Checkbox>

                </div>
                <div class='fb-control-sub-item'>
                    <Checkbox v-model='f.disableDelete'>
                        <span>{{ lang.Close_deletion_action }}</span>
                    </Checkbox>
                    <br>
                    <Checkbox v-model='f.disableEdit'>
                        <span>Засах үйлдэл хаах</span>
                    </Checkbox>
                    <br>
                    <Checkbox v-model='f.disableCreate'>
                        <span>{{ lang.close_add_ons_action }}</span>
                    </Checkbox>
                </div>
                <div class='fb-control-sub-item'>
                    <Checkbox v-model='f.showRowNumber'>
                        <span>{{ lang.row_numbering }}</span>
                    </Checkbox>
                    <Checkbox v-model='f.useTableType'>
                        <span>{{ lang.Use_table_type }}</span>
                    </Checkbox>
                </div>

                <div v-if='f.useTableType'>
                    <Select v-model='f.tableTypeColumn' :placeholder='lang.Table_Type_field' clearable size='small'>
                        <Option v-for='item in f.schema' :key='item.index' :value='item.model'>
                            {{ item.model }}
                        </Option>
                    </Select>
                    <br>
                    <Input v-model='f.tableTypeValue' :placeholder='lang.Table_Type_value' size='small' />
                </div>
            </div>
            <div class='sub-form-source-grid'>
                <Row gutter='10'>
                    <Col span='12'>
                        <Label>Триггер (өгөгдөл дуудах URL)</Label>
                        <Input type='text' v-model='f.trigger' placeholder='Триггер (өгөгдөл дуудах URL)' /> <br>

                    </Col>
                    <Col span='8'>
                        <Label>Триггер дуудах хугацаа </Label>
                        <Input type='text' v-model='f.triggerTimeout' placeholder='Триггер дуудах хугацаа ' /> <br>

                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Input v-if='f.checkEmpty' type='text' v-model='f.EmptyErrorMsg'
                               placeholder='Хоосон үед харуулах алдаа' /> <br>
                        <Checkbox v-model='f.addFromGrid'>
                            <span>Хүснэгтээс өгөгдөл дуудаж оруулах</span>
                        </Checkbox>
                    </Col>
                </Row>
                <Row v-if='f.addFromGrid'>
                    <Col span='12'><Input type='text' v-model='f.sourceGridModalTitle'
                                          placeholder='Modal дээр харуулах нэр' /></Col>
                    <Col span='12'>


                        <Select v-model='f.sourceMicroserviceID' placeholder='Microservice' clearable
                                filterable
                        >
                            <Option v-for='microservice in microservices' :value='microservice.microservice_id'
                                    :key='microservice.index'>
                                {{ microservice.microservice }}
                            </Option>
                        </Select>


                        <Select v-model='f.sourceGridID' placeholder='Өгөгдөл дуудаж хүснэгт' clearable

                                @on-change='setGridSource'
                                filterable

                        >
                            <Option v-for='item in otherGrids' :value='item.id' :key='item.id'>{{ item.name }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row v-if='f.addFromGrid'>
                    <Col span='24'>
                        <label>Хайлтын дээр харуулах гарчиг</label>
                        <Input type='text' v-model='f.sourceGridTitle' placeholder='Хайлтын дээр харуулах гарчиг' />
                        <br>
                        <label>Хайлтын дээр ажиллах хэрэглэгчийн нөхцөл [{"grid_field":"","user_field":""}]</label>
                        <Input type='text' v-model='f.sourceGridUserCondition'
                               placeholder='Хайлтын дээр ажиллах хэрэглэгчийн нөхцөл' />
                        <br>
                        <label>Формоос авах шүүлтүүр [{"parent_field":"", "grid_field":"", "message":""}]</label>
                        <Input type='text' v-model='f.sourceGridParentBasedCondition'
                               placeholder='Формоос авах шүүлтүүр' />
                    </Col>
                    <Col span='24'>

                        <label>Хайлтын дээр харуулах тайлбар</label>

                        <ckeditor ref='ckeditor' :editor='editor' v-model='f.sourceGridDescription'
                                  :config='editorConfig'></ckeditor>
                    </Col>
                </Row>
                <br>
                <Row v-if='f.addFromGrid'>
                    <Col span='24'>
                        <Select v-model='f.sourceUniqueField' placeholder='Давхцал шалгах багана' clearable
                                filterable

                        >
                            <Option v-for='(item, iIndex) in f.schema' :key='iIndex' :value='item.model'>{{ item.model
                                }}
                            </Option>
                        </Select>
                    </Col>
                </Row>
                <Row v-if='f.addFromGrid'>

                    <Col span='10'>
                        <Select v-model='sourceColumnOption.selfColumn' placeholder='Form талбар' clearable
                                filterable

                        >
                            <Option v-for='(item, iIndex) in f.schema' :key='iIndex' :value='item.model'>{{ item.model
                                }}
                            </Option>
                        </Select>
                    </Col>
                    <Col span='10'>

                        <Select v-model='sourceColumnOption.sourceColumn' placeholder='Grid талбар' clearable
                                filterable

                        >
                            <Option v-for='(item, iIndex) in sourceGridColumns' :key='iIndex' :value='item.model'>
                                {{ item.model }}
                            </Option>
                        </Select>
                    </Col>
                    <Col span='4'>
                        <Button type='primary' shape='circle' icon='md-add'
                                @click='addSourceGridTargetColumn'></Button>
                    </Col>
                </Row>
                <div v-if='f.addFromGrid'>
                    <Row v-for='(sourceGridTargetColumn, cindex) in f.sourceGridTargetColumns'
                         :key='sourceGridTargetColumn.index'>
                        <Col span='10'>{{ sourceGridTargetColumn.selfColumn }}</Col>
                        <Col span='10'>{{ sourceGridTargetColumn.sourceColumn }}</Col>
                        <Col span='4'>
                            <Button type='primary' shape='circle' icon='ios-trash'
                                    @click='deleteSourceGridTargetColumn(cindex)'></Button>
                        </Col>
                    </Row>
                </div>
            </div>

            <div class='crud-table'>
                <Row class='crud-table-header'>
                    <Col span='3'> {{ lang.model }}</Col>
                    <Col span='4'> {{ lang.displayName }}</Col>
                    <Col span='5'> {{ lang.Form_type }}</Col>
                    <Col span='2' class='center'> {{ lang.hide }}</Col>
                    <Col span='4' class='center'> {{ lang.inactive }}</Col>
                    <Col span='3' class='center'> {{ lang.translation }}</Col>
                    <Col span='2' class='center'>
                        <span>...</span>
                    </Col>
                </Row>
                <div class='crud-table-body-sub'>
                    <Container
                        group-name='sub-form-columns'
                        :drop-placeholder='dropPlaceholderOptions'
                        :get-child-payload='(i_index)=>getPayloadColumns(i_index)'
                        @drop='(e)=>onDropSub(e)'>
                        <!--form element-->
                        <Draggable v-for='(item, iIndex) in f.schema' :key='iIndex'>
                            <form-item
                                :schema='f.schema'
                                :item='item'
                                :otherGrids='otherGrids'
                                :edit='edit'
                                :sub='true' :disabled='isDisabled(item)'>
                            </form-item>
                        </Draggable>
                    </Container>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import { applyDrag } from './utils/helpers'
import formItem from './FormItem'
import { idGenerator } from './utils/methods'
import { getTableMeta } from './utils/helpers'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import Vue from 'vue'

export default {
    props: ['f', 'edit', 'otherForms', 'projectID', 'otherGrids', 'schemaList'],
    components: {
        Container, Draggable,
        'form-item': formItem,
        ckeditor: CKEditor.component
    },
    computed: {
        lang() {
            const labels = ['Form_name', 'Choose_type', '_subform', 'selectTable', 'idField', 'Related_fields', 'min_height',
                'Date_generated_automatically', 'hide', 'Close_deletion_action', 'close_add_ons_action', 'row_numbering', 'Use_table_type',
                'Table_Type_field', 'Table_Type_value', 'model', 'displayName', 'Form_type', 'hide', 'inactive', 'translation']
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i])
                return obj
            }, {})
        }

    },

    data() {
        return {
            editor: Editor,
            editorConfig: {
                toolbar: {
                    items: ['heading', '|',
                        'bold', 'italic', '|', 'link', '|',
                        'blockQuote', '|',
                        'insertTable', '|',
                        'indent', 'outdent', '|',
                        'mediaEmbed'], shouldNotGroupWhenFull: true
                }
            },
            dropPlaceholderOptions: {
                className: 'drop-preview',
                animationDuration: '150'

            },
            isEdit: false,
            microservices: window.init.microservices ? window.init.microservices : [],
            tableList: window.init.dbSchema.tableList,
            isModelSelected: false,
            subFormType: [
                {
                    label: 'Форм',
                    value: 'Form'
                },
                {
                    label: 'Баазын хүснэгт',
                    value: 'Grid'
                }
            ],
            schemaItemDefaults: {
                formType: null,
                label: '',
                placeHolder: '',
                hidden: false,
                disabled: false,
                default: null,
                prefix: '',
                preStaticWord: '',
                rules: [],
                hasTranslation: false,
                hasEquation: false,
                equations: '',
                isGridSearch: false,
                gridSearch: {
                    grid: null,
                    key: null,
                    labels: null,
                    multiple: false
                },
                isFkey: false,
                relation: {
                    table: null,
                    key: null,
                    fields: [],
                    sortField: null,
                    sortOrder: 'asc',
                    multiple: false,
                    filter: '',
                    parentFieldOfForm: '',
                    parentFieldOfTable: ''
                },
                span: {
                    xs: 24,
                    sm: 24,
                    md: 24,
                    lg: 24
                }
            },
            sourceColumnOption: {
                selfColumn: null,
                sourceColumn: null
            },
            sourceGridColumns: []
        }
    },

    created() {

        // if(this.f.type == "Form"){
        //   this.callOtherForms();
        // }
        this.isEdit = this.f.schema.length > 0;

        //if there is new object item it check and add
        if (this.isEdit) {
            if (this.f.subtype != 'Form') {
                this.f.schema = this.f.schema.map(item => {
                    return {
                        ...item,
                        ...Object.keys(this.schemaItemDefaults).filter(key => {
                            return !item.hasOwnProperty(key)
                        }).reduce((obj, key) => {
                            obj[key] = this.schemaItemDefaults[key]
                            return obj
                        }, {})
                    }
                })
            }

        }

        if (this.f.sourceGridID) {
            if (!this.f.sourceGridTargetColumns || this.f.sourceGridTargetColumns.length == 0) {
                this.setGridSource(this.f.sourceGridID)
            }
        }

        if (typeof this.f.hidden == 'undefined') {
            Vue.set(this.f, 'hidden', false)
        }
    },

    methods: {
        deleteSourceGridTargetColumn(index) {
            this.$props.f.sourceGridTargetColumns.splice(index, 1)
        },
        addSourceGridTargetColumn() {

            if (!this.$props.f.sourceGridTargetColumns) {
                this.$props.f.sourceGridTargetColumns = []
            }
            this.$props.f.sourceGridTargetColumns.push({
                selfColumn: this.sourceColumnOption.selfColumn,
                sourceColumn: this.sourceColumnOption.sourceColumn
            })

            this.sourceColumnOption = {
                selfColumn: null,
                sourceColumn: null
            }
        },
        //Form functions
        idGenerator: idGenerator,
        onDropSub(dropResult) {
            this.f.schema = applyDrag(this.f.schema, dropResult);
        },
        getPayloadColumns(i_index) {
            return this.f.schema[i_index]
        },
        callForms(val) {
            this.f.type = val
            // if (this.f.subtype == "Form") {
            //   this.callOtherForms()
            // }
        },

        // callOtherForms() {
        //     window.otherFormsRequestCalled = true
        //     if (window.otherForms) {
        //         this.otherForms = window.otherForms;
        //     } else {
        //         axios.get('/lambda/puzzle/schema/form').then(({data}) => {
        //             window.otherForms = data.data;
        //             this.otherForms = data.data;
        //         });
        //     }
        // },

        async setBuilder(val) {
            if (val) {
                let index = this.schemaList.findIndex(l=>l === val);
                if(index >= 0){
                    this.f.formId = null;
                    this.f.model = null;
                    this.$Notice.error({
                        title: `${val} давхцаж байна !!!`
                    })
                } else {

                    if (this.f.subtype === 'Form') {

                        this.f.formId = val

                        let defualtURL = `/lambda/puzzle/schema/form/${val}/builder`
                        if (this.projectID) {
                            defualtURL = `/lambda/puzzle/project/${this.projectID}/form/${val}/builder`
                        }
                        let res = await axios.get(defualtURL)

                        if (res.data.data) {
                            let formSchema = JSON.parse(res.data.data.schema)
                            this.f.schema = getTableMeta(formSchema.model)
                            this.f.model = formSchema.model
                        }

                    } else {
                        this.f.model = val
                        this.f.schema = getTableMeta(val)
                        this.isModelSelected = true
                    }
                    //Setting config schema
                    this.f.schema = this.f.schema.map(item => {
                        //Default identity field
                        if (item.extra == 'auto_increment' || item.key == 'PRI') {
                            this.f.identity = item.model
                        }

                        //Has default value on DB
                        if (item.model == 'created_at' || item.model == 'updated_at') {
                            this.f.timestamp = true
                        }

                        //Customized schema item
                        return {
                            ...item,
                            id: this.idGenerator('form-item'),
                            ..._.cloneDeep(this.schemaItemDefaults, true)
                        }
                    })
                }

            }
        },
        async setGridSource(val) {
            if (val) {
                let defualtURL = `/lambda/puzzle/schema/grid/${val}`
                if (this.projectID) {
                    defualtURL = `/lambda/puzzle/projects/grid/${val}`
                }
                let res = await axios.get(defualtURL)

                if (res.data.data) {
                    let gridSchema = JSON.parse(res.data.data.schema)
                    this.sourceGridColumns = []
                    gridSchema.schema.forEach(col => {

                        if (col.hide !== true || col.label != '') {
                            this.sourceGridColumns.push({
                                model: col.model
                            })
                        }
                    })


                }
            }

        },
        isDisabled(item) {
            if (
                item.model == this.f.parent ||
                item.model == this.f.identity ||
                (item.model == 'created_at' && this.f.timestamp == true) ||
                (item.model == 'updated_at' && this.f.timestamp == true)
            ) {
                return true
            }
            return false
            if (
                item.model == this.f.parent ||
                item.model == this.f.identity ||
                (item.model == 'created_at' && this.f.timestamp == true) ||
                (item.model == 'updated_at' && this.f.timestamp == true)
            ) {
                return true
            }
            return false
        }


    }
}
</script>


