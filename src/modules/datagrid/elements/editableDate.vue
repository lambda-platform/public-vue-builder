<template>

    <DatePicker :value="value ? value : undefined"
                :open="open"
                class="grid-editor date"
                type="date" @on-change="getDateValue" size="small" placement="bottom-end">
        <template>
            <input :ref="'input'" class="date-editor"
                   mask="9999-99-99" type="text" v-model="value"/>
        </template>

        <a href="javascript:void(0)" @click="openPicker" class="date-pick-btn">
            <Icon type="ios-calendar-outline"></Icon>
        </a>
    </DatePicker>

    <!--<input :ref="'input'" class="grid-editor" v-mask="{mask: '9999-99-99', greedy: true}" type="text"-->
    <!--placeholder="yyyy-mm-dd"-->
    <!--v-model="value"/>-->
</template>
<script>
import Vue from "vue";
import moment from "moment";

export default Vue.extend({
    data() {
        return {
            value: '',
            open: false,
            cancelBeforeStart: true
        }
    },
    methods: {
        getValue() {
            return this.value;
        },

        getCharCodeFromEvent(event) {
            event = event || window.event;
            return (typeof event.which === "undefined") ? event.keyCode : event.which;
        },

        onKeyDown(event) {
            console.log(event);
        },

        isCharNumeric(charStr) {
            return /\d/.test(charStr);
        },

        isKeyPressedNumeric(event) {
            const charCode = this.getCharCodeFromEvent(event);
            const charStr = String.fromCharCode(charCode);
            return this.isCharNumeric(charStr);
        },

        openPicker() {
            console.log('working');
            this.open = !this.open;
        },

        getDate(date) {
            if (typeof date === 'string' || date instanceof String) {
                return date;
            } else {
                if ((new Date(date)).toString() !== "Invalid Date") {
                    return moment(date).format("YYYY-MM-DD");
                } else {
                    return moment(date * 1).format("YYYY-MM-DD");
                }
            }
        },

        getDateValue(value) {
            if (!(typeof value === "string" || value instanceof String)) {
                this.value = this.getDate(value);
            } else {
                this.value = value
            }
            this.open = false;

            this.focus.model = this.item.key;
            this.focus.val = value;
            this.$refs.input.value = value;
            this.$refs.input.focus();
        }
    },

    created() {
        this.value = this.params.value;
    },

    mounted() {
        if (this.params.editType == null) {
            Vue.nextTick(() => {
                if (this.$refs.input) {
                    this.$refs.input.focus();
                }
            });
        }
    }
})
</script>

<style scoped>

</style>
