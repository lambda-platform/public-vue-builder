<template>
    <FormItem :label=label :prop=rule>
        <div class="html-prev" v-html="model.form[model.component]" ></div>
    </FormItem>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"]
};
</script>
