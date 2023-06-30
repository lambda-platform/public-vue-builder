<template>
    <section class="page page-puzzle">
        <report-builder :editMode="editMode" :schemaID="$route.params.id" :src="src" :onCreate="onCreate"
                        :onUpdate="onUpdate"></report-builder>
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
        // if (typeof id !== "undefined" && id !== "" && id !== null) {
        //     this.editMode = true;
        //     this.src = `/lambda/puzzle/schema/form/${this.$route.params.id}`;
        // }
    },
    methods: {
        onCreate() {
            this.$router.push("/report");
        },
        onUpdate() {
            this.$router.push("/report");
        }
    }
};
</script>
