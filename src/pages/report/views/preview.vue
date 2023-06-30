<template>
    <section class="page page-preview">
        <div class="pz-form-preview">
            <dataform ref="form" :schemaID="$route.params.id" :editMode="false" :onSuccess="onSuccess" :onError="onError"></dataform>
        </div>
    </section>
</template>

<script>
import pageHeader from "../../../components/pageHeader.vue";

export default {
    components: {
        "page-header": pageHeader
    },
    methods: {
        onSuccess(val) {},
        onError(val) {}
    }
};
</script>
