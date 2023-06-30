<template>
    <FormItem :label=label :prop=rule>
        <TimePicker :value="this.model.form[this.model.component] ? this.model.form[this.model.component] : undefined" type="time" v-model="model.form[model.component]" @on-change="getDateValue" placement="bottom-end" :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"></TimePicker>
    </FormItem>
</template>

<script>
    import { toDateTime } from "../utils/date";
    export default {
        props: ["model", "rule", "label", "meta"],
        methods: {
            getDateValue(value) {
                if (!(typeof value === "string" || value instanceof String)) {
                    this.model.form[this.model.component] = toDateTime(
                        this.model.form[this.model.component]
                    );
                }else {
                    this.model.form[this.model.component] = value
                }
            }
        }
    };
</script>