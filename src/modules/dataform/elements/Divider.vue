<template>
    <Divider class="form-divider" v-if="label=='['+model.component+']'"></Divider>
    <Divider v-else orientation="left" class="form-divider">{{label}}</Divider>
</template>

<script>
    export default {
        props: ["model", "label", "rule", "meta"],
    };
</script>
