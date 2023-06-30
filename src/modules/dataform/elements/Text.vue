<template>
    <FormItem :prop=rule :label=label>
        <Input type="text" v-model="model.form[model.component]"
               :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"
               autocomplete="off"
               :disabled="meta && meta.disabled ? meta.disabled : false"
        />
    </FormItem>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"],

};
</script>
