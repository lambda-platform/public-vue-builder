<template>
    <FormItem :label=label>
        <Input type="text" v-model="model.form[model.component]" />
    </FormItem>
</template>

<script>
export default {
    props: ["model", "label"]
};
</script>
