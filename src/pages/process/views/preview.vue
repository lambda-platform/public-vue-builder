<template>
    <section class="page page-preview">
        <div class="pz-grid-preview">
            <datagrid  v-if="$project" :projectID="$project.id" :schemaID="$route.params.id" :paginate="50"></datagrid>
            <datagrid v-else :schemaID="$route.params.id" :paginate="50"></datagrid>
        </div>
    </section>
</template>

<script>
import pageHeader from "../../../components/pageHeader.vue";

export default {
    components: {
        "page-header": pageHeader
    }
};
</script>
