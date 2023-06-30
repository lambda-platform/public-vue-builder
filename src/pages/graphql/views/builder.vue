<template>
    <section class="page ">
        <graphql v-if="$project" :editMode="editMode" :projectID="$project.id" :src="src" :onCreate="onCreate" :onUpdate="onUpdate"></graphql>
        <graphql v-else :editMode="editMode" :src="src" :onCreate="onCreate" :onUpdate="onUpdate"></graphql>
    </section>
</template>

<script>

    import graphql from "./graphql"
    export default {
        components: {
          graphql
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

                    this.src = `/lambda/puzzle/project/${this.$project.id}/graphql/${this.$route.params.id}`;
                } else {
                    this.src = `/lambda/puzzle/project/${this.$project.id}/graphql`;
                }
            } else {
                if (typeof id !== "undefined" && id !== "" && id !== null) {
                    this.editMode = true;
                    this.src = `/lambda/puzzle/schema/graphql/${this.$route.params.id}`;
                }
            }

        },
        methods: {
            onCreate() {
                this.$router.push("/graphql");
            },
            onUpdate() {
                this.$router.push("/graphql");
            }
        }
    };
</script>
