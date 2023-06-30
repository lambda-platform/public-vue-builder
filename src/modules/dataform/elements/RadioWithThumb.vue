<template>
    <FormItem :label=label :prop=rule>
        <RadioGroup :value="String(model.form[model.component])" type="button" class="radio-with-thumb" @on-change="onchange">
            <Radio :label="item.value" v-for="item in options" :key=item.index
                   :disabled="meta && meta.disabled ? meta.disabled : false">
                    <img :src="item.thumb" :alt="item.label" :title="item.label">
            </Radio>
        </RadioGroup>
    </FormItem>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta", "relation_data"],
    computed: {
        options() {
            if (this.meta.options.length >= 1) {
                return this.meta.options.sort(function (x, y) {
                    return x.value - y.value;
                });
            } else {

                return this.relation_data.sort(function (x, y) {
                    return x.value - y.value;
                });
            }
        }
    },
    methods:{
        onchange(val)
        {
            this.model.form[this.model.component]=val;
        }
    }
};
</script>
