<template>
    <FormItem :label=label>
        <Select v-if="!loading" multiple v-model="model.form[model.component]"
                :placeholder="meta && meta.placeHolder ? meta.placeHolder : label" filterable>
            <Option v-for="item in computedOptions" :key=item.index :value="item.value">{{
                    item.label
                }}
            </Option>
        </Select>
    </FormItem>
</template>

<script>
import axios from "axios";

export default {
    props: ["model", "rule", "label", "meta"],
    data() {
        return {
            options: [],
            loading: true
        };
    },

    computed: {
      computedOptions(){
          return this.options.filter(item => this.isShow(item));
      }
    },

    mounted() {
        let dataUrl = `/lambda/krud/${this.meta.schemaID}/options`;
        axios.post(dataUrl, this.meta.filter.relation).then(({data}) => {
            this.options = data;
            this.loading = false;
        });
    },

    methods: {
        isShow(item) {
            if (item.value && item.label) {
                if (this.$props.meta.filter.relation.parentFieldOfForm) {
                    if (
                        this.$props.model.form[
                            this.$props.meta.filter.relation.parentFieldOfForm
                            ] == item.parent_value
                    )
                        return true;
                    else return false;
                } else return true;
            } else return false;
        }
    }
};
</script>
