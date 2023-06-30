<template>
    <FormItem :label=label :prop=rule>
        <div id="menu-tree-creator">
            <Button type="success" shape="circle" icon="md-add" @click="addItem"></Button>
            <div id="sort-container">
                <ul class="menuTree listsClass" id="sortable-list">
                    <MenuItem
                        v-if="!destroy && $crudList"
                        v-for="(item, index) in items"
                        :key="index"
                        :data="item"
                        :meta="meta"
                        :menuIndex="[index]"
                        @addChild="addChild"
                        @showIconSelector="showIconSelector"
                        @deleteChild="deleteChild"
                        :cruds="cruds">
                    </MenuItem>
                </ul>
            </div>
        </div>

        <datalist id="cruds" size="small" filterable class="menu_types">
            <option v-for="item in $crudList" :key=item.index :data-value="item.value" :value="item.label"/>
        </datalist>
        <IconSelector @setIcon="setIcon" :iconSelector="iconSelector"></IconSelector>
    </FormItem>
</template>

<script>
import MenuItem from './MenuItem/MenuItem'
import IconSelector from '../../../components/IconSelector'
import {isValid} from "../utils/methods";

window.jQuery = require('jquery');
require('./MenuItem/sortableList').default;

export default {
    props: ["model", "rule", "label", "meta", "relation_data", "do_render"],
    components: {
        MenuItem: MenuItem,
        IconSelector: IconSelector
    },

    data() {
        return {
            destroy: false,
            ignoreChange: false,
            items: [],
            cruds: [],
            iconSelector: false,
            iconMenuIndex: null
        };
    },

    computed: {
        lang() {
            const labels = ['search'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },

        crudData() {
            if (isValid(this.meta) && isValid(this.meta.options) && this.meta.options.length >= 1) {
                return this.meta.options;
            } else {
                return this.relation_data;
            }
        },

        menuData() {
            return this.model.form[this.model.component];
        },

        realValue() {
            return this.model.form[this.model.component];
        }
    },

    mounted() {
        this.set_sort();
        if (Array.isArray(this.relation_data)) {
            if (this.relation_data.length >= 1) {
                Vue.prototype.$crudList = this.relation_data;
            }
        }
    },

    beforeDestroy() {
        this.destroy_sort();
    },

    watch: {
        relation_data() {
            if (Array.isArray(this.relation_data)) {
                if (this.relation_data.length >= 1) {
                    Vue.prototype.$crudList = this.relation_data;
                }
            }
        },

        menuData(value, oldValue) {
            if (!this.ignoreChange) {
                if ((oldValue && !value) || (value && !oldValue)) {
                    if (!value) {
                        this.items = [];
                    } else {
                        this.initTree();
                    }
                }
            }
        },

        items: {
            handler: function (val, oldVal) {
                if (val.length > 0) {
                    this.ignoreChange = true;
                    this.changeValue();

                    let height = jQuery("#sortable-list").height();
                    jQuery("#sort-container").height(height + 20);
                } else {
                    Vue.set(this.model.form, this.model.component, undefined);
                }
            },
            deep: true
        },

        do_render(value) {
            if (!value) {
                this.ignoreChange = false;
                this.items = [];

                Vue.set(this.model.form, this.model.component, undefined);
            }
        },
    },

    methods: {
        setIcon(icon, isSVG, isClass) {
            if (isClass) {
                Vue.set(this.items[this.iconMenuIndex[0]], "icon", icon);
                if (this.iconMenuIndex.length >= 2) {
                    let itemIndex = this.iconMenuIndex[0];
                    this.iconMenuIndex.splice(0, 1);
                    this.items[itemIndex] = this.setIconFind(this.items[itemIndex], this.iconMenuIndex, icon, isSVG, isClass);
                }

                return false;
            }

            if (this.iconMenuIndex.length >= 2) {
                let itemIndex = this.iconMenuIndex[0];
                this.iconMenuIndex.splice(0, 1);
                this.items[itemIndex] = this.setIconFind(this.items[itemIndex], this.iconMenuIndex, icon, isSVG, isClass);
            } else {
                if (isSVG) {
                    Vue.set(this.items[this.iconMenuIndex[0]], "svg", icon);
                    Vue.set(this.items[this.iconMenuIndex[0]], "icon", null);
                } else {
                    Vue.set(this.items[this.iconMenuIndex[0]], "svg", null);
                    Vue.set(this.items[this.iconMenuIndex[0]], "icon", icon);
                }

                this.iconSelector = false;
                this.iconMenuIndex = null;
                this.iconSearch = "";
            }
        },


        setIconFind(item, childIndexs, icon, isSVG, isClass) {
            if (isClass) {
                Vue.set(item.children[childIndexs[0]], "icon", icon);
                return item;
            }

            if (childIndexs.length >= 2) {
                let itemIndex = childIndexs[0];
                childIndexs.splice(0, 1);
                item.children[itemIndex] = this.setIconFind(item.children[itemIndex], childIndexs, icon, isSVG);
            } else {
                if (isSVG) {
                    Vue.set(item.children[childIndexs[0]], "svg", icon);
                    Vue.set(item.children[childIndexs[0]], "icon", null);
                } else {
                    Vue.set(item.children[childIndexs[0]], "svg", null);
                    Vue.set(item.children[childIndexs[0]], "icon", icon);
                }
                this.iconSelector = false;
                this.iconMenuIndex = null;
                this.iconSearch = "";
            }
            return item;
        },

        showIconSelector(menuIndex) {
            this.iconMenuIndex = menuIndex;
            this.iconSelector = true;
        },

        getNewChild() {
            let newChild = {
                link_to: null,
                url: null,
                title: null,
                icon: null,
                svg: null,
                children: [],
                id: this.guid()
                // c: true,
                // r: true,
                // u: true,
                // d: true
            };
            return newChild;
        },

        addChild(mindex) {
            let items = _.cloneDeep(this.items);
            if (mindex.length >= 2) {
                let itemIndex = mindex[0];
                mindex.splice(0, 1);
                items[itemIndex] = this.addChildFind(items[itemIndex], mindex);
            } else {
                items[mindex[0]].children.push(this.getNewChild())
            }
            Vue.set(this.$data, "items", items);
        },

        clearList() {
            let elements = jQuery('.menu-tree-item');
            elements.map(element_index => {
                if (jQuery(elements[element_index]).css('position') == 'relative') {
                    jQuery(elements[element_index]).remove();
                }
            })
        },

        addChildFind(item, childIndexs) {
            let newItem = _.cloneDeep(item);
            if (childIndexs.length >= 2) {
                let itemIndex = childIndexs[0];
                childIndexs.splice(0, 1);
                newItem.children[itemIndex] = this.addChildFind(newItem.children[itemIndex], childIndexs);
            } else {
                newItem.children[childIndexs[0]].children.push(this.getNewChild());
            }
            return newItem;
        },

        deleteChild(mindex) {
            let items = _.cloneDeep(this.items);
            if (mindex.length >= 2) {
                let itemIndex = mindex[0];
                mindex.splice(0, 1);
                items[itemIndex] = this.deleteChildFind(items[itemIndex], mindex);
            } else {
                items.splice(mindex[0], 1)
            }
            setTimeout(() => {
                let height = jQuery("#sortable-list").height();
                jQuery("#sort-container").height(height - 20);
            }, 1);
            Vue.set(this.$data, "items", items);
        },

        deleteChildFind(item, childIndexs) {
            let newItem = _.cloneDeep(item);
            if (childIndexs.length >= 2) {
                let itemIndex = childIndexs[0];
                childIndexs.splice(0, 1);
                newItem.children[itemIndex] = this.deleteChildFind(newItem.children[itemIndex], childIndexs);
            } else {
                newItem.children.splice(childIndexs[0], 1)
            }
            setTimeout(() => {
                let height = jQuery("#sortable-list").height();
                jQuery("#sort-container").height(height - 20);
            }, 1);
            return newItem;
        },

        destroy_sort() {
            jQuery('#sortable-list,#sortable-list *').unbind().removeData();
            jQuery('#sortableListsBase').unbind().removeData();
            jQuery('#sortableListsBase').remove();
        },

        set_sort() {
            var optionsPlus = {
                ignoreClass: 'clickable',
                placeholderCss: {'background-color': '#ff8'},
                hintCss: {'background-color': '#bbf'},
                opener: {
                    active: true,
                    as: 'html',  // if as is not set plugin uses background image
                    close: '<i class="" aria-hidden="true"></i>',
                    open: '<i class="" aria-hidden="true"></i>',
                    openerCss: {
                        'display': 'inline-block',
                        'float': 'left',
                        'margin-left': '-35px',
                        'margin-right': '5px',
                        'font-size': '1.1em'
                    }
                },
                onChange: (cEl) => {
                    let pre_data = jQuery('#sortable-list').sortableListsToHierarchy();
                    Vue.set(this.$data, "destroy", true);
                    Vue.set(this.$data, "items", pre_data);
                    this.clearList()
                    setTimeout(() => {
                        Vue.set(this.$data, "destroy", false);
                    }, 40)
                },
            };
            jQuery('#sortable-list').sortableLists(optionsPlus);
        },

        addItem() {
            let items = _.cloneDeep(this.items);
            items.push(this.getNewChild());
            Vue.set(this.$data, "items", items);
        },

        changeValue() {
            Vue.set(this.model.form, this.model.component, JSON.stringify(this.items));
        },

        initTree() {
            if (this.model.form[this.model.component])
                Vue.set(this.$data, "items", JSON.parse(this.model.form[this.model.component]));
            setTimeout(() => {
                let height = jQuery("#sortable-list").height();
                jQuery("#sort-container").height(height - 20);
            }, 200);
        },

        guid() {
            const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
        }
    }
};
</script>
