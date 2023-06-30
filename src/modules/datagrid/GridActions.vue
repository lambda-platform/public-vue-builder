<template>
    <span class="grid-actions">
        <span v-for="item in params.actions" :key="item.index">
            <Tooltip v-if="item == 'qe'" :content="lang.easyEdit">
                <Button shape="circle" icon="ios-bolt" size="small"
                        @click="params.methods.quickEdit(params.value)"></Button>
            </Tooltip>

            <Tooltip v-if="item == 'cl'" :content="lang.copy">
                <Button shape="circle" icon="ios-copy" size="small"
                        @click="params.methods.clone(params.value)"></Button>
            </Tooltip>


            <Tooltip v-if="item == 'v'" :content="lang.view">
                <Button shape="circle" icon="md-eye" size="small" @click="params.methods.view(params.value)"></Button>
            </Tooltip>

            <Tooltip
                v-if="item == 'e'
            && (params.actionsVisibility==null
            || !('e' in params.actionsVisibility)
            || ('e' in params.actionsVisibility
            && params.data[params.actionsVisibility.e.field]!=params.actionsVisibility.e.value)) && isCanEdit()"
                :content="lang.edit">
                <Button shape="circle" icon="md-create" size="small"
                        @click="edit"></Button>
            </Tooltip>

            <Poptip
                v-if="item == 'd'
            && (params.actionsVisibility==null
            || !('d' in params.actionsVisibility)
            || ('d' in params.actionsVisibility
            && params.data[params.actionsVisibility.d.field]!=params.actionsVisibility.d.value))  && isCanDelete()"
                confirm :title="lang.ruSureYouDeleteInfo" :transfer="true"
                :ok-text="lang.yes" :cancel-text="lang.no"
                @on-ok="params.methods.remove(params.value, params.rowIndex)">
                <Button shape="circle" icon="ios-trash" size="small"></Button>
            </Poptip>
        </span>

        <span v-for="item in params.customActions" :key="item.index">
            <Tooltip v-if="item.tooltip
            && (!('condition' in item)
            || params.data[item.condition.field]!=item.condition.value)"
                     :content="item.tooltip" placement="left">
                <Button shape="circle" size="small" class="grid-action-btn"
                        @click="item.method(params.data)"><i :class="item.icon"></i>
                </Button>
            </Tooltip>
            <Button v-else-if="!('condition' in item)
            || params.data[item.condition.field]!=item.condition.value"
                    shape="circle" size="small"
                    class="grid-action-btn"
                    @click="item.method(params.data)">
                <i :class="item.icon"></i>
            </Button>
        </span>
    </span>
</template>

<script>
import Vue from "vue";

import {isCan} from "./utils/permission"

export default Vue.extend({
    computed: {
        lang() {
            const labels = ['easyEdit', 'view', 'yes', 'no', 'ruSureYouDeleteInfo', 'edit',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
    },
    mounted()
    {
      console.log("this.params.methods");
      console.log(this.params.methods);
    },
    methods: {
        edit() {
            this.params.methods.edit(this.params.value, this.params.data)
        },

        isCanEdit() {
            if (this.params.methods.permissions) {
                if (this.params.methods.permissions.gridEditConditionJS != "" && this.params.methods.permissions.gridEditConditionJS != null && this.params.methods.permissions.gridEditConditionJS != undefined) {
                    return isCan(this.params.methods.permissions.gridEditConditionJS, this.params.data)
                }
            }
            return true;
        },

        isCanDelete() {
            if (this.params.methods.permissions) {
                if (this.params.methods.permissions.gridDeleteConditionJS != "" && this.params.methods.permissions.gridDeleteConditionJS != null && this.params.methods.permissions.gridDeleteConditionJS != undefined) {
                    return isCan(this.params.methods.permissions.gridDeleteConditionJS, this.params.data)
                }
            }

            return true;
        }
    }

});
</script>

