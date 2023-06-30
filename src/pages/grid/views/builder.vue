<template>
    <section class="page page-puzzle">
        <grid-builder v-if="$project" :projectID="$project.id"  :editMode="editMode" :src="src" :onCreate="onCreate" :onUpdate="onUpdate"></grid-builder>
        <grid-builder :editMode="editMode" :src="src" :onCreate="onCreate" :onUpdate="onUpdate"></grid-builder>
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

                this.src = `/lambda/puzzle/project/${this.$project.id}/grid/${this.$route.params.id}`;
            } else {
                this.src = `/lambda/puzzle/project/${this.$project.id}/grid`;
            }
        } else {
            if (typeof id !== "undefined" && id !== "" && id !== null) {
                this.editMode = true;
                this.src = `/lambda/puzzle/schema/grid/${this.$route.params.id}`;
            }
        }

    },
    methods: {
        onCreate() {
            this.$router.push("/grid");
        },
        onUpdate() {
            this.$router.push("/grid");
        }
    }
};
</script>
