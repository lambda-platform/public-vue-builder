<template>
    <Row :class="`crud-table-row ${ expanded ? 'active' : ''}`" v-on:dblclick="expanded = !expanded">
        <Col span="5">
            <strong>{{ item.model }}
                <small class="key">{{ item.key != "" ? `[${item.key}]` : '' }}</small>
            </strong>
        </Col>
        <Col span="5">
            <Input v-model="item.label" :placeholder="item.model" :disabled="disabled"/>
        </Col>
        <Col span="4">
            <Select v-model="item.formType" :placeholder="lang._type" clearable filterable :disabled="disabled"

                    @on-change="changeItemType">
                <Option v-for="(item, index) in elementList" :value="item" :key="index" :label="item">{{ item }}
                </Option>
            </Select>
        </Col>
        <Col span="2" class="center">
            <i-switch v-model="item.hidden" size="small" :disabled="disabled" @on-change="setHiddenProp"></i-switch>
        </Col>
        <Col span="2" class="center">
            <i-switch v-model="item.disabled" size="small" :disabled="disabled"></i-switch>
        </Col>
        <Col span="2" class="center">
            <i-switch v-model="item.hasTranslation" size="small" :disabled="disabled"></i-switch>
        </Col>
        <Col span="3" class="center">
            <a href="javascript:void(0)"
               :class="`expand-toggle ${ expanded ? 'active' : ''} ${ disabled ? 'disabled' : '' }`"
               @click="expanded = !expanded" :disabled="disabled">
                <Icon type="ios-arrow-down"></Icon>
            </a>
        </Col>
        <Col span="24" :class="`item-more-options ${ expanded ? 'active' : '' }`">
            <expand-option v-if="expanded" :item="item" :edit="edit" :sub="sub" :schema="schema"
                           :otherGrids="otherGrids" :projectID="projectID"></expand-option>
        </Col>
    </Row>
</template>

<script>
import expandOption from "./ExpandOption";
import {elementList} from "./elements";

export default {
    props: ["item", "edit", "sub", "disabled", "schema", "otherGrids", "projectID"],
    components: {
        "expand-option": expandOption
    },
    computed: {
        lang() {
            const labels = ['_type'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },

    },
    data() {
        let elements = window.init.data_form_custom_elements ? [...elementList, ...window.init.data_form_custom_elements.map(element => {
            return element.element
        })] : elementList;

        return {
            loadConfig: true,
            elementList: elements,
            expanded: false
        };
    },
    created() {
        if (this.item.formType == null) {
            this.item.formType = 'Text';
        }
    },
    methods: {
        setHiddenProp(val) {
            if (val) {
                this.item.rules = [];
            }
        },

        changeItemType() {
            if (this.item.formType === 'Geographic') {
                if (!this.item.GeographicOption) {
                    this.item.GeographicOption = {
                        attributes: "",
                        allowMultiGeometryTypes: true,
                        geometryType: 'point',
                        zoom: 8,
                        center: {
                            lat: 47.91876971846709,
                            lng: 106.91736415028574
                        },
                        baseMap: 0,
                        checkByArea: false,
                        featureLayerUrl: '', //feature layer url
                        featureTitles: '', // title,desc,author
                        searchField: '',
                        searchFieldPlaceHolder: ''

                    }
                }
            } else {
                this.item.GeographicOption = undefined;
            }

            if (this.item.formType === 'Image') {
                if (this.item.file.isMultiple === undefined) {
                    this.item.file.isMultiple = false
                }
            } else {
                if (this.item.file) {
                    this.item.file.isMultiple = undefined;
                }
            }

            if (this.item.formType === 'Password') {
                if (!this.item.passwordOption) {
                    this.item.passwordOption = {
                        generate: false,
                        confirm: false,
                        edit_with_old_password: false
                    }
                }
            } else {
                this.item.passwordOption = undefined;
            }
        }
    }
};
</script>


