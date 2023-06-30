<template>
    <FormItem :label="label" :prop=rule>
        <div class="file-uploader">
            <Upload :action="`${url ? url : ''}/lambda/krud/upload`"
                    v-model="model.form[model.component]"
                    :on-success="success"
                    :disabled="meta && meta.disabled ? meta.disabled : false"
            >
                <div class="file-upload-handler">
                    <i class="ti-camera"></i> <span>{{ lang.pleaseSelectFile }}</span>
                </div>
            </Upload>

            <div v-if="model.form[model.component] != null && model.form[model.component] != ''" class="file-control">
                <a :href="model.form[model.component]" target="_blank" download> <i
                    class="ti-download"></i>{{ lang.download }}</a>
                <a :href="model.form[model.component]" target="_blank"> <i class="ti-eye"></i>{{ lang.view }}</a>
            </div>
        </div>
    </FormItem>
</template>

<script>

export default {
    props: ["model", "label", "rule", "meta", "url"],

    computed: {
        lang() {
            const labels = ['pleaseSelectFile', 'download', 'view', ''
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
    },


    methods: {
        success(val) {
            this.model.form[this.model.component] = val;
        },
    }
};
</script>


