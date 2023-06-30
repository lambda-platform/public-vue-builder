<template>
    <section class='form-builder'>
        <Spin size='large' fix v-if='loading'></Spin>
        <div class='fb-sidebar'>
            <div class='fb-control'>
                <div class='fb-control-item'>
                    <label>{{ lang.Form_name }}</label>
                    <Input v-model='formName' :placeholder='lang.Form_name'/>
                </div>

                <div class='fb-control-item'>
                    <label>{{ lang.Sub_name }}</label>
                    <Input v-model='dataform.formSubName' :placeholder='lang.Sub_name'/>
                </div>

                <div class='fb-control-item'>
                    <label>{{ lang.Form_type }}</label>
                    <Select v-model='dataform.formType' :placeholder='lang.Form_type' clearable>
                        <Option value='normal'>
                            {{ lang.Simple_form }}
                        </Option>
                        <Option value='step'>
                            {{ lang.Step_by_step_form }}
                        </Option>
                    </Select>
                </div>

                <div class='fb-control-item' v-if="dataform.formType === 'step'">
                    <Checkbox v-model='dataform.step.singleTable'>
                        <span>Нэг мэдээллийн хүснэгттэй</span>
                    </Checkbox>
                </div>

                <div class='fb-control-item'>
                    <label>{{ lang.data_table }}</label>
                    <multiselect v-if='!editMode' v-model='dataform.model' :placeholder='lang.selectTable'
                                 @select='setBuilder' :options="tableList"></multiselect>
                    <Input v-model='dataform.model' disabled v-if='editMode'/>
                </div>

                <div class='fb-control-item' v-if='isModelSelected || editMode'>
                    <label>{{ lang.idField }}</label>
                    <Select v-model='dataform.identity' :placeholder='lang.idField' clearable>
                        <Option v-for='item in dataform.schema' :value='item.model' :key='item.index'>{{ item.model }}
                        </Option>
                    </Select>
                </div>

                <div class='fb-control-item' v-if='isModelSelected || editMode'>
                    <Checkbox v-model='dataform.timestamp'>
                        <span>{{ lang.Date_generated_automatically }}</span>
                    </Checkbox>
                </div>

                <div class='fb-control-item' v-if='isModelSelected || editMode'>
                    <Checkbox v-model='dataform.disableReset'>
                        <span>Шинээр бөглөх товч нуух</span>
                    </Checkbox>
                </div>
                <div class='fb-control-item' v-if='isModelSelected || editMode'>
                    <Checkbox v-model='dataform.withBackButton'>
                        <span>Буцах товч</span>
                    </Checkbox>
                </div>


                <div class='fb-control-item' v-if='isModelSelected || editMode'>
                    <Checkbox v-model='dataform.isWarnText'>
                        <span>Санамж текст</span>
                    </Checkbox>
                </div>

                <div class='divider' v-if='isModelSelected || editMode'></div>

                <div class='fb-control-item' v-if='isModelSelected || editMode'>
                    <label>{{ lang.Label_location }}</label>
                    <RadioGroup v-model='dataform.labelPosition' @on-change='setLabelWidth'>
                        <Radio label='top'>
                            <span>{{ lang._top }}</span>
                        </Radio>
                        <Radio label='left'>
                            <span>{{ lang._left }}</span>
                        </Radio>
                        <Radio label='float'>
                            <span>Float</span>
                        </Radio>
                    </RadioGroup>
                    <InputNumber v-if="dataform.labelPosition == 'left'" v-model='dataform.labelWidth'></InputNumber>
                </div>

                <div class='fb-control-item' v-if='isModelSelected || editMode'>
                    <label>{{ lang.Form_width }} /px/</label>
                    <Input v-model='dataform.width' :placeholder='lang.Form_width'/>
                </div>

                <div class='fb-control-item' v-if='isModelSelected || editMode'>
                    <label>{{ lang.Padding_spacing }} /px/</label>
                    <InputNumber v-model='dataform.padding'></InputNumber>
                </div>

                <div class='fb-control-item' v-if='isModelSelected || editMode'>
                    <label>Дутуу бөглөхөд харуулах алдаа</label>
                    <Input v-model='dataform.formValidationCustomText'/>
                </div>

                <div class='fb-control-item' v-if='isModelSelected || editMode'>
                    <label>{{ lang.Save_button_word }}</label>
                    <Input v-model='dataform.save_btn_text' :placeholder='lang.Save_button_word'/>
                </div>


            </div>

            <div class='fb-submit'>
                <Button type='success' long @click='saveForm'>{{ lang.save }}</Button>
            </div>
        </div>

        <div class='fb-workspace'>
            <Tabs type='card' :animated='false'>
                <TabPane :label='lang.basicSettings' :key='`main-tab`' icon='md-code-working'>
                    <div class='crud-config'>
                        <div class='crud-table'>
                            <Row class='crud-table-header'>
                                <Col span='3'> {{ lang.model }}</Col>
                                <Col span='5'> {{ lang.displayName }}</Col>
                                <Col span='5'> {{ lang.Form_type }}</Col>
                                <Col span='2' class='center'> {{ lang.hide }}</Col>
                                <Col span='4' class='center'> {{ lang.inactive }}</Col>
                                <Col span='3' class='center'> {{ lang.translation }}</Col>
                                <Col span='2' class='center'><span>...</span></Col>
                            </Row>
                            <div class='crud-table-body'>
                                <form-item v-for="item in dataform.schema.filter(i=>i.formType !== 'SubForm')"
                                           :key='item.index' :schema='dataform.schema' :item='item' :edit='editMode'
                                           :otherGrids='otherGrids'
                                           :projectID='projectID'
                                           :sub='false' :disabled='isDisabled(item)'>
                                </form-item>
                            </div>
                        </div>
                    </div>
                </TabPane>
                <!-- Formula confiration -->
                <TabPane :label='lang.formula' icon='md-calculator'>
                    <div class='form-builder'>
                        <div class='formula-wrapper'>
                            <Row type='flex'>
                                <Col span='10'>
                                    <div class='formula-form-wrapper'>
                                        <Form ref='formula' label-position='top' :model='formulaForm'
                                              :rules='formulaRule'>
                                            <FormItem prop='form' :label='lang._form'>
                                                <Select v-model='formulaForm.form'>
                                                    <Option value='main'>
                                                        {{ lang.basic_from }}
                                                    </Option>
                                                    <Option
                                                        v-for="f in dataform.schema.filter(s=>s.formType === 'SubForm')"
                                                        :key='f.index'
                                                        :value='f.model'>
                                                        {{ f.model }}
                                                    </Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem prop='template' :label='lang.formula_conditions'>
                                                <Input type='text' v-model='formulaForm.template'
                                                       :placeholder='lang.formula_conditions'/>
                                                <p class='formula-helper'>
                                                    {{ lang.formula }}: {a}+{b} | {{ lang.conditions }}: {a}>={b}, '{a}'
                                                    == 'test' ...
                                                </p>
                                            </FormItem>

                                            <FormItem v-for='(target, index) in formulaForm.targets' :key='index'
                                                      :label='lang.field + (index+1)'>
                                                <Row :gutter='8' :label='80'>
                                                    <Col span='10'>
                                                        <Select v-model='target.field'
                                                                :placeholder='lang.field'
                                                                v-if="formulaForm.form == 'main'">
                                                            <Option v-for='(ss, index_) in dataform.schema'
                                                                    :value='ss.model' :key='index_'>{{
                                                                    ss.model
                                                                }}
                                                            </Option>
                                                        </Select>
                                                        <Select v-model='target.field'
                                                                :placeholder='lang.field'
                                                                v-for="(f, f_index) in dataform.schema.filter(ff=>ff.formType === 'SubForm' && ff.model === formulaForm.form && formulaForm.form !== 'main')"
                                                                :key='f_index'>
                                                            <Option v-for='(f_, f__index) in f.schema'
                                                                    :value='f_.model' :key='f__index'>{{
                                                                    f_.model
                                                                }}
                                                            </Option>
                                                        </Select>
                                                    </Col>

                                                    <Col span='10'>
                                                        <AutoComplete v-model='target.prop' placeholder='Prop'
                                                                      :data='formulaProps'></AutoComplete>
                                                    </Col>

                                                    <Col span='4'>
                                                        <Button @click='deleteFormulaTarget(index)'
                                                                icon='ios-trash'></Button>
                                                    </Col>
                                                </Row>
                                            </FormItem>

                                            <FormItem>
                                                <Button type='dashed' long @click='addFormulaTarget' icon='md-add'>
                                                    {{ lang.add_a_field }}
                                                </Button>
                                            </FormItem>

                                            <FormItem>
                                                <Button type='primary' @click='addFormula'>{{ lang.add }}</Button>
                                            </FormItem>
                                        </Form>
                                    </div>
                                </Col>
                                <Col span='14'>
                                    <Table border size='small' :columns='formulaColumns' :data='dataform.formula'
                                           height='400'></Table>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </TabPane>

                <!-- Trigger tab -->
                <TabPane :label='`${lang.trigger}`' icon='md-link'>
                    <div class='trigger-wrapper'>
                        <table>
                            <tr>
                                <td>
                                    <label>{{ lang.controller_namespace }}</label>
                                </td>
                                <td>
                                    <Input v-model='dataform.triggers.namespace' :placeholder='lang.namespace'/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>{{ lang.before_insert }}</label>
                                </td>
                                <td>
                                    <Input v-model='dataform.triggers.insert.before'
                                           :placeholder='lang.before_insert'/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>{{ lang.after_insert }}</label>
                                </td>
                                <td>
                                    <Input v-model='dataform.triggers.insert.after' :placeholder='lang.after_insert'/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>{{ lang.before_update }}</label>
                                </td>
                                <td>
                                    <Input v-model='dataform.triggers.update.before'
                                           :placeholder='lang.before_update'/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>{{ lang.after_update }}</label>
                                </td>
                                <td>
                                    <Input v-model='dataform.triggers.update.after' :placeholder='lang.after_update'/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>И-мэйл илгээх үед</label>
                                </td>
                                <td>
                                    <Input v-model='dataform.triggers.email'
                                           placeholder='Имэйл илгээх үед ажиллах триггер'/>
                                </td>
                            </tr>
                        </table>
                        <br>
                        <div>
                            <Row gutter='20'>
                                <Col span='12'>
                                    <h4>Нэмэлт товчлуур</h4>
                                    <Form ref='extra_button' label-position='top' :model='extraButtonForm'
                                          :rules='extraButtonRule' class="trigger-add-btn-form">
                                        <FormItem prop='icon' label='Icon'>

                                            <button type='button'
                                                    class='ivu-btn ivu-btn-default ivu-btn-circle ivu-btn-icon-only'
                                                    @click='iconSelector = true'>
                                                <i :class='`${extraButtonForm.icon} menu-icon-preview`'
                                                   v-if='extraButtonForm.icon'></i>
                                                <span v-else></span>
                                            </button>
                                        </FormItem>
                                        <FormItem label='Өнгө' prop='color'>
                                            <ColorPicker v-model='extraButtonForm.color' style='float: right'
                                                         :alpha='false'/>
                                        </FormItem>
                                        <FormItem>
                                            <FormItem prop='title' label='Нэр'>
                                                <Input type='text' v-model='extraButtonForm.title'
                                                       placeholder='Нэр'/>
                                            </FormItem>
                                        </FormItem>
                                        <FormItem>
                                            <FormItem prop='url' label='Холбоос'>
                                                <Input type='text' v-model='extraButtonForm.url'
                                                       placeholder='Холбоос'/>
                                            </FormItem>
                                        </FormItem>

                                        <Button @click='addExtraButton'
                                                icon='md-add'> Нэмэх
                                        </Button>
                                    </Form>


                                    <IconSelector @setIcon='setIcon' :iconSelector='iconSelector'/>
                                </Col>
                                <Col span='12' class="trigger-add-btn-table">
                                    <Table border size='small' :columns='extraButtonColumns'
                                           :data='dataform.extraButtons'
                                           height='400'></Table>
                                </Col>
                            </Row>
                        </div>
                        <br>
                        <div>
                            <Row gutter='20'>
                                <Col span='24'>
                                    <h4>Cache цэвэрлэх зам</h4>
                                    <Input v-model='dataform.triggers.cache_clear_url'
                                           :placeholder='lang.cache_clear_url'/>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </TabPane>

                <TabPane label='Имэйл' icon='md-mail'>
                    <div class='email-wrapper'>
                        <div class='email-address'>
                            <label>To:</label>
                            <input-tag placeholder='Имэйл хаяг' v-model='dataform.email.to' :limit='limit'
                                       validate='email'/>
                        </div>

                        <div class='email-address'>
                            <label>CC:</label>
                            <input-tag placeholder='Имэйл хаяг' v-model='dataform.email.cc' :limit='limit'
                                       validate='email'/>
                        </div>

                        <div class='email-address'>
                            <label>BCC:</label>
                            <input-tag placeholder='Имэйл хаяг' v-model='dataform.email.bcc' :limit='limit'
                                       validate='email'/>
                        </div>

                        <div class='subject'>
                            <label>Гарчиг:</label>
                            <Input placeholder='Subject' v-model='dataform.email.subject' :limit='limit'
                                   validate='email'/>
                        </div>
                        <div class='subject'>
                            <label>Attach илгээх эсэх:</label>
                            <Checkbox v-model='dataform.email.has_attach'/>
                        </div>
                        <div class='subject'>
                            <label>Custom trigger ажиллах эсэх:</label>
                            <Checkbox v-model='dataform.email.has_custom_trigger'/>
                        </div>
                        <div class='subject'>
                            <label>Custom trigger:</label>
                            <Input placeholder='Trigger name' v-model='dataform.email.custom_trigger'/>
                        </div>
                        <div class='subject'>
                            <label>Custom trigger function:</label>
                            <Input placeholder='Trigger name' v-model='dataform.email.custom_trigger_function'/>
                        </div>
                        <div class='body'>
                            <editor
                                v-model='dataform.email.body'
                                :init="initEditorConfig"
                            />
                        </div>
                    </div>
                </TabPane>

                <TabPane :label='lang.userInterface' icon='md-apps'>
                    <div class="warn-build-wrap" v-if="dataform.isWarnText">
                        <editor
                            api-key="6tb1o5o4z4v2dhvr0ctybwoltlyqx4xx0emp7wp3datunsx8"
                            v-model='dataform.warnText'
                            :init="initEditorConfigWarn"
                        />
                    </div>

                    <form-moqup :mode='mode' :schema='dataform.schema' :ui='dataform.ui' :schemaID='schemaID'
                                :identity='dataform.identity'
                                :use2ColumnLayout='dataform.use2ColumnLayout'
                                :meta='{
                            labelPosition: dataform.labelPosition,
                            labelWidth: dataform.labelWidth
                        }' :isDisabled='isDisabled'/>
                </TabPane>

                <TabPane v-if="dataform.formType === 'step'" label='Алхам тохиргоо' icon='md-menu'>
                    <div class='step-builder'>
                        <div class='step-builder-body'>
                            <h3>Алхмууд</h3>
                            <draggable v-model='dataform.step.list' :options="{group:'col', handle: '.drag-handler'}">
                                <Step v-for='(f, index) in dataform.step.list' :key='index' :f='f' :edit='editMode'
                                      :otherForms='otherForms' :remove-step='removeStep'/>
                            </draggable>
                            <div class='step-builder-body-footer'>
                                <a href='javascript:void(0)' @click='addStep'>
                                    <i class='ti-plus'></i>
                                    <span>Алхам нэмэх</span>
                                </a>
                            </div>
                        </div>
                        <div class='step-builder-config'>
                            <div class='pb-control-item'>
                                <label>Эрх тохиргоо</label>
                                <i-switch v-model='dataform.step.hasPermission' size='small'></i-switch>
                            </div>

                            <div class='pb-control-item'>
                                <label>Цуцлах</label>
                                <i-switch v-model='dataform.step.isCancel' size='small'></i-switch>
                            </div>
                        </div>
                    </div>
                </TabPane>

                <TabPane v-for="(f, index) in dataform.schema.filter(s=>s.formType === 'SubForm')" :key='index'
                         :label='tabLabel(f.model, f.name )'>
                    <sub-form :f='f' :edit='editMode' :otherForms='otherForms' :otherGrids='otherGrids'
                              :schemaList="schemaList"
                              :projectID='projectID'></sub-form>
                </TabPane>

                <div slot='extra'>
                    <Button @click='addSubForm' :disabled='!isModelSelected && !editMode' size='small'
                            icon='md-add'> {{ lang._subform }}
                    </Button>
                </div>
            </Tabs>
        </div>
    </section>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import formItem from './FormItem'
import subForm from './SubForm'
import Step from './Step'
import FormMoqup from './FormMoqup'
import {idGenerator} from './utils/methods'
import {getTableMeta} from './utils/helpers'
import {getTableView} from '../../utils'
import IconSelector from '../../components/IconSelector'
import InputTag from 'vue-input-tag'
import Editor from '@tinymce/tinymce-vue'
import draggable from 'vuedraggable'

export default {
    props: ['src', 'schemaID', 'editMode', 'onCreate', 'onUpdate', 'projectID'],
    components: {
        InputTag,
        draggable,
        'editor': Editor,
        IconSelector: IconSelector,
        'form-item': formItem,
        'sub-form': subForm,
        'form-moqup': FormMoqup,
        Step
    },

    data() {
        return {
            email_templates: window.init.email_templates,
            initEditorConfig: {
                init_instance_callback : function(editor) {
                    let freeTiny = document.querySelector('.tox-promotion');
                    freeTiny.style.display = 'none';
                },
                max_height: 1200,
                min_height: 600,
                images_upload_url: '/lambda/krud/upload-tinymce',
                plugins: [
                    "advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor",
                    "searchreplace", "visualblocks", "code", "fullscreen","responsivefilemanager",
                    "insertdatetime", "media", "table", "help", "wordcount",
                ],
                toolbar:
                    "undo redo  | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | responsivefilemanager | help | newsbutton | productbutton | otherbutton",
                external_filemanager_path: "/vendor/filemanager/",
                filemanager_title: "Responsive Filemanager",
                external_plugins: {
                    filemanager:
                        "/vendor/filemanager/plugin.min.js",
                },
                setup: (editor) => {
                    if (this.email_templates)
                        editor.ui.registry.addMenuButton('newsbutton', {
                            text: 'Бэлдсэн загвар',
                            fetch: (callback) => {
                                let local_email_templates = [];
                                this.email_templates.forEach(item => {
                                    local_email_templates.push({
                                        type: 'menuitem',
                                        text: item.name,
                                        onAction: function () {
                                            editor.insertContent(item.content);
                                        }
                                    });
                                });
                                let items = [
                                    {
                                        type: 'nestedmenuitem',
                                        text: 'И-мэйл загвар',
                                        getSubmenuItems: function () {
                                            return local_email_templates
                                        }
                                    }
                                ];
                                callback(items);
                            }
                        });

                }
            },
            initEditorConfigWarn: {
                init_instance_callback : function(editor) {
                    let freeTiny = document.querySelector('.tox-promotion');
                    freeTiny.style.display = 'none';
                },
                max_height: 1200,
                min_height: 300,
                images_upload_url: '/lambda/krud/upload-tinymce',
                plugins: [
                    "advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor",
                    "searchreplace", "visualblocks", "code", "fullscreen","responsivefilemanager",
                    "insertdatetime", "media", "table", "help", "wordcount",
                ],
                toolbar:
                    "undo redo  | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | responsivefilemanager | help | newsbutton | productbutton | otherbutton",
                external_filemanager_path: "/vendor/filemanager/",
                filemanager_title: "Responsive Filemanager",
                external_plugins: {
                    filemanager:
                        "/vendor/filemanager/plugin.min.js",
                },
                setup: (editor) => {
                    if (this.email_templates)
                        editor.ui.registry.addMenuButton('newsbutton', {
                            text: 'Бэлдсэн загвар',
                            fetch: (callback) => {
                                let local_email_templates = [];
                                this.email_templates.forEach(item => {
                                    local_email_templates.push({
                                        type: 'menuitem',
                                        text: item.name,
                                        onAction: function () {
                                            editor.insertContent(item.content);
                                        }
                                    });
                                });
                                let items = [
                                    {
                                        type: 'nestedmenuitem',
                                        text: 'И-мэйл загвар',
                                        getSubmenuItems: function () {
                                            return local_email_templates
                                        }
                                    }
                                ];
                                callback(items);
                            }
                        });

                }
            },
            otherForms: [],
            otherGrids: [],
            loadConfig: true,
            loading: false,

            //Form part
            isModelSelected: false,
            formName: null,
            editor: Editor,
            dataform: {
                formType: 'normal',
                formSubName: null,
                use2ColumnLayout: false,
                model: null,
                identity: null,
                timestamp: false,
                labelPosition: 'top',
                labelWidth: null,
                width: '600px',
                save_btn_text: 'Хадгалах',
                formValidationCustomText: '',
                padding: 8,
                schema: [],
                type: 'normal',
                ui: {
                    schema: []
                },
                step: {
                    hasPermission: false,
                    isCancel: false,
                    singleTable: false,
                    list: []
                },
                triggers: {
                    namespace: '',
                    insert: {
                        before: null,
                        after: null
                    },
                    update: {
                        before: null,
                        after: null
                    },
                    email: null,
                    cache_clear_url: null
                },
                extraButtons: [],
                disableReset: false,
                withBackButton: false,
                email: {
                    to: [],
                    cc: [],
                    bcc: [],
                    subject: null,
                    body: null,
                    has_attach: 0,
                    has_custom_trigger: 0,
                    custom_trigger:null,
                    custom_trigger_function:null,
                },
                isWarnText: false,
                warnText: ''
            },

            //Formula data
            formula: [],
            formulaForm: {
                form: 'main',
                targets: [],
                template: ''

            },
            formulaProps: ['value', 'hidden', 'disabled'],
            extraButtonForm: {
                icon: '',
                title: '',
                url: '',
                color: ''
            },
            iconSelector: false

            // formulaRule: {
            //
            //     template: [
            //         {
            //             required: true,
            //             message: "Томъёогоо оруулна уу1234",
            //             trigger: "blur"
            //         }
            //     ]
            // },

            // formulaColumns: [
            //     {
            //         title: this.langPerWords('_form'),
            //         // title: "Форм",
            //         key: "form",
            //         minWidth: 150
            //     },
            //     {
            //         title: this.langPerWords('formula_conditions'),
            //         // title: "Томъёо, Нөхцөл",
            //         key: "template",
            //         minWidth: 150,
            //     },
            //     {
            //         title: "Талбар+++",
            //         key: "targets",
            //         minWidth: 200,
            //     },
            //     {
            //         title: "Устгах",
            //         key: "action",
            //         width: 100,
            //         align: "center",
            //         render: (h, params) => {
            //             return h("div", [
            //                 h(
            //                     "Button",
            //                     {
            //                         props: {
            //                             type: "error",
            //                             size: "small"
            //                         },
            //                         on: {
            //                             click: () => {
            //                                 this.removeFormula(params.index);
            //                             }
            //                         }
            //                     },
            //                     "Устгах"
            //                 )
            //             ]);
            //         }
            //     }
            // ],

        }
    },

    computed: {
        lang() {
            const labels = ['Form_name', 'Form_type', 'Simple_form', 'Step_by_step_form', 'data_table', 'selectTable', 'idField',
                'Date_generated_automatically', 'Label_location', 'Form_width', 'Save_button_word', 'Padding_spacing', 'save', 'model',
                'displayName', 'hide', 'inactive', 'translation', 'basicSettings', 'formula', 'trigger', 'userInterface', '_subform', '_form'
                , 'formula_conditions', 'field', 'basic_from', 'conditions', 'add_a_field', 'add', 'controller_namespace', 'namespace',
                'before_insert', 'after_insert', 'before_update', 'after_update', 'cache_clear_url', '_top', '_left', 'formInformationSavedSuccessfully', 'please_enter_formula',
                'pleaseDeleteSubDForm', 'before_insert', 'after_insert', 'before_update', 'after_update', '_top', '_left', '_delete', 'render_by_tab', 'Sub_name']

            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i])
                return obj
            }, {})
        },

        _alert() {
            const labels = [
                'formInformationSavedSuccessfully',
                'please_enter_formula'
            ]
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('alertMessage.' + labels[i])
                return obj
            }, {})
        },

        dataGrid() {
            const labels = ['successfullySaved', 'anErrorOccurredWhileSaving']
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i])
                return obj
            }, {})
        },

        formulaColumns() {
            return [
                {
                    title: this.lang._form,
                    key: 'form',
                    minWidth: 150
                },
                {
                    title: this.lang.formula_conditions,
                    key: 'template',
                    minWidth: 150
                },
                {
                    title: this.lang.field,
                    key: 'targets',
                    minWidth: 200
                },
                {
                    title: this.lang._delete,
                    key: 'action',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeFormula(params.index)
                                        }
                                    }
                                },
                                this.lang._delete
                            )
                        ])
                    }
                }
            ]
        },

        extraButtonColumns() {
            return [
                {
                    title: 'Нэр',
                    key: 'title',
                    minWidth: 150
                },
                {
                    title: 'Icon',
                    key: 'icon',
                    minWidth: 150
                },
                {
                    title: 'Өнгө',
                    key: 'color',
                    minWidth: 150
                },
                {
                    title: 'Холбоос',
                    key: 'url',
                    minWidth: 200
                },
                {
                    title: 'Устгах',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.dataform.extraButtons.splice(params.index, 1)
                                        }
                                    }
                                },
                                'Устгах'
                            )
                        ])
                    }
                }
            ]
        },

        formulaRule() {
            return {
                template: [
                    {
                        required: true,
                        message: this._alert.please_enter_formula,
                        trigger: 'blur'
                    }
                ]
            }
        },

        tableList() {
            return getTableView('table')
        },

        extraButtonRule() {
            return {
                icon: [
                    {
                        required: true,
                        message: 'Icon сонгоно уу',
                        trigger: 'blur'
                    }
                ],

                title: [
                    {
                        required: true,
                        message: 'Нэр оруулна уу',
                        trigger: 'blur'
                    }
                ],

                color: [
                    {
                        required: true,
                        message: 'Өнгө оруулна уу',
                        trigger: 'blur'
                    }
                ],

                url: [
                    {
                        required: true,
                        message: 'Холбоос оруулна уу',
                        trigger: 'blur'
                    }
                ]
            }
        },

        schemaList() {
            return this.dataform.schema.map(s => s.model);
        }
    },

    watch: {
        reCallDataAw() {
            console.log('watch ajilj bn')
            //this.data();
        }
    },

    created() {
        this.init()
    },

    methods: {

        setIcon(icon) {
            this.extraButtonForm.icon = icon
            this.iconSelector = false
        },
        idGenerator: idGenerator,

        addExtraButton() {
            this.$refs['extra_button'].validate(valid => {
                if (valid) {
                    if (this.dataform.extraButtons === undefined) {
                        this.dataform.extraButtons = []
                    }

                    this.dataform.extraButtons.push({
                        icon: this.extraButtonForm.icon,
                        title: this.extraButtonForm.title,
                        url: this.extraButtonForm.url,
                        color: this.extraButtonForm.color
                    })
                    this.extraButtonForm.icon = ''
                    this.extraButtonForm.title = ''
                    this.extraButtonForm.url = ''
                    this.extraButtonForm.color = ''
                }
            })
        },

        //Formula functions
        addFormula() {
            this.$refs['formula'].validate(valid => {
                if (valid) {
                    //for old old version. it will use when edit
                    if (this.dataform.formula === undefined) {
                        this.dataform = {
                            ...this.dataform,
                            formula: []
                        }
                    }

                    this.dataform.formula.push({
                        targets: this.formulaForm.targets,
                        template: this.formulaForm.template,
                        form: this.formulaForm.form
                    })
                    this.formulaForm = {
                        targets: [],
                        template: '',
                        form: 'main'
                    }
                }
            })
        },

        removeFormula(index) {
            this.dataform.formula.splice(index, 1)
        },

        addFormulaTarget() {
            this.formulaForm.targets.push({
                field: '',
                prop: ''
            })
        },

        deleteFormulaTarget(index) {
            this.formulaForm.targets.splice(index, 1)
        },

        async callOtherFormsGrids() {
            window.otherFormsRequestCalled = true
            if (window.otherForms) {
                this.otherForms = window.otherForms
            } else {
                let url = '/lambda/puzzle/schema/form'

                if (this.projectID) {
                    // url = `/lambda/puzzle/project/${this.projectID}/form`
                    url = `/lambda/puzzle/projects/form`

                }

                let res = await axios.get(url)
                window.otherForms = res.data.data
                this.otherForms = res.data.data
            }
            if (window.otherGrids) {
                this.otherGrids = window.otherGrids
            } else {
                let url = '/lambda/puzzle/schema/grid'
                if (this.projectID) {
                    url = `/lambda/puzzle/projects/grid`
                }
                let res = await axios.get(url)
                window.otherGrids = res.data.data
                this.otherGrids = res.data.data
            }
        },

        //Form functions
        async init() {
            if (this.$props.editMode == true) {
                this.loading = true
                let res = await axios.get(this.$props.src + '/builder')
                try {
                    this.formName = res.data.data.hasOwnProperty('name') ? res.data.data.name : res.data.data.model
                    this.dataform = JSON.parse(res.data.data.schema)
                    await this.callOtherFormsGrids()
                    await this.updateSyncForm()
                    this.loading = false
                } catch (e) {
                    console.log(e)
                }
            } else {
                await this.callOtherFormsGrids()
                this.loading = false
            }
        },

        async updateSyncForm() {
            //DB field sync
            let dbSchema = getTableMeta(this.dataform.model)
            //Remove DB deleted field from schema
            let preSchema = []
            await Promise.all(this.dataform.schema.map(async (item) => {
                let deletedField = _.find(dbSchema, {
                    model: item.model
                })

                if (typeof deletedField !== 'undefined') {
                    preSchema.push({
                        ...item,
                        extra: deletedField.extra,
                        dbType: deletedField.dbType,
                        key: deletedField.key
                    })
                }

                if (item.formType == 'SubForm') {
                    //DB field sync
                    let dbSchema_sub = getTableMeta(item.model)

                    //Remove DB deleted field from schema of sub
                    item.schema = item.schema.map(item_sub => {
                        let deletedField = _.find(dbSchema_sub, {
                            model: item_sub.model
                        })

                        if (typeof deletedField !== 'undefined') {
                            return {
                                ...item_sub,
                                extra: deletedField.extra,
                                dbType: deletedField.dbType,
                                key: deletedField.key
                            }
                        }
                    }).filter(item => typeof item !== 'undefined')
                    //Sync added DB field
                    dbSchema_sub.forEach(item_sub => {
                        let newField_sub = _.find(item.schema, {
                            model: item_sub.model
                        })
                        if (typeof newField_sub === 'undefined') {
                            item.schema.push(this.setSchemaItem(item_sub))
                        }
                    })
                    preSchema.push(item)
                }
            }))

            this.dataform.schema = preSchema
            //Sync added DB field
            dbSchema.forEach(item => {
                let newField = _.find(this.dataform.schema, {
                    model: item.model
                })
                if (typeof newField === 'undefined') {
                    this.dataform.schema.push(this.setSchemaItem(item))
                }
            })

            //Checking has ui field temporary
            if (typeof this.dataform.ui == 'undefined') {
                Vue.set(this.dataform, 'ui', {})
                Vue.set(this.dataform.ui, 'schema', [])
            }

            if (typeof this.dataform.step == 'undefined') {
                let stepObj = {
                    hasPermission: false,
                    list: []
                }
                Vue.set(this.dataform, 'step', stepObj)
            }

            if (typeof this.dataform.email == 'undefined') {
                Vue.set(this.dataform, 'email', {
                    to: [],
                    cc: [],
                    bcc: [],
                    subject: null,
                    body: null
                })
            }

            if (typeof this.dataform.isWarnText == 'undefined') {
                Vue.set(this.dataform, 'isWarnText', false)
            }

            if (typeof this.dataform.warnText == 'undefined') {
                Vue.set(this.dataform, 'warnText', '')
            }

            if (typeof this.dataform.triggers == 'undefined') {
                let triggers = {
                    insert: {
                        before: null,
                        after: null
                    },
                    update: {
                        before: null,
                        after: null
                    }
                }
                Vue.set(this.dataform, 'triggers', triggers)
            }

            if (typeof this.dataform.extraButtons == 'undefined') {
                Vue.set(this.dataform, 'extraButtons', [])
            }

            if (typeof this.dataform.formType == 'undefined') {
                Vue.set(this.dataform, 'formType', 'normal')
            }

            this.dataform.schema.forEach(item => {
                this.updateSyncItem(item)
            })
        },

        updateSyncItem(item) {
            if (item)
                if (item.formType == 'Image' || item.formType == 'File') {
                    let fileProps = {
                        isMultiple: false,
                        count: 3,
                        maxSize: 2048,
                        type: 'normal'
                    }
                    if (typeof item.file == 'undefined') {
                        Vue.set(item, 'file', fileProps)
                    }
                }
        },

        setBuilder(table) {
            this.loading = true
            let TableMeta = getTableMeta(table)
            this.dataform.schema = TableMeta
            this.isModelSelected = true
            if (this.formName == null) {
                this.formName = table
            }

            this.dataform = {
                ...this.dataform,
                identity: null,
                sortField: null,
                sordOrder: 'desc',
                timestamp: false
            }

            //Setting config schema
            this.$data.dataform.schema = this.dataform.schema.map(item => {
                return this.setSchemaItem(item)
            })

            this.loading = false

        },

        setSchemaItem(item) {
            //Default identity field
            if (item.extra == 'auto_increment' || item.key == 'PRI') {
                this.dataform.identity = item.model
                this.dataform.sortField = item.model
            }

            //Has default value on DB
            if (item.model == 'created_at' || item.model == 'updated_at') {
                this.dataform.timestamp = true
            }

            //Customized schema item
            return {
                ...item,
                id: this.idGenerator('form-item'),
                type: 'form',
                formType: null,
                label: '',
                warn: '',
                placeHolder: '',
                hidden: false,
                disabled: false,
                default: null,
                prefix: '',
                ifshowhide: '',
                rules: [],
                hasTranslation: false,
                hasUserId: false,
                fillByUserField: null,
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
                    microservice_id: null,
                    table: null,
                    key: null,
                    fields: [],
                    sortField: null,
                    sortOrder: 'asc',
                    multiple: false,
                    filter: '',
                    parentFieldOfForm: '',
                    parentFieldOfTable: '',
                    addFrom: false,
                    addFromMicroservice: null
                },
                span: {
                    xs: 24,
                    sm: 24,
                    md: 24,
                    lg: 24
                },
                trigger: '',
                triggerTimeout: 0,
                file: {
                    isMultiple: false,
                    count: 3,
                    maxSize: 2048,
                    type: 'normal'
                }
            }
        },

        isDisabled(item) {
            if (
                item.model == this.dataform.identity ||
                (item.model == 'created_at' && this.dataform.timestamp == true) ||
                (item.model == 'updated_at' && this.dataform.timestamp == true)
            ) {
                return true
            }
            return false
        },

        setLabelWidth(val) {
            this.dataform.labelWidth = val == 'top' ? 0 : 80
        },
        //Sub Form
        addSubForm() {
            let subForm = {
                id: idGenerator('subform'),
                identity: null,
                name: this.lang._subform,
                min_height: null,
                formType: 'SubForm',
                subtype: 'Grid',
                formId: null,
                addFromGrid: false,
                checkEmpty: false,
                EmptyErrorMsg: '',
                sourceMicroserviceID: null,
                sourceGridID: null,
                sourceGridModalTitle: '',
                sourceGridTargetColumns: [],
                sourceGridTitle: '',
                sourceGridDescription: '',
                sourceGridUserCondition: '',
                sourceUniqueField: '',
                parent: null,
                model: null,
                data: null,
                rule: null,
                timestamp: false,
                disableDelete: false,
                disableEdit: false,
                disableCreate: false,
                showRowNumber: false,
                useTableType: false,
                tableTypeColumn: '',
                tableTypeValue: '',
                span: {
                    xs: 24,
                    sm: 24,
                    md: 24,
                    lg: 24
                },
                schema: [],
                trigger: '',
                triggerTimeout: 0,
                hidden: false
            }
            this.dataform.schema.push(subForm)
        },

        addStep() {
            let step = {
                id: idGenerator('step'),
                identity: null,
                name: 'Алхам',
                min_height: null,
                formType: 'SubForm',
                subtype: 'Grid',
                formId: null,
                addFromGrid: false,
                checkEmpty: false,
                EmptyErrorMsg: '',
                sourceMicroserviceID: null,
                sourceGridID: null,
                sourceGridModalTitle: '',
                sourceGridTargetColumns: [],
                sourceGridTitle: '',
                sourceGridDescription: '',
                sourceGridUserCondition: '',
                sourceUniqueField: '',
                parent: null,
                model: null,
                data: null,
                rule: null,
                timestamp: false,
                disableDelete: false,
                disableEdit: false,
                disableCreate: false,
                showRowNumber: false,
                useTableType: false,
                tableTypeColumn: '',
                tableTypeValue: '',
                span: {
                    xs: 24,
                    sm: 24,
                    md: 24,
                    lg: 24
                },
                schema: [],
                trigger: '',
                triggerTimeout: 0,
                ui: null
            }
            this.dataform.step.list.push(step)
            console.log(this.dataform.steps)
        },

        removeStep(formId) {
            this.dataform.step.list = this.dataform.step.list.filter(
                item => item.formId !== formId
            )
        },

        tabLabel(model, label) {
            return h => {
                return h('span', [
                    h('span', label.length > 18 ?
                        label.substring(0, 18 - 3) + '...' :
                        label),
                    h('Icon', {
                        props: {
                            type: 'ios-close'
                        },
                        on: {
                            click: () => {
                                this.removeConfirmation(model)
                            }
                        }
                    })
                ])
            }
        },

        removeConfirmation(model) {
            this.$Modal.confirm({
                title: '',
                content: '<p>' + this.lang.pleaseDeleteSubDForm + '</p>',
                okText: 'Тийм',
                cancelText: 'Үгүй',
                onOk: () => {
                    this.removeSubForm(model)
                },
                onCancel: () => {
                }
            })
        },

        removeSubForm(model) {

            Vue.set(this.dataform, "schema", this.dataform.schema.filter(
                item => item.model !== model
            ));

            if (model !== undefined) {
                Vue.set(this.dataform.ui, "schema", this.removeSubFromUI(this.dataform.ui.schema, model));
            }

        },

        removeSubFromUI(schema, model) {

            return schema.filter(
                item => item.model !== model
            ).map(item => {

                if (item.children) {
                    item.children = this.removeSubFromUI(item.children, model)
                }

                return item
            })
        },

        optimizeForm() {
            return new Promise((resolve, reject) => {
                this.dataform = this.dataform.map(item => {
                })
                resolve(phone)
            })
        },

        //For submitting
        findAndReplace(findItem, items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id == findItem.id) {
                    items[i] = findItem
                } else if (_.isArray(items[i].children)) {
                    this.findAndReplace(findItem, items[i].children)
                }
            }
        },

        syncSchema() {
            this.dataform.schema.forEach(item => {

                this.findAndReplace(item, this.dataform.ui.schema)

                return item
            })
        },

        saveForm() {
            this.syncSchema()
            console.log(this.dataform);

            let data = {
                name: this.formName,
                schema: JSON.stringify(this.dataform)
            }
            let defualtURL = `/lambda/puzzle/schema/form`
            if (this.projectID) {
                defualtURL = `/lambda/puzzle/project/${this.projectID}/form`
            }
            let submitUrl = this.$props.editMode
                ? this.$props.src
                : defualtURL

            axios.post(submitUrl, data).then(({data}) => {
                if (data.status) {
                    if (this.editMode) {
                        this.$Notice.success({
                            title: `${this.dataGrid.successfullySaved}`,
                            desc: `"${this.formName}" ${this._alert.formInformationSavedSuccessfully}`
                        })
                    } else {
                        this.$Notice.success({
                            title: `${this.dataGrid.successfullySaved}`,
                            desc: `"${this.formName}" ${this._alert.formInformationSavedSuccessfully}`
                        })
                        window.history.back()
                    }
                } else {
                    this.$Notice.error({
                        title: `${this.dataGrid.anErrorOccurredWhileSaving}`
                    })
                }
            })
        }
    }
}
</script>
