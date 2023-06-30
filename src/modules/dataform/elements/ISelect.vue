<template>
    <FormItem :label=label :prop=rule>
        <Select v-if="!meta.relation.multiple" :disabled="meta && meta.disabled ? meta.disabled : false"
                v-model="model.form[model.component]"
                :placeholder="meta && meta.placeHolder ? meta.placeHolder : label"
                filterable clearable
                @on-clear="onClear">
            <Option v-for="item in options" :key=item.index :value="item.value" v-if="isShow(item)">
                {{ item.label }}
            </Option>
        </Select>

        <Select v-else v-model="model.form[model.component]"
                :disabled="meta && meta.disabled ? meta.disabled : false"
                :placeholder="meta && meta.placeHolder ? meta.placeHolder : label"
                filterable clearable multiple
                @on-clear="onClear">
            <Option v-for="item in options" :key=item.index :value="item.value" v-if="isShow(item)">
                {{ item.label }}
            </Option>
        </Select>
    </FormItem>
</template>

<script>
import Button from "iview/src/components/button/button";

export default {
    components: {Button},
    props: ["model", "rule", "label", "meta", "disabled", "relation_data"],

    computed: {
        options() {
            if (typeof this.meta.options !== "undefined" && this.meta.options.length >= 1) {
                return this.meta.options;
            } else {
                return this.relation_data;
                /*
                  if (this.meta.relation.filter == "") {
                      if (this.relations[this.meta.relation.table]) {
                          if (this.relations[this.meta.relation.table]['data']) {
                              return this.relations[this.meta.relation.table]['data']
                          } else
                              return [];
                      } else
                          return [];
                  } else {
                      if (this.relations[this.meta.model]) {
                          if (this.relations[this.meta.model]['data']) {
                              return this.relations[this.meta.model]['data']
                          } else
                              return [];
                      } else
                          return [];
                  }*/
            }
        },
    },

    created() {
    },

    methods: {
        isShow(item) {
            if (item.value != null && item.value != undefined && item.label) {
                if (this.$props.meta.relation.parentFieldOfForm) {
                    if (this.$props.model.form[this.$props.meta.relation.parentFieldOfForm] == item.parent_value) {
                        return true;
                    } else return false;
                } else return true;
            } else return false;
        },

        onClear() {
            this.model.form[this.model.component] = null;
        }
    }
};
</script>
