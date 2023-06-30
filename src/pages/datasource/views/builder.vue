<template>
    <section class="page ">
        <data-source v-if="$project" :projectID="$project.id"  :editMode="editMode" :src="src" :onCreate="onCreate" :onUpdate="onUpdate"></data-source>
        <data-source v-else :editMode="editMode" :src="src" :onCreate="onCreate" :onUpdate="onUpdate"></data-source>
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

                    this.src = `/lambda/puzzle/project/${this.$project.id}/datasource/${this.$route.params.id}`;
                } else {
                    this.src = `/lambda/puzzle/project/${this.$project.id}/datasource`;
                }
            } else {
                if (typeof id !== "undefined" && id !== "" && id !== null) {
                    this.editMode = true;
                    this.src = `/lambda/puzzle/schema/datasource/${this.$route.params.id}`;
                }
            }

        },

        methods: {
            onCreate() {
                this.$router.push("/datasource");
            },
            onUpdate() {
                this.$router.push("/datasource");
            }
        }
    };
</script>
