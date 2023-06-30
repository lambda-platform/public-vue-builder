<template>
    <FormItem :label=label :prop=rule>
        <Input v-model="model.form[model.component]" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." :disabled="meta && meta.disabled ? meta.disabled : false"></Input>
    </FormItem>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"]
};
</script>
