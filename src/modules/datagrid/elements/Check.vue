<template>
    <span>
        <Icon v-if="params.value === 1" class="status-checked" type="md-checkmark"/>
        <Icon v-else class="status-unchecked" type="md-close"/>
    </span>
</template>

<script>
import Vue from "vue";

export default Vue.extend();
</script>
