<template>
    <section class="project-page">
        <h3 class="project-title"><img src="/assets/lambda/images/favicon.png" alt="">{{ $project.name }}</h3>


        <dataform ref="form" :schemaID="57"
                  :do_render="true"
                  :editMode="true"
                  :onReady="onReady"

        ></dataform>
    </section>
</template>

<script>
export default {
    name: "Permissions",
    methods: {
        onReady() {
            this.$refs.form.editModel(this.$project.id);
        },

    }
}
</script>

<style scoped>

</style>
