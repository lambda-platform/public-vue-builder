<template>
    <li :id="data.id"
        :data-link_to="data.link_to"
        :data-url="data.url"
        :data-title="data.title"
        :data-icon="data.icon"
        :data-svg="data.svg"
        :data-c="data.c"
        :data-r="data.r"
        :data-u="data.u"
        :data-d="data.d"
        class="menu-tree-item">
        <div class="clickable sortDiv">
            <div class="menu-icon">
                <!--        <div class="ivu-input-inner-container" style=""><i-->
                <!--            class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i> <input-->
                <!--            @focus="showIconModal"-->
                <!--            autocomplete="off" spellcheck="false" type="text" placeholder="ICON" v-model="data.icon"-->
                <!--            class="ivu-input ivu-input-small">-->
                <!--        </div>-->
                <button type="button" class="ivu-btn ivu-btn-default ivu-btn-circle ivu-btn-icon-only"
                        @click="showIconModal">
                    <i :class="`${data.icon} menu-icon-preview`" v-if="data.icon"></i>
                    <inline-svg :src="data.svg" v-else-if="data.svg"></inline-svg>
                    <span v-else></span>
                </button>
            </div>

            <select :placeholder="lang.menuType" class="menu_types ivu-input ivu-input-small" v-model="data.link_to">
                <option value="crud">{{ lang.Consolidation_forms_and_tables }}</option>
                <option value="link">{{ lang._link }} 'a'</option>
                <option value="router-link">{{ lang._link }} 'spa'</option>
                <option value="iframe">{{ lang.iframe_page }}</option>
                <option value="noAction">{{ lang.No_action }}</option>
                <option value="divider">{{ lang._division }}</option>
                <option value="noActionSubTop">{{ lang.no_action_sub_top }}</option>
            </select>

            <div class="ivu-input-wrapper ivu-input-wrapper-small ivu-input-type menu-cruds"
                 v-if="data.link_to == 'crud'">
                <div class="ivu-input-inner-container" style="">
                    <input list="cruds" name="cruds" type="text" autocomplete="off" v-model="url" @change="setCrud"
                           :placeholder="lang.name" class="ivu-input ivu-input-small">
                    <div class="" v-show="url != null" @click="url = null">
                        <i class="ivu-icon ivu-icon-ios-close-circle ivu-select-arrow data-clear-icon"></i>
                    </div>
                </div>
            </div>

            <div class="menu-title"
                 v-if="data.link_to == 'link' || data.link_to == 'router-link' || data.link_to == 'iframe'">
                <div class="ivu-input-wrapper ivu-input-wrapper-small ivu-input-type">
                    <div class="ivu-input-inner-container" style=""><i
                        class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                        <input
                            autocomplete="off" spellcheck="false" type="text" :placeholder="lang.connectionPath"
                            v-model="data.url"
                            class="ivu-input ivu-input-small">
                    </div>
                </div>
            </div>

            <div class="ivu-input-wrapper ivu-input-wrapper-small ivu-input-type menu-cruds"
                 v-if="data.link_to != 'crud'">
                <div class="ivu-input-inner-container" style="">
                    <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                    <input v-model="data.title" autocomplete="off" spellcheck="false" type="text"
                           :placeholder="lang.name" class="ivu-input ivu-input-small">
                </div>

            </div>

            <select size="small" filterable :placeholder="lang.target" v-if="data.link_to == 'link'"
                    class="menu_types  ivu-input ivu-input-small"
                    v-model="data.target">
                <option value="_self">{{ lang.self }}</option>
                <option value="_blank">{{ lang.blank }}</option>
                <option value="_new">{{ lang._new }}</option>
            </select>

            <div class="buttons">
                <button type="button" class="ivu-btn ivu-btn-default ivu-btn-circle ivu-btn-icon-only" @click="addItem">
                    <i class="ivu-icon ivu-icon-md-add"></i>
                </button>
                <button type="button" class="ivu-btn ivu-btn-default ivu-btn-circle ivu-btn-icon-only"
                        @click="deleteChild">
                    <i class="ivu-icon ivu-icon-md-remove"></i></button>
            </div>
        </div>

        <ul class="dd-list" v-if="data.children && data.children.length >= 1">
            <component v-for="(menu_item, index) in data.children" :is="element()" :key="index"
                       :menuIndex="getIndex(index)"
                       :data="menu_item"
                       :cruds="cruds"
                       :meta="meta"
                       @addChild="addChildEmit"
                       @showIconSelector="showIconChild"
                       @deleteChild="deleteChilddEmit"
            ></component>
        </ul>
    </li>
</template>

<script>
import InlineSvg from 'vue-inline-svg';

export default {
    props: ["data", "cruds", "menuIndex", "meta"],
    components: {
        InlineSvg,
    },
    computed: {
        lang() {
            const labels = ['Consolidation_forms_and_tables', '_link', 'iframe_page', 'name', 'menuType', 'connectionPath', 'target',
                'self', 'blank', '_new', 'No_action', '_division', 'no_action_sub_top'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
        myValue() {
            return this.data.url
        }

    },
    methods: {
        showIconModal() {
            this.$emit('showIconSelector', this.menuIndex)
        },
        getIndex(index) {
            let pre_myIndex = [index];
            let myIndex = this.menuIndex.concat(pre_myIndex);
            return myIndex;
        },
        setCrud() {
            let crud_index = this.$crudList.findIndex(crud => crud.label === this.url);
            if (crud_index >= 0) {
                this.data.url = this.$crudList[crud_index].value;
            }
        },
        element() {
            return require(`./MenuItem`).default;
        },

        addChildEmit(menuIndex) {
            this.$emit("addChild", menuIndex);
        },
        showIconChild(menuIndex) {
            this.$emit("showIconSelector", menuIndex);
        },

        deleteChilddEmit(menuIndex) {
            this.$emit("deleteChild", menuIndex);
        },

        addItem() {
            this.$emit("addChild", this.menuIndex);
        },
        deleteChild() {
            this.$emit("deleteChild", this.menuIndex);
        },
        setInput() {
            let crud_index = this.$crudList.findIndex(crud => crud.value === this.data.url);
            if (crud_index >= 0) {
                this.url = this.$crudList[crud_index].label
            }
        }
    },
    data() {
        return {
            url: null
        }
    },
    mounted() {
        if (this.data.url !== null && this.data.url !== "") {
            this.setInput();
        }
    },
    watch: {
        myValue() {
            this.setInput();
        }
    }


};
</script>
