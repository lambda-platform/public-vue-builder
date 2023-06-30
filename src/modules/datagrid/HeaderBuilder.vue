<template>
    <div class="grid-header">
        <div class="grid-header-title">
            <h3>
                {{lang.tableHeaderTemplate}}
            </h3>
            <div class="grid-header-title-control">
                <label>
                    {{lang.checkModel}}
                    <i-switch v-model="header.preview" size="small"
                              @on-change="setHeader"></i-switch>
                </label>

                <label>
                    {{lang.createHeaderTemplate}}
                    <i-switch v-model="header.render" size="small"
                              @on-change="setHeader"></i-switch>
                </label>
                <span class="divider"></span>
                <Button type="primary" :disabled="!header.render" ghost size="small" @click="addTr"><i
                    class="ti-plus"></i>{{lang.addLine}}
                </Button>
            </div>
        </div>

        <div class="grid-header-body">
            <div class="grid-header-table-wrapper" v-if="header.render">
                <table v-if="header.preview" border="1" class="preview-table">
                    <tr v-for="tr in header.structure" :key="tr.index">
                        <td
                            v-for="td in tr.children"
                            :key="td.index"
                            :colspan="td.colspan"
                            :rowspan="td.rowspan">
                            <div :style="`width: ${td.width}; height: ${td.height}`">
                                <div :style="td.rotate ? 'transform: rotate(-90deg);' : ''">{{td.label}}</div>
                            </div>
                        </td>
                    </tr>
                </table>

                <table v-else border="1" class="grid-header-table">
                    <tr v-for="tr in header.structure" :key="tr.index">
                        <td class="add-td">
                            <div class="tr-control">
                                <a href=javascript:void(0) @click="addTd(tr.id)"><i class="ti-plus"></i></a>
                                <Poptip
                                    class="del-tr"
                                    confirm
                                    :title="lang.deleteThisLine+'?'"
                                    @on-ok="deleteEl(tr.id)"
                                    placement="right"
                                    @on-cancel="cancel">
                                    <a href=javascript:void(0)><i class="ti-trash"></i></a>
                                </Poptip>
                            </div>
                        </td>
                        <td v-for="(td, index) in tr.children" :key="index" :colspan="td.colspan"
                            :rowspan="td.rowspan" class="dev">

                            <div class="td-holder">
                                <Tooltip class="add-td-next" :content="lang.addColumnAfterThisColumn" placement="top">
                                    <a href=javascript:void(0)
                                       @click="addTdNext(tr.id, td.id, index)"><i
                                        class="ti-plus"></i></a>
                                </Tooltip>

                                <Poptip
                                    class="del-td"
                                    confirm
                                    :title="lang.pleaseDeleteThisCell"
                                    @on-ok="deleteEl(td.id)"
                                    @on-cancel="cancel">
                                    <a href="javascript:void(0)">
                                        <i class="ti-close"></i>
                                    </a>
                                </Poptip>

                                <input type="text" v-model="td.label" placeholder="нэр" style="margin-bottom: 3px;"/>
                                <input type="text" v-model="td.color" placeholder="өнгө"/>
                                <div class="td-control">
                                    <div>
                                        <span>w</span>
                                        <input type="text" v-model="td.width" :placeholder="lang.widthu">
                                    </div>
                                    <div>
                                        <span>h</span>
                                        <input type="text" v-model="td.height" :placeholder="lang.height">
                                    </div>
                                    <div>
                                        <span>col</span>
                                        <input type="text" v-model="td.colspan" :placeholder="lang.column">
                                    </div>
                                    <div>
                                        <span>row</span>
                                        <input type="text" v-model="td.rowspan" :placeholder="lang.row">
                                    </div>
                                    <div>
                                        <span>deg</span>
                                        <Checkbox v-model="td.rotate"></Checkbox>
                                    </div>
                                </div>

                                <Select v-model="td.model" size="small" clearable placeholder="model">
                                    <Option v-for="item in schema" :value="item.model" :key="item.model">{{
                                            item.label ? item.label : item.model }}
                                    </Option>
                                </Select>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

</template>

<script>

import {idGenerator} from "./utils/methods"

export default {
    props: ['header', 'schema'],
    computed: {
        lang() {
            const labels = ['type', 'tableHeaderTemplate', 'createHeaderTemplate', 'addLine', 'addLineBelow', 'deleteThisLine', 'addColumnAfterThisColumn', 'pleaseDeleteThisCell', 'checkModel',
                'height', 'widthu', "row", 'column', 'model', ''
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
    },
    created() {
        // this.header.structure = [];

        // if (this.header.structure.length == 0) {
        //     let tr = {
        //         type: 'tr',
        //         children: []
        //     };
        // this.schema.forEach(item => {
        //     if (item.hide == false) {
        //         let td = {
        //             type: 'td',
        //             label: item.label != '' ? item.label : 'label',
        //             colspan: 1,
        //             rowspan: 1,
        //             rotate: false,
        //             width: 100
        //         }
        //         tr.children.push(td);
        //     }
        // });
        // this.header.structure.push(tr);
        // }
    },
    methods: {
        findInTree(id, items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id == id) {
                    return items[i];
                } else if (_.isArray(items[i].children)) {
                    let found = this.findInTree(id, items[i].children);
                    if (found) {
                        return found;
                    }
                }
            }
        },

        removeFromTree(parent, childIdToRemove) {
            if (
                typeof parent.children != "undefined" &&
                parent.children.length
            ) {
                parent.children = parent.children
                    .filter(child => {
                        return child.id != childIdToRemove;
                    })
                    .map(child => {
                        return this.removeFromTree(child, childIdToRemove);
                    });
            }
            return parent;
        },

        addTr() {
            let td = {
                id: idGenerator('cell'),
                type: 'td',
                colspan: 1,
                rowspan: 1,
                label: 'label',
                rotate: 0,
                width: 100,
                height: 'a',
                model: null
            };

            let tr = {
                id: idGenerator('row'),
                type: 'tr',
                children: [td]
            };

            this.header.structure.unshift(tr);
        },

        deleteEl(id) {
            this.header.structure = this.header.structure
                .filter(item => {
                    return item.id !== id;
                })
                .map(item => {
                    return this.removeFromTree(item, id);
                });
        },

        addTd(id) {
            let tr = this.findInTree(id, this.header.structure);

            let td = {
                id: idGenerator('cell'),
                type: 'td',
                colspan: 1,
                rowspan: 1,
                label: 'label',
                rotate: false,
                width: 100,
                height: 'a',
                model: null
            };

            tr.children.push(td);
        },

        addTdNext(trId, tdId, index) {
            let tr = this.findInTree(trId, this.header.structure);
            let tdFind = tr.children.find(td => td.id == tdId);
            let td = _.clone(tdFind);
            td.id = idGenerator('cell');
            td.model = null;
            td.label = 'label';
            td.rotate = false;

            tr.children.join();
            tr.children.splice(index + 1, 0, td);
            tr.children.join();
        }
    }
}
</script>
