<template>
    <FormItem :prop=rule :label=label hidden>
        <Input type="hidden" v-model="model.form[model.component]" :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label" />
    </FormItem>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"]
};
</script>
