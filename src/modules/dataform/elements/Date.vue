<template>
    <FormItem :label=label :prop=rule>
        <DatePicker :value="model.form[this.model.component] ? model.form[this.model.component] : undefined"
                    type="date" @on-change="getDateValue"
                    placement="bottom-end"
                    :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"
                    :disabled="meta && meta.disabled ? meta.disabled : false"></DatePicker>
    </FormItem>
</template>

<script>
import { getDate } from "../utils/date";
export default {
    props: ["model", "rule", "label", "meta"],
    methods: {
        getDateValue(value) {
            if(value=='') {
                this.clearValue(value);
            }
            else {
                if (!(typeof value === "string" || value instanceof String)) {
                    this.model.form[this.model.component] = getDate(
                        this.model.form[this.model.component]
                    );
                } else {
                    this.model.form[this.model.component] = value
                }
            }
        },
        clearValue(value){
            if(value=='') {
                this.model.form[this.model.component] = null;
            }
        }
    },
    mounted() {
        this.clearValue(this.model.form[this.model.component]);
    }
};
</script>
