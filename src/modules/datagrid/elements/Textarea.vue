<template>
    <FormItem :label=label>
        <Input type="textarea" v-model="model.form[model.component]" />
    </FormItem>
</template>

<script>
export default {
    props: ["model", "label"]
};
</script>
