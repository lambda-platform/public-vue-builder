<template>

     <section class="page page-chart">
         <chart-builder v-if="$project" :editMode="editMode" :projectID="$project.id" :src="src" :onCreate="onCreate" :onUpdate="onUpdate" :projectDomain="projectDomain"></chart-builder>
        <chart-builder v-else :editMode="editMode" :src="src" :onCreate="onCreate" :onUpdate="onUpdate"></chart-builder>
    </section>
</template>

<script>


    export default {
        components: {

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

                    this.src = `/lambda/puzzle/project/${this.$project.id}/chart/${this.$route.params.id}`;
                } else {
                    this.src = `/lambda/puzzle/project/${this.$project.id}/chart`;
                }
            } else {
                if (typeof id !== "undefined" && id !== "" && id !== null) {
                    this.editMode = true;
                    this.src = `/lambda/puzzle/schema/chart/${this.$route.params.id}`;
                }
            }

        },
        methods: {

            onCreate() {
                this.$router.push("/chart");
            },
            onUpdate() {
                this.$router.push("/chart");
            }
        }
    };
</script>
