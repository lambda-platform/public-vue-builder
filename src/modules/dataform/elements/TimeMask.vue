<template>
    <FormItem :prop=rule :label=label>
        <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type">
            <input type="text" class="ivu-input ivu-input-default" v-mask="'##:##'" v-model="model.form[model.component]"
                   :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"
                   :disabled="meta && meta.disabled ? meta.disabled : false"
            />
        </div>
    </FormItem>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"],
};
</script>
