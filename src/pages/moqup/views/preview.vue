<template>
    <section class="page page-preview">
        <div class="pz-preview">
            <moqup v-if="$project" :src="src" :id="$route.params.id" :projectDomain="projectDomain" :projectID="$project.id" ></moqup>
            <moqup v-else :src="src" :id="$route.params.id"></moqup>
        </div>
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

        };
    },
    computed: {
        src:  ()=> {

            if(this.$project){
                let configUrl =`/lambda/puzzle/schema-public/moqup/${this.$route.params.id}`;
                if (this.$project.id) {
                    configUrl =`/lambda/puzzle/project/${this.$project.id}/moqup/${this.$route.params.id}`;
                }
                return configUrl
            } else {
               return `/lambda/puzzle/schema/moqup/${this.$route.params.id}`;
            }

        },
        projectDomain(){
            return window.lambda.domain ? `${window.lambda.domain}` : undefined;
        }
    },
    mounted() {

    }
};
</script>
