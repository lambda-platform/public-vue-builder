<template>
    <dataform ref="form" :schemaID="$route.params.id" :editMode="false" :onSuccess="onSuccess"
              :onError="onError"></dataform>
</template>

<style>

</style>

<script>
    export default {
        methods: {
            onSuccess(val) {
            },
            onError(val) {
            }
        }
    };
</script>
