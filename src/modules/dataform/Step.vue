<template>
    <section class='step-item'>
        <div class='fb-control fb-control-sub'>
            <span class='drag-handler'><Icon type='ios-move'></Icon></span>
            <div class='fb-control-sub-item'>
                <Input v-model='f.name' placeholder='Алхмын нэр' />
            </div>

            <div class='fb-control-sub-item'>
                <Select v-model='f.formId' placeholder='Форм сонгох' clearable
                        filterable
                        @on-change='setBuilder'>
                    <OptionGroup label='Table list'>
                        <Option v-for='item in otherForms' :value='item.id' :key='item.id'>{{ item.name }}</Option>
                    </OptionGroup>
                </Select>
            </div>

            <div class='fb-control-sub-item'>
                <Select v-model='f.parent' :placeholder='lang.Related_fields' clearable>
                    <Option v-for='item in f.schema' :key='item.index' :value='item.model'>
                        {{ item.model }}
                    </Option>
                </Select>
            </div>

            <div class='fb-control-sub-item action'>
                <a href='javascript:void(0)' class='delete-btn' @click='removeStep(f.formId)'>
                    <i class='ti-trash'></i>
                    <span>Устгах</span>
                </a>
            </div>


            <div class='fb-control-sub-item action'>
                <a href='javascript:void(0)'
                   :class="`expand-toggle ${ expanded ? 'active' : ''} ${ disabled ? 'disabled' : '' }`"
                   @click='expanded = !expanded' :disabled='disabled'>
                    <Icon type='ios-arrow-down'></Icon>
                </a>
            </div>
        </div>
        <div v-if='expanded' :class="`item-more-options ${ expanded ? 'active' : '' }`">
            <div class='expand'>
                <Tabs :animated='false' size='small' class='expand-tab'>
                    <TabPane label='Тохиргоо'>
                        <Row type='flex'>
                            <Col :xs='12' :sm='12' :md='8' :lg='8'>
                                <div class='step-control-wrap'>
                                    <Input type='textarea' placeholder='санамж' v-model='f.note' />
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    </section>
</template>

<script>
import { idGenerator } from './utils/methods'
import { getTableMeta } from './utils/helpers'
import Editor from 'ckeditor5-custom-build/build/ckeditor'

export default {
    props: ['f', 'edit', 'otherForms', 'projectID', 'otherGrids', 'removeStep'],
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
            expanded: false,
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
                node: null,
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
                ui: null,
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
        this.isEdit = this.f.schema.length > 0
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

            this.f.schema = applyDrag(this.f.schema, dropResult)
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
                this.f.formId = val
                let defualtURL = `/lambda/puzzle/schema/form/${val}/builder`
                if (this.projectID) {
                    defualtURL = `/lambda/puzzle/project/${this.projectID}/form/${val}/builder`
                }
                let res = await axios.get(defualtURL)

                if (res.data.data) {
                    let formSchema = JSON.parse(res.data.data.schema)
                    this.f.schema = getTableMeta(formSchema.model)
                    this.f.ui = formSchema.ui
                    this.f.model = formSchema.model
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


