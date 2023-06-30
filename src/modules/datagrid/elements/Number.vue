<template>
    <span>
        {{ Number(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") }}
    </span>
</template>

<script>
import Vue from "vue";

export default Vue.extend();
</script>
