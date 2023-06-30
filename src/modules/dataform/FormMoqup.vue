<template>
    <div class='form-ui-builder'>
        <div class='pz-workspace'>
            <div class='pz-workspace-header'>
                <div class='pz-workspace-header-wrapper'>
                    <div class='header-control'>
                        <a href='javascript:void(0)' @click='addRow(false)'>
                            <Icon type='plus'></Icon>
                        </a>
                    </div>
                    <div class='view-port-switcher'>
                        <a href='javascript:void(0)' :class="`${mode.type} ${mode.type == 'xs' ? 'active' :''}`"
                           @click="setMode('xs', langMoqup.phone)">
                            <Icon type='md-phone-portrait' />
                        </a>
                        <a href='javascript:void(0)' :class="`${mode.type} ${mode.type == 'sm' ? 'active' :''}`"
                           @click="setMode('sm', langMoqup.tablet)">
                            <Icon type='md-tablet-portrait' />
                        </a>
                        <a href='javascript:void(0)' :class="`${mode.type} ${mode.type == 'md' ? 'active' :''}`"
                           @click="setMode('md', langMoqup.computer)">
                            <Icon type='md-laptop' />
                        </a>
                        <a href='javascript:void(0)' :class="`${mode.type} ${mode.type == 'lg' ? 'active' :''}`"
                           @click="setMode('lg', langMoqup.bigComputer)">
                            <Icon type='md-browsers' />
                        </a>
                    </div>
                </div>
            </div>

            <div class='pz-workspace-container'>
                <div :class='`pz-workspace-container-wrapper ${mode.type}`'>
                    <div class='grid-schema'>
                        <Form :label-position='meta.labelPosition' :label-width='meta.labelWidth'>
                            <Container
                                group-name='form-rows'
                                :drag-handle-selector='`.row-drag-handler`'
                                :drop-placeholder='dropPlaceholderOptions'
                                :get-child-payload='(i_index)=>getPayloadRows(i_index)'
                                @drop='(e)=>onDropRows(e)'>
                                <Draggable v-for='(row, row_index) in ui.schema' :key='row_index'>
                                    <Row :class='`${mode.type}`'>
                                        <div class='pz-row-control'>
                                            <Checkbox v-model='row.sectionRenderByTab'>
                                                <span>{{ lang.render_by_tab }}</span>
                                            </Checkbox>

                                            <span class='tool' @click='addSection(row.id, 1)'>
                                                <Tooltip :content='lang.section_add'>
                                                    <Icon type='md-menu' />
                                                </Tooltip>
                                            </span>
                                            <span class='tool' @click='addCol(row.id)'>
                                                <Tooltip :content='lang.add_column'>
                                                    <Icon type='md-add' />
                                                </Tooltip>
                                            </span>

                                            <span class='tool' @click='deleteFromSchema(row.id)'>
                                                <Tooltip :content='lang._delete'>
                                                    <Icon type='md-close' />
                                                </Tooltip>
                                            </span>
                                            <span class='row-drag-handler tool'>
                                                <Tooltip :content='lang._move'>
                                                    <Icon type='md-move' />
                                                </Tooltip>
                                            </span>
                                        </div>

                                        <!-- Rows -->
                                        <Container group-name='form-rows-columns'
                                                   :drag-handle-selector='`.scol-drag-handler`'
                                                   :drop-placeholder='dropPlaceholderOptions'
                                                   :get-child-payload='(i_index)=>getPayloadColumns(row_index, i_index)'
                                                   @drop='(e)=>onDropColumns(row_index, e)'>

                                            <Draggable v-for='(col, column_index) in row.children' :key='column_index'>
                                                <!-- Section column -->
                                                <Col :span='col.span[mode.type]'
                                                     class="drag-able-column"
                                                     v-if="col.type == 'section'">
                                                    <div class='pz-col easing'>
                                                        <div class='pz-col-control'>
                                                            <Input type='text' v-model='col.name' size='small'
                                                                   :placeholder='lang.Get_name'
                                                                   autocomplete="off"
                                                                   class='pz-col-input' />
                                                            <div class='pz-col-control-items'>
                                                                <Poptip placement='bottom-end' size='small'>
                                                                    <!-- <a href="javascript:void(0)" @click="addSectionCol(srow.id)"> -->
                                                                    <span class='tool'>
                                                                  <Badge :count='col.visibleUserRoles.length'
                                                                         v-if='col.visibleUserRoles'
                                                                         class-name='badge-user-roles'></Badge>
                                                                                <Icon type='md-person-add' />
                                                                            </span>
                                                                    <div class='auto-col' slot='content'>
                                                                        <Select v-model='col.visibleUserRoles' multiple
                                                                                style='width:260px'>
                                                                            <Option :value='role.id'
                                                                                    v-for='role in user_roles'
                                                                                    :key='role.index'>
                                                                                {{ role.display_name }}
                                                                            </Option>
                                                                        </Select>
                                                                    </div>
                                                                </Poptip>
                                                                <span class='tool' @click='addRow(col.id)'>
                                                                    <Icon type='md-add' />
                                                                </span>
                                                                <span class='tool' @click='deleteFromSchema(col.id)'>
                                                                    <Icon type='md-close' />
                                                                </span>
                                                                <span class='scol-drag-handler tool'>
                                                                    <Icon type='md-move' />
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <Container group-name='section-rows'
                                                                   :drag-handle-selector='`.srow-drag-handler`'
                                                                   :drop-placeholder='dropPlaceholderOptions'
                                                                   :get-child-payload='(i_index)=>getPayloadSectionRows(row_index, column_index, i_index)'
                                                                   @drop='(e)=>onDropSectionRows(row_index, column_index, e)'
                                                                   class='section-rows'>
                                                            <Draggable v-for='(srow, srow_index) in col.children'
                                                                       :key='srow_index'>
                                                                <Row :class='`${mode.type}`'>
                                                                    <div class='pz-row-control'>
                                                                        <Poptip placement='left' size='small'>
                                                                            <!-- <a href="javascript:void(0)" @click="addSectionCol(srow.id)"> -->
                                                                            <span class='tool'>
                                                                                <Icon type='md-menu' />
                                                                            </span>
                                                                            <div class='auto-col' slot='content'>
                                                                                <a v-for='options in colOptions'
                                                                                   :key='options.index'
                                                                                   @click='addSectionCol(srow.id, options)'>
                                                                                    <span v-for='col in options'
                                                                                          :key='col.index'
                                                                                          :style="{'width':(col/24)*100+'%'}">
                                                                                        {{ col / 2 }}
                                                                                    </span>
                                                                                </a>
                                                                            </div>
                                                                        </Poptip>

                                                                        <span class='tool'
                                                                              @click='deleteFromSchema(srow.id)'>
                                                                            <Icon type='md-close' />
                                                                        </span>

                                                                        <span class='srow-drag-handler tool'>
                                                                            <Icon type='md-move' />
                                                                        </span>
                                                                    </div>
                                                                    <Col v-for='(scol, scol_index) in srow.children'
                                                                         :key='scol_index'
                                                                         :span='scol.span[mode.type]'>

                                                                        <div class='pz-col easing'>
                                                                            <div class='pz-col-control'>
                                                                                <Input type='text' v-model='scol.id'
                                                                                       size='small'
                                                                                       class='pz-col-input' />
                                                                                <Input type='text' v-model='scol.name'
                                                                                       size='small'
                                                                                       :placeholder='lang.Get_name'
                                                                                       autocomplete="off"
                                                                                       class='pz-col-input' />
                                                                                <div class='pz-col-control-items'>
                                                                                    <a href='javascript:void(0)'
                                                                                       @click='deleteFromSchema(scol.id)'>
                                                                                        <Icon type='md-close' />
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                            <Container group-name='column'
                                                                                       :should-accept-drop='shouldAcceptDrop'
                                                                                       :drop-placeholder='dropPlaceholderOptions'
                                                                                       :get-child-payload='(i_index)=>getPayload(row_index, column_index, srow_index, scol_index, i_index)'
                                                                                       @drop='(e)=>onDrop(row_index, column_index, srow_index, scol_index, e)'
                                                                                       class='pz-holder'>

                                                                                <Draggable
                                                                                    v-for='(item, iIndex) in scol.children'
                                                                                    :key='iIndex'>
                                                                                    <component
                                                                                        v-if="item.formType != 'SubForm'"
                                                                                        :do_render='true'
                                                                                        :is='element(item.formType)'
                                                                                        :model='{form: model, component: item.model}'
                                                                                        :label='`${item.label} | ${item.model}`'
                                                                                        :isBuilder='true'
                                                                                        :meta='setMeta(item)'></component>
                                                                                    <component
                                                                                        v-if="item.formType == 'SubForm' && item.subtype"
                                                                                        :is='element(`subform/${item.subtype}`)'
                                                                                        :model='{form: model, component: item.model}'
                                                                                        :form='item'
                                                                                        :editMode='false'></component>
                                                                                </Draggable>
                                                                            </Container>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </Draggable>
                                                        </Container>
                                                        <div class='resizer'
                                                             @mousedown='handleResize($event, col.id)'></div>
                                                    </div>
                                                </Col>
                                                <!--  Standart column -->
                                                <Col :span='col.span[mode.type]'     class="drag-able-column" v-if="col.type == 'col'">
                                                    <div class='pz-col easing'>
                                                        <div class='pz-col-control'>
                                                            <Input type='text' v-model='col.id' size='small'
                                                                   class='pz-col-input' />
                                                            <Input type='text' v-model='col.name' size='small'
                                                                   class='pz-col-input' :placeholder='lang.Get_name' autocomplete="off" />

                                                            <div class='pz-col-control-items'>
                                                        <span class='tool' @click='deleteFromSchema(col.id)'>
                                                            <Icon type='md-close' />
                                                        </span>
                                                                <span class='scol-drag-handler tool'>
                                                            <Icon type='md-move' />
                                                        </span>
                                                            </div>
                                                        </div>

                                                        <Container group-name='column-standart'
                                                                   :should-accept-drop='(src, payload)=>shouldAcceptDrop(src, payload)'

                                                                   :drop-placeholder='dropPlaceholderOptions'
                                                                   :get-child-payload='(i_index)=>getPayloadStandart(row_index, column_index, i_index)'
                                                                   @drop='(e)=>onDropStandart(row_index, column_index, e)'
                                                                   class='pz-holder'>

                                                            <Draggable v-for='(item, item_index) in col.children'
                                                                       :key='item_index'>
                                                                <!-- form elements -->
                                                                <component
                                                                    v-if="item.formType != 'SubForm'"
                                                                    :is='element(item.formType)'
                                                                    :do_render='true'
                                                                    :model='{form: model, component: item.model}'
                                                                    :label='`${item.label} | ${item.model}`'
                                                                    :isBuilder='true'
                                                                    :meta='setMeta(item)'></component>

                                                                <component
                                                                    v-if="item.formType == 'SubForm' && item.subtype"
                                                                    :is='element(`subform/${item.subtype}`)'
                                                                    :model='{form: model, component: item.model}'
                                                                    :form='item' :editMode='false'></component>
                                                            </Draggable>
                                                        </Container>

                                                        <div class='resizer'
                                                             @mousedown='handleResize($event, col.id)'></div>
                                                    </div>
                                                </Col>
                                            </Draggable>
                                        </Container>
                                    </Row>
                                </Draggable>
                            </Container>

                            <!-- new row -->
                            <div :class='`pz-new-row easing`' @click='addRow(false)'>
                                <Icon type='plus-circled'></Icon>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>

        <div class='moqup-list'>
            <Form :label-position='meta.labelPosition' :label-width='meta.labelWidth'>
                <div class='form-item-list'>
                    <Container group-name='form-items'
                               :drop-placeholder='dropPlaceholderOptions'
                               :get-child-payload='(i_index)=>getPayloadMain(i_index)'
                               @drop='onDropMain($event)'>
                        <!--form element-->
                        <Draggable v-for='(item, index) in schema' :key='index'>
                            <component
                                v-if="item.formType != null && item.formType != 'SubForm' && !item.hidden && item.model != identity"
                                :do_render='true'
                                :is='element(item.formType)' :model='{form: model, component: item.model}'
                                :label='`${item.label} | ${item.model}`' :meta='setMeta(item)'
                                :isBuilder='true'></component>
                            <!-- sub form -->
                            <component v-if="item.formType == 'SubForm' && item.subtype"
                                       :is='element(`subform/${item.subtype}`)'
                                       :model='{form: model, component: item.model}' :form='item'></component>
                        </Draggable>
                    </Container>
                </div>
            </Form>
        </div>
    </div>
</template>
<script>
import { element } from './elements'
import Grid from './elements/subform/Grid.vue'
import { idGenerator } from './utils/methods'
import { Container, Draggable } from 'vue-smooth-dnd'
import { applyDrag } from './utils/helpers'

export default {
    props: ['schema', 'ui', 'isDisabled', 'meta', 'schemaID', 'identity', 'use2ColumnLayout'],
    components: {
        Container,
        Draggable,
        Grid
    },
    data() {
        return {
            user_roles: window.init.user_roles ? window.init.user_roles : [],
            dropPlaceholderOptions: {
                className: 'drop-preview',
                animationDuration: '150'

            },
            currentDom: null,
            findElId: null,
            model: {},
            mode: {
                type: 'md',
                label: 'Компьютер'
            },
            dragElOption: {
                group: {
                    name: 'element',
                    pull: 'clone',
                    put: false
                },
                sort: false
            },
            colOptions: [
                [24],
                [12, 12],
                [8, 8, 8],
                [6, 6, 6, 6],
                [4, 4, 4, 4, 4, 4],
                [16, 8],
                [8, 16],
                [20, 4],
                [4, 20],
                [6, 12, 6],
                [6, 18],
                [6, 10, 8],
                [6, 8, 10]
            ]
        }
    },
    mounted() {
        // console.log('Форм угсрах');
        //  console.log(this.$props.schema);
    },
    computed: {
        lang() {
            const labels = [
                'section_add',
                'add_column',
                '_delete',
                '_move',
                'Get_name',
                'render_by_tab'
            ]
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i])
                return obj
            }, {})
        },
        langMoqup() {
            const labels = [
                'phone',
                'tablet',
                'computer',
                'bigComputer'
            ]
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('moqup.' + labels[i])
                return obj
            }, {})
        }
    },
    methods: {
        shouldAcceptDrop(sourceContainerOptions, payload) {
            // console.log(sourceContainerOptions, payload)
            return true
        },

        getPayload(rowIndex, colIndex, srowIndex, scolIndex, i_index) {
            return this.ui.schema[rowIndex].children[colIndex].children[srowIndex].children[scolIndex].children[i_index]
        },

        getPayloadStandart(rowIndex, colIndex, i_index) {
            if (rowIndex !== null && colIndex !== null && i_index !== null) {
                return this.ui.schema[rowIndex].children[colIndex].children[i_index]
            }

        },

        getPayloadMain(i_index) {
            return this.schema[i_index]
        },

        getPayloadRows(i_index) {
            return this.ui.schema[i_index]
        },

        getPayloadColumns(rowIndex, i_index) {
            return this.ui.schema[rowIndex].children[i_index]
        },

        getPayloadSectionRows(rowIndex, colIndex, i_index) {
            return this.ui.schema[rowIndex].children[colIndex].children[i_index]
        },

        onDrop(rowIndex, colIndex, srowIndex, scolIndex, dropResult) {
            if (rowIndex !== null && colIndex !== null && srowIndex !== null && scolIndex !== null) {
                if (dropResult.payload.hasOwnProperty('children') === false) {
                    this.ui.schema[rowIndex].children[colIndex].children[srowIndex].children[scolIndex].children = applyDrag(this.ui.schema[rowIndex].children[colIndex].children[srowIndex].children[scolIndex].children, dropResult)
                }
            }
        },

        onDropRows(dropResult) {
            this.ui.schema = applyDrag(this.ui.schema, dropResult)
        },

        onDropColumns(rowIndex, dropResult) {
            if (dropResult.addedIndex !== null) {
                this.ui.schema[rowIndex].children = applyDrag(this.ui.schema[rowIndex].children, dropResult)
            }
        },

        onDropSectionRows(rowIndex, colIndex, dropResult) {
            if (dropResult.addedIndex !== null) {
                this.ui.schema[rowIndex].children[colIndex].children = applyDrag(this.ui.schema[rowIndex].children[colIndex].children, dropResult)
            }
        },

        onDropStandart(rowIndex, colIndex, dropResult) {
            if (rowIndex !== null && colIndex !== null) {
                if (!dropResult.payload.hasOwnProperty('children'))
                    this.ui.schema[rowIndex].children[colIndex].children = applyDrag(this.ui.schema[rowIndex].children[colIndex].children, dropResult)
            }
        },

        onDropMain(dropResult) {
            // console.log(dropResult)
            // this.schema = applyDrag(this.schema, dropResult);
        },

        element: element,
        idGenerator: idGenerator,

        //Row
        addRow(parentId) {
            let rowItem = {
                type: 'row',
                sectionRenderByTab: false,
                use2ColumnLayout: true,
                id: this.idGenerator('row'),
                name: null,
                children: []
            }

            if (parentId != false) {
                let el = this.findInTree(parentId, this.ui.schema)
                el.children.push(rowItem)
            } else {
                this.ui.schema.push(rowItem)
            }
        },

        //Column
        addCol(parentId) {
            let colItem = {
                type: 'col',
                id: this.idGenerator('col'),
                name: '',
                span: {
                    xs: 24,
                    sm: 24,
                    md: 24,
                    lg: 24
                },
                children: []
            }

            let el = this.findInTree(parentId, this.ui.schema)
            el.children.push(colItem)
        },

        //Section
        addSection(parentId, type) {
            let rowItem = {
                type: 'row',
                id: this.idGenerator('row'),
                children: [],
                visibleUserRoles: []
            }

            let sectionItem = {
                name: '',
                type: 'section',
                id: this.idGenerator('section'),
                span: {
                    xs: 24,
                    sm: 24,
                    md: 24,
                    lg: 24
                },
                children: [rowItem]
            }

            let el = this.findInTree(parentId, this.ui.schema)
            el.children.push(sectionItem)
        },

        addSectionCol(parentId, cols) {
            let el = this.findInTree(parentId, this.ui.schema)
            cols.forEach(item => {
                let colItem = {
                    type: 'col',
                    id: this.idGenerator('col'),
                    span: {
                        xs: item,
                        sm: item,
                        md: item,
                        lg: item
                    },
                    children: []
                }
                el.children.push(colItem)
            })
        },

        setMeta(item) {
            delete item['table']
            delete item['extra']
            item.schemaID = this.$props.schemaID
            return item
        },

        setMode(type, label) {
            this.mode = {
                type: type,
                label: label
            }
        },

        //Resizing options here
        getOffset(el) {
            el = el.getBoundingClientRect()
            return el.left + window.scrollX
        },

        handleResize(e, id) {
            this.currentDom = e.target.parentElement
            this.findElId = id
            console.log(this.findElId)
            e.target.parentElement.classList.remove('easing')
            window.addEventListener('mousemove', this.resize, {
                passive: true
            })
            window.addEventListener('mouseup', this.stopResize)
        },

        resize(e) {
            document.body.style.cursor = 'move'
            let parent = this.currentDom
            let currentX = this.getOffset(parent)
            let newWidth =
                e.clientX - currentX >= 897 ? 897 : e.clientX - currentX
            parent.style.width = newWidth + 'px'
        },

        stopResize(e) {
            let vm = this
            window.removeEventListener('mousemove', this.resize)
            window.removeEventListener('mouseup', this.stopResize)
            this.currentDom.classList.add('easing')

            setTimeout(() => {
                let parent = this.currentDom
                let currentWidth = parent.style.width.replace('px', '') * 1
                let colW = 60
                let colMarg = 16
                for (let i = 1; i <= 12; i++) {
                    let colStandartW = 0
                    if (i >= 2) {
                        colStandartW = colW * i + colMarg * (i - 1)
                    } else {
                        colStandartW = 60
                    }

                    if (
                        currentWidth >= colStandartW - 40 &&
                        currentWidth <= colStandartW + 40
                    ) {
                        console.log(vm.findElId)
                        let el = this.findInTree(vm.findElId, vm.ui.schema)
                        el.span[vm.$data.mode.type] = i * 2
                        parent.style.width = '100%'
                    } else if (
                        currentWidth >= colStandartW + 41 &&
                        currentWidth <= colStandartW + 76
                    ) {
                        parent.style.width = '100%'
                    }
                }
                this.currentDom = null
            }, 200)
        },

        findInTree(id, items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id == id) {
                    return items[i]
                } else if (_.isArray(items[i].children)) {
                    let found = this.findInTree(id, items[i].children)
                    if (found) {
                        return found
                    }
                }
            }
        },

        removeFromTree(parent, childIdToRemove) {
            if (
                typeof parent.children != 'undefined' &&
                parent.children.length
            ) {
                parent.children = parent.children
                    .filter(child => {
                        return child.id != childIdToRemove
                    })
                    .map(child => {
                        return this.removeFromTree(child, childIdToRemove)
                    })
            }
            return parent
        },

        deleteFromSchema(id) {
            this.ui.schema = this.ui.schema
                .filter(item => {
                    return item.id !== id
                })
                .map(item => {
                    return this.removeFromTree(item, id)
                })
        }
    }
}
</script>
