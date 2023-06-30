<template>
    <section class="page page-puzzle">
        <moqup-builder v-if="$project" :projectID="$project.id"  :editMode="editMode" :src="src" :onCreate="onCreate" :onUpdate="onUpdate"></moqup-builder>
        <moqup-builder v-else :editMode="editMode" :src="src" :onCreate="onCreate" :onUpdate="onUpdate"></moqup-builder>
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

                this.src = `/lambda/puzzle/project/${this.$project.id}/moqup/${this.$route.params.id}`;
            } else {
                this.src = `/lambda/puzzle/project/${this.$project.id}/moqup`;
            }
        } else {
            if (typeof id !== "undefined" && id !== "" && id !== null) {
                this.editMode = true;
                this.src = `/lambda/puzzle/schema/moqup/${this.$route.params.id}`;
            }
        }

    },
    methods: {
        onCreate() {
            this.$router.push("/moqup");
        },
        onUpdate() {
            this.$router.push("/moqup");
        }
    }
};
</script>
