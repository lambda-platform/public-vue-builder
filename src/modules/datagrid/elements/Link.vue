<template>
    <a :href="link" :target="this.params.linkTarget" v-if="params.value">
        <i v-if="this.params.icon" :class="this.params.icon"></i>
        <span v-if="!this.params.showOnlyIcon">{{ params.value }}</span>
    </a>
</template>

<script>
import Vue from "vue";
import {convertLink} from "../utils/formula"

export default Vue.extend({
    computed: {
        link() {
            return convertLink(this.params.link, this.params.node.data);
        }
    }
});
</script>
