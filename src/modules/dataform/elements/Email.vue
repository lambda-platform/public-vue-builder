<template>
    <FormItem :label=label :prop=rule>
        <Input type="email" v-model="model.form[model.component]" :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label" />
    </FormItem>
</template>

<script>
export default {
  props: ["model", "label", "rule", "meta"]
};
</script>
