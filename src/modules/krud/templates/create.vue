<template>
    <section class="edit">
        <div class="crud-page">
            <dataform ref="form" :schemaID="schema" :editMode="true" :onSuccess="onSuccess"
                      :onError="onError"></dataform>
        </div>
    </section>
</template>

<script>
export default {
    props: ["schema"],
    methods: {
        onSuccess(val) {
        },
        onError(val) {
        }
    }
};
</script>
