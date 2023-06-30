<template>
    <div :class="`${template} ${viewMode ? 'dataform view-mode' : 'dataform'}`">
        <div v-if="formType === 'step'" class="step-mode">
            <Spin v-if='loadConfig' fix></Spin>
            <div class='dataform-header'>
                <h3>
                    {{ title ? title : formTitle }}
                    <b v-if='showID'>
                        <span v-if='model[identity]'>: {{ model[identity] }}</span>
                    </b>
                </h3>

                <div v-if="template == 'window' || template == 'modal'" class="dataform-header-actions">
                    <a class="nav-btn" v-if="currentStep > 0"
                       v-on:click="moveStep(currentStep-1)">
                        <i class="ti-arrow-left"></i>
                    </a>

                    <a class="nav-btn" v-if="currentStep <= step.list.length"
                       v-on:click="moveStep(currentStep+1)">
                        <i class="ti-arrow-right"></i>
                    </a>

                    <Button :loading='asyncMode' @click="handleSubmit(meta.model +'-'+ schemaID)" class="save"
                            type="text">
                            <span v-if='!asyncMode'>
                                <i class="ti-save"></i>
                                {{ save_btn_text !== 'Хадгалах' && save_btn_text != '' ? save_btn_text : lang.save }}
                            </span>
                        <span v-else>
                                {{ lang.pleaseWait }}
                            </span>
                    </Button>

                    <a href="javascript:void(0)" @click="closeForm" class="action-btn"><i class="ti-close"></i></a>
                </div>
            </div>
            <step-form :step="step" :current-step="currentStep" on-success="onStepSuccess" on-error="onStepError"/>
        </div>

        <div v-else class="single-mode">
            <Form :ref="meta.model +'-'+ schemaID" :model='model' :rules='rule'
                  :label-position=meta.option.labelPosition
                  :label-width="meta.option.labelPosition === 'top' ? undefined : meta.option.labelWidth">
                <div class='dataform-header'>
                    <h3>{{ title ? title : formTitle }}<b v-if='showID'><span v-if='model[identity]'>: {{
                            model[identity]
                        }}</span></b></h3>
                    <div v-if="template == 'window' || template == 'modal'" class="dataform-header-actions">
                        <div class="action-wrapper">
                            <Button :loading='asyncMode' @click="handleSubmit(meta.model +'-'+ schemaID)" class="save"
                                    type="text">
                            <span v-if='!asyncMode'>
                                <i class="ti-save"></i>
                                {{ save_btn_text !== 'Хадгалах' && save_btn_text != '' ? save_btn_text : lang.save }}
                            </span>
                                <span v-else>
                                {{ lang.pleaseWait }}
                            </span>
                            </Button>
                        </div>
                        <a href="javascript:void(0)" @click="closeForm" class="action-btn"><i class="ti-close"></i></a>
                    </div>
                </div>

                <div class='dataform-body'>
                    <!-- Tab Section -->
                    <Spin v-if='loadConfig' fix></Spin>
                    <div v-else>
                        <Row v-for='row in ui.schema' :key='row.index'>
                            <!-- Section -->
                            <Col v-for='col in row.children' v-if='isVisibleSection(col) && !row.sectionRenderByTab'
                                 :key='col.index' :xs='col.span.xs'
                                 :sm='col.span.sm' :md='col.span.md' :lg='col.span.lg'>

                                <div
                                    :class="col.name !== '' && col.name !== null && col.name !== undefined ? 'fieldset' : ''">
                                    <legend v-if="col.name != ''">{{ col.name }}
                                    <Row v-for='srow in col.children' :key='srow.index'>
                                        <Col v-for='scol in srow.children' :id='scol.id' :key='scol.index' :xs='24'
                                             :sm='24' :md='scol.span.md' :lg='scol.span.lg'>
                                            <Divider v-if='scol.name' orientation='left' class='form-divider'>{{
                                                    scol.name
                                                }}
                                            </Divider>
                                            <span v-for='item in scol.children' :key='item.index'>

                                        <component
                                            :key='item.model'
                                            :ref="'sf'+item.model"
                                            :url='url'
                                            v-if="isShow(item.model) && item.formType == 'SubForm' && item.subtype"
                                            :is='element(`subform/${item.subtype}`)'
                                            :model='{form: model, component: item.model}'
                                            :form='setMeta(item, true)'
                                            :formula='formula'
                                            :relations='relations'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'
                                        />

                                                <component
                                                    :key='item.model'
                                                    v-if="isShow(item.model) && item.formType != 'SubForm'"
                                                    :do_render='do_render'
                                                    :asyncMode='asyncMode'
                                                    :editMode='editMode'
                                                    :is='element(item.formType)'
                                                    :model='{form: model, component: item.model}'
                                                    :disabled='item.disabled ? item.disabled : false'
                                                    :label='item.label ? item.label : `[${item.model}]`'
                                                    :rule='item.model'
                                                    :meta='setMeta(item)'
                                                    :identity='identity'
                                                    :url='url'
                                                    :getSchemaByModel='getSchemaByModel'
                                                    :getSchemaRelationByModel='getSchemaRelationByModel'
                                                    :setSchemaByModel='setSchemaByModel'
                                                    :relation_data='getRelation(item)'
                                                />
                                        </span>
                                        </Col>
                                    </Row>
                                    </legend>
                                </div>
                            </Col>

                            <!-- Tab -->
                            <Tabs :value='0' v-if='row.sectionRenderByTab'>
                                <TabPane :label='col.name' :name='col.index' v-for='col in row.children'
                                         v-if='isVisibleSection(col)' :key='col.index'>
                                    <Row v-for='srow in col.children' :key='srow.index'>
                                        <Col v-for='scol in srow.children' :id='scol.id' :key='scol.index' :xs='24'
                                             :sm='24' :md='scol.span.md' :lg='scol.span.lg'>
                                            <Divider v-if='scol.name' orientation='left' class='form-divider'>{{
                                                    scol.name
                                                }}
                                            </Divider>
                                            <span v-for='item in scol.children' :key='item.index'>
                                        <component
                                            :ref="'sf'+item.model"
                                            v-if="isShow(item.model) && item.formType == 'SubForm' && item.subtype"
                                            :is='element(`subform/${item.subtype}`)'
                                            :model='{form: model, component: item.model}'
                                            :form='setMeta(item, true)'
                                            :formula='formula'
                                            :url='url'
                                            :relations='relations'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'>
                                        </component>
                                        <component
                                            v-if="isShow(item.model) && item.formType != 'SubForm'"
                                            :do_render='do_render'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'
                                            :is='element(item.formType)'
                                            :model='{form: model, component: item.model}'
                                            :key="model"
                                            :url='url'
                                            :disabled='item.disabled ? item.disabled : false'
                                            :label='item.label ? item.label : `[${item.model}]`'
                                            :rule='item.model'
                                            :meta='setMeta(item)'
                                            :identity='identity'
                                            :getSchemaByModel='getSchemaByModel'
                                            :getSchemaRelationByModel='getSchemaRelationByModel'
                                            :setSchemaByModel='setSchemaByModel'
                                            :relation_data='getRelation(item)'>
                                        </component>
                                        </span>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>

                            <!-- Standart column -->
                            <Col v-for='col in row.children' v-if="col.type == 'col'" :key='col.index' :xs='col.span.xs'
                                 :sm='col.span.sm' :md='col.span.md' :lg='col.span.lg'>
                                <Divider v-if='col.name' orientation='left' class='form-divider'>{{
                                        col.name
                                    }}
                                </Divider>
                                <span v-for='item in col.children' :key='item.index'>
                            <component
                                :key='item.model'
                                :ref="'sf'+item.model"
                                v-if="isShow(item.model) && item.formType == 'SubForm' && item.subtype"
                                :is='element(`subform/${item.subtype}`)'
                                :label='item.label ? item.label : `[${item.model}]`'
                                :model='{form: model, component: item.model}'
                                :form='setMeta(item, true)'
                                :relations='relations'
                                :asyncMode='asyncMode'
                                :formula='formula'
                                :schemaID='schemaID'
                                :url='url'
                                :editMode='editMode'>
                            </component>

                            <component
                                :key='item.model'
                                v-if="isShow(item.model) && item.formType != 'SubForm'"
                                :do_render='do_render'
                                :editMode='editMode'
                                :is='element(item.formType)'
                                :disabled='item.disabled ? item.disabled : false'
                                :model='{form: model, component: item.model}'
                                :label='item.label ? item.label : `[${item.model}]`' :rule='item.model'
                                :meta='setMeta(item)'
                                :identity='identity'
                                :asyncMode='asyncMode'
                                :getSchemaByModel='getSchemaByModel'
                                :getSchemaRelationByModel='getSchemaRelationByModel'
                                :setSchemaByModel='setSchemaByModel'
                                :relation_data='getRelation(item)'>
                            </component>
                            </span>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div class='dataform-footer'
                     v-if='!viewMode && template !== "window" && template !== "modal"'>
                    <Button @click='close' v-if='withBackButton' style='margin-right: 8px'>
                        Буцах
                    </Button>
                    <Button v-for='extraButton in extraButtons' :key='extraButton.index' :disabled='!editMode'
                            :to='createWithTemplate(extraButton.url)' target='_blank'
                            :style='!editMode ? `margin-right: 8px;` : `margin-right: 8px; color:${extraButton.color}; border-color:${extraButton.color}`'>
                        <i :class='extraButton.icon' :style='!editMode ? `` :`color:${extraButton.color}`'></i>
                        {{ extraButton.title }}
                    </Button>
                    <Button type='info' :loading='asyncMode' @click="handleSubmit(meta.model +'-'+ schemaID)">
                    <span v-if='!asyncMode'>
                        {{ save_btn_text !== 'Хадгалах' && save_btn_text != '' ? save_btn_text : lang.save }}
                    </span>
                        <span v-else>
                        {{ lang.pleaseWait }}
                    </span>
                    </Button>

                    <Button @click="handleReset(meta.model +'-'+ schemaID)" v-if='!editMode && !disableReset'
                            style='margin-left: 8px'>
                        {{ lang.resetFrom }}
                    </Button>

                    <span v-for='button in getFooterButtons()' class='extra-buttons'>
                    <Button type='info' :loading='asyncMode' @click='setAndSend(button.model, option.value)'
                            v-for='option in button.options' :key='button.inex'>
                     {{ option.label }}
                    </Button>
                </span>
                </div>
            </Form>
        </div>

        <Drawer
            class='info-modal'
            v-model='showInfo'
            :title='infoTitle'
            width='860px'>
            <iframe :src='infoUrl' frameborder='0'></iframe>
            <div slot='footer'>
                <Button type='primary' size='large' @click='showInfo = false'>
                    {{ lang.close }}
                </Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
import StepForm from "./StepForm"
import mixins from './DataformMixin'

export default {
    mixins: [mixins],
    components: {
        StepForm
    }
}
</script>
