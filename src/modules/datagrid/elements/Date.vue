<template>
    <span>
        {{ params.value != null ? params.value.substr(0, 10) : '' }}
    </span>
</template>

<script>
import Vue from "vue";

export default Vue.extend();
</script>
