<template>
    <FormItem :label=label :prop=rule>
        <RadioGroup v-model="model.form[model.component]">
            <Radio :label="item.value" v-for="item in options" :key=item.index :disabled="meta && meta.disabled ? meta.disabled : false">
                <span>{{item.label}}</span>
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
                    return this.meta.options;
                } else {
                    return this.relation_data;
                }
            }
        }
    };
</script>
