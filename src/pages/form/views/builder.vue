<template>
    <section class="page page-puzzle">
        <form-builder v-if="$project" :projectID="$project.id" :editMode="editMode" :schemaID="$route.params.id" :src="src" :onCreate="onCreate" :onUpdate="onUpdate"></form-builder>
        <form-builder v-else :editMode="editMode" :schemaID="$route.params.id" :src="src" :onCreate="onCreate" :onUpdate="onUpdate"></form-builder>
    </section>
</template>

<script>
import pageHeader from "../../../components/pageHeader.vue";
export default {
    components: {
        "page-header": pageHeader
    },
    data() {
        return {
            editMode: false,
            src: ""
        };
    },

    created() {
        let id = this.$route.params.id;
        if(this.$project){
            if (typeof id !== "undefined" && id !== "" && id !== null) {
                this.editMode = true;

                this.src = `/lambda/puzzle/project/${this.$project.id}/form/${this.$route.params.id}`;

            } else {

                this.src = `/lambda/puzzle/project/${this.$project.id}/form`;

            }
        } else {
            if (typeof id !== "undefined" && id !== "" && id !== null) {
                this.editMode = true;
                this.src = `/lambda/puzzle/schema/form/${this.$route.params.id}`;
            }
        }

    },
    methods: {
        onCreate() {
            this.$router.push("/form");
        },
        onUpdate() {
            this.$router.push("/form");
        }
    }
};
</script>
