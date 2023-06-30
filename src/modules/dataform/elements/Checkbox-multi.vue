<template>
    <FormItem :label=label :prop=rule>
        <Checkbox v-model="model.form[model.component]"></Checkbox>
    </FormItem>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta"]
};
</script>
