<template>
    <DatePicker :ref="'input'" type="date" placeholder="Select date" v-model="value"
                @on-change="onKeyDown($event)"></DatePicker>
</template>
<script>
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            value: '',
            cancelBeforeStart: true
        }
    },
    methods: {
        getValue() {
            return this.value;
        },

        // isCancelBeforeStart() {
        //     return this.cancelBeforeStart;
        // },
        //
        // isCancelAfterEnd() {
        //     return this.value > 1000000;
        // },

        onKeyDown(event) {
            console.log('here', event);
        },

        getCharCodeFromEvent(event) {
            event = event || window.event;
            return (typeof event.which === "undefined") ? event.keyCode : event.which;
        },

        isCharNumeric(charStr) {
            return /\d/.test(charStr);
        },

        isKeyPressedNumeric(event) {
            const charCode = this.getCharCodeFromEvent(event);
            const charStr = String.fromCharCode(charCode);
            return this.isCharNumeric(charStr);
        }
    },
    created() {
        this.value = this.params.value;
    },
    mounted() {
        Vue.nextTick(() => {
            // need to check if the input reference is still valid - if the edit was cancelled before it started there
            // wont be an editor component anymore
            if (this.$refs.input) {
                this.$refs.input.focus();
            }
        });
    }
})
</script>

<style scoped>

</style>
