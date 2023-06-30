<template>
    <span v-html="customEl"></span>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
    computed: {
        customEl() {
            if (this.params.value !== null) {
                let render = this.params.customOptions.filter(item => item.compareVal.toString() == this.params.value.toString())[0];
                if (render) {
                    let txt = render.label != null ? render.label : '';
                    let icon = render.icon != null ? `<i class="${render.icon}"></i>` : '';
                    let img = render.image != null ? `<img src="${render.image}" />` : '';
                    return `<span style="${render.color != '' ? 'color: ' + render.color : ''}">${txt} ${icon} ${img}</span>`
                } else {
                    return this.params.value;
                }
            }
            return "";
        }
    }
});
</script>
