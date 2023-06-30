<template>
    <FormItem :label=label>
        <DatePicker type="daterange" placement="bottom-end" @on-change="getDateValue"
                    :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"></DatePicker>
    </FormItem>
</template>

<script>
import {getDate} from "../utils/date";

export default {
    props: ["model", "label", "meta"],
    methods: {
        getDateValue(value) {
            if (value) {
                this.model.form[this.model.component] = value.map(item => {
                    return getDate(item);
                });
            }
        }
    }
};
</script>
