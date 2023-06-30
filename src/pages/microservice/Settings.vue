<template>
    <section class="project-page">
        <h3 class="project-title"><img src="/assets/lambda/images/favicon.png" alt="">{{ $project.name }}</h3>
        <div class="project-status">
            <div class="lambda-config">

                <h3>Microservice түлхүүр</h3>
                <code>
                    {{$project.project_key}}
                    <button @click="copyToClipboard(`${$project.project_key}`)" type="button" >  <i class="ti-layers"></i></button>
                </code>

                <br>
                <div class="select-platform">
                    <div>
                        <h3><a href="https://github.com/lambda-platform/cli" target="_blank">Lambda CLI</a> {{lang.create_using}} </h3>
                        <code v-if="microservoce.project_type === 'Client'">
                            lambda-micro-client -key={{$project.project_key}} create {{ $project.name }}
                            <button @click="copyToClipboard(`lambda-micro-client -key=${$project.project_key} create ${$project.name}`)" type="button" >  <i class="ti-layers"></i></button>
                        </code>
                        <code v-else>
                            lambda-micro -key={{$project.project_key}} create {{ $project.name }}
                            <button @click="copyToClipboard(`lambda-micro -key=${$project.project_key} create ${$project.name}`)" type="button" >  <i class="ti-layers"></i></button>
                        </code>
                        <br>

                        <h3>{{ lang.download_create_file }}</h3>
                        <a href="https://lambda.cloud.mn/starter.zip" target="_blank">
                            <i class="ti-cloud-down"></i>
                            <span>{{ lang.lambda_example_app }}</span>
                        </a>

                        <a :href="`/console/config/${$project.project_key}`" target="_blank">
                            <i class="ti-cloud-down"></i>
                            <span>{{ lang.lambda_settings }}</span>


                        </a>
                    </div>

                </div>

            </div>

            <Steps :current="$project.db_schema_path == `schemas/${$project.project_key}.json` ? 3 : 1" :status="$project.db_schema_path == `schemas/${$project.project_key}.json` ? 'finish' : 'error'">
                <Step :title="lang.create" :content="`Cloud  ${lang.type}: ${$project.plan}`"></Step>
                <Step :title="lang.database" :content="lang.database_connect"></Step>

                <Step :title="lang.ready" :content="lang._success"></Step>
            </Steps>
        </div>
        <dataform ref="form" :schemaID="46" class="microservice-config"
                  :do_render="true"
                  :editMode="true"
                  :onReady="onReady"
        ></dataform>
    </section>
</template>

<script>


export default {
    name: "Settings",
    methods: {
        onReady() {
            this.$refs.form.editModel(this.$projectSettings.id);
        },
        copyToClipboard(text) {
            var node = document.createElement('textarea');
            var selection = document.getSelection();

            node.textContent = text;
            document.body.appendChild(node);

            selection.removeAllRanges();
            node.select();
            document.execCommand('copy');

            selection.removeAllRanges();
            document.body.removeChild(node);
        },

    },
    data() {
        return {
            microservoce:window.init.project
        };
    },
    computed: {
        lang() {
            const labels = [
                'project_key',
                'server_languege_framework',
                'create_using',
                'download_create_file',
                'lambda_example_app',
                'lambda_cli',
                'lambda',
                'l_key',
                'create',
                'lambda_settings',
                'laravel_framework',
                'go_framework',
                'database',
                'database_connect',
                '_success',
                'type',
                'ready',
                'lambda_platform',
                'composer',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('project.' + labels[i]);
                return obj;
            }, {});
        },
    }
}
</script>

<style  lang="scss">
.microservice-config {
    .dataform-body{
        height: auto !important;
        flex: unset !important;
    }
    .dataform-footer{
        margin-top: 0  !important;
    }
}
</style>
