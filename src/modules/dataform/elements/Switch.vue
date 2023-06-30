<template>
    <FormItem :label=label :prop=rule>
        <i-switch v-model="model.form[model.component]"></i-switch>
    </FormItem>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta"]
};
</script>
