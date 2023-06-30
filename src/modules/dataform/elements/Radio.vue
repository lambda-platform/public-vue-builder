<template>
    <FormItem :label=label :prop=rule>
        <RadioGroup :value="String(model.form[model.component])" @on-change="onchange">
            <Radio :label="item.value" v-for="item in options" :key=item.index :disabled="meta && meta.disabled ? meta.disabled : false">
                <span>{{item.label}}</span>
            </Radio>
        </RadioGroup>
    </FormItem>
</template>

<script>
    export default {
        props: ["model", "label", "rule", "meta", "relation_data"],
        data(){
            return {
                rmodel:String(this.model.form[this.model.component])
            }
        },
        computed: {
            options() {
                if (this.meta.options.length >= 1) {
                    return this.meta.options;
                } else {
                    return this.relation_data;
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
