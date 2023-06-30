<template>
    <FormItem :label=label :prop=rule>
        <ColorPicker v-model="model.form[model.component]"  style="float: right" alpha />
    </FormItem>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta"],
    computed: {
        value() {
            return this.model.form[this.model.component];
        }
    },
    beforeMount(){
        if(this.value === null){
            this.model.form[this.model.component] = '';
        }
    },
    watch: {
        value(value, oldValue) {

            if(value === null){
                this.model.form[this.model.component] = '';
            }

        }
    }
};
</script>
