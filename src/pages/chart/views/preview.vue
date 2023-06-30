<template>
<section class="page page-preview">
    <div class="pz-preview">
        <chart v-if="$project" :src="src"  :projectID="$project.id" :projectDomain="projectDomain"></chart>
        <chart v-else :src="src"></chart>
    </div>
</section>
</template>

<script>
import pageHeader from "../../../components/pageHeader.vue";

export default {
    components: {
        "page-header": pageHeader
    },

    computed: {
        sourceUrl() {

            if(window.init.projectSettings){


                return window.init.projectSettings.production_url;
            } else {
                return ""
            }
        },
        src: function () {

            if(this.$project){
                return `${this.sourceUrl}/lambda/puzzle/schema-public/chart/${this.$route.params.id}`
            }
            return `/lambda/puzzle/schema/chart/${this.$route.params.id}`

        },
        projectDomain(){
            return window.lambda.domain ? `${window.lambda.domain}` : undefined;
        }
    }
};
</script>
