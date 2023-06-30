<template>
    <section class="page page-puzzle">
        <process-builder :editMode="editMode" :src="src" :onCreate="onCreate" :onUpdate="onUpdate" />
    </section>
</template>

<script>
import ProcessBuilder from "../../../modules/process/ProcessBuilder"

export default {
    components: {
        ProcessBuilder
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
            this.$router.push("/process");
        },
        onUpdate() {
            this.$router.push("/process");
        }
    }
};
</script>
