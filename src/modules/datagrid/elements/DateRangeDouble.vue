<template>
    <div>
        <FormItem :label=label>
            <div class="daterange-double">
                <DatePicker type="date" placement="bottom-end" v-model="start" @on-change="getDateValue" placeholder="Эхлэх"></DatePicker>
                <span class="separator"> - </span>
                <DatePicker type="date" placement="bottom-end" v-model="end" @on-change="getDateValue" placeholder="Дуусах"></DatePicker>
            </div>
        </FormItem>
    </div>
</template>

<script>
import { getDate } from "../utils/date";
export default {
    props: ["model", "label", "meta"],
    data() {
        return {
            start: null,
            end: null
        };
    },
    methods: {
        getDateValue() {
            this.model.form[this.model.component] = [getDate(this.start), getDate(this.end)];
        }
    }
};
</script>
