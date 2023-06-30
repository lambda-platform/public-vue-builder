<template>
    <FormItem :prop=rule>
        <Checkbox
            class="lambda-checkbox-small"
            v-model="model.form[model.component]"
            :disabled="meta && meta.disabled ? meta.disabled : false"
            :true-value="1"
            :false-value="0">{{ label }}
        </Checkbox>
        <Alert type="warning" v-if="meta.warn">{{meta.warn}}</Alert>
    </FormItem>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta"],
};
</script>
