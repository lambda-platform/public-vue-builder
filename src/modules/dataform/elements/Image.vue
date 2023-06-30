<template>
    <FormItem :label="label" :prop=rule>
        <div class="multi-upload" v-if="meta.file && meta.file.isMultiple == true">
            <div class="multi-upload-list">
                <div class="upload-list" v-for="item in uploadList" :key="item.index">
                    <template v-if="item.status == 'finished'">
                        <img v-if="item.response" :src="`${url ? url : ''}${item.response}`" @click="handleView(item.response)">
                        <div class="upload-control" @click="handleRemove(item)"
                             v-show="meta && meta.disabled ? false : true">{{ lang._delete }}
                        </div>
                    </template>

                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </div>

                <Upload
                    ref="upload"
                    multiple
                    :with-credentials="true"
                    :action="`${url ? url : ''}/lambda/krud/upload`"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="success"
                    :before-upload="beforeUpload"
                    :disabled="meta && meta.disabled ? meta.disabled : false"
                >
                    <div class="upload-handler">
                        <i class="ti ti-camera"></i>
                    </div>
                </Upload>
            </div>
        </div>

        <Upload
            ref="upload"
            v-else
            :with-credentials="true"
            v-model="model.form[model.component]"
            :action="`${url ? url : ''}/lambda/krud/upload`"
            :on-success="success"
            :disabled="meta && meta.disabled ? meta.disabled : false">
            <Button type="dashed">
                <img class="preview-img" v-if="this.model.form[this.model.component] != null"
                     :src="`${url ? url : ''}${model.form[model.component]}`"
                     alt="image">
                <div>
                    <i class="ti ti-camera"></i>
                    {{ label }}
                </div>
            </Button>
        </Upload>

        <Modal :title="lang.viewPhotos" v-model="showImage" width="1000px">
            <img

                 :src="`${url ? url : ''}${showImageUrl}`"
                 v-if="showImage" style="width: 100%">
        </Modal>
    </FormItem>
</template>

<script>

export default {
    props: ["model", "label", "rule", "meta", "do_render", "url"],
    computed: {
        lang() {
            const labels = ['viewPhotos', '_delete'
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
    },
    mounted() {
        this.uploadList = typeof this.$refs.upload.fileList != 'undefined' ? this.$refs.upload.fileList : [];
    },
    data() {
        return {
            defaultList: [],
            uploadList: [],
            showImage: false,
            showImageUrl: ''
        }
    },

    watch: {
        'model.form'(val) {

            let itemModel = val[this.model.component];
            if (typeof this.meta.file.isMultiple !== 'undefined' && this.meta.file.isMultiple) {
                if (typeof itemModel == 'string' && typeof itemModel != 'undefined' && itemModel != null) {

                    let list = JSON.parse(this.model.form[this.model.component]);

                    if (Array.isArray(list)) {
                        this.defaultList = list.map(item => {
                            return {
                                status: 'finished',
                                response: item.response,
                                name: item.name
                            }
                        });

                        this.$nextTick(() => {
                            this.uploadList = this.$refs.upload.fileList;
                        })
                    }
                } else {
                    this.$refs.upload.fileList = [];
                    this.uploadList = [];
                    this.model.form[this.model.component] = null;
                }
            }
        },
        do_render(value) {
            if (!value) {

                this.$refs.upload.fileList = [];
            }
        }

    },

    methods: {

        handleView(imageUrl) {
            this.showImage = true;
            this.showImageUrl = imageUrl;
        },

        success(val) {

            if (this.meta.file.isMultiple) {
                this.uploadList = this.$refs.upload.fileList;
                this.model.form[this.model.component] = JSON.stringify(this.uploadList.map(item => {
                    return {
                        name: item.name,
                        response: item.response
                    }
                }));
            } else {
                this.model.form[this.model.component] = val;
            }
        },

        handleRemove(file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            this.uploadList = this.$refs.upload.fileList;
            this.model.form[this.model.component] = this.uploadList.map(item => {
                return {
                    name: item.name,
                    response: item.response
                }
            })
        },

        beforeUpload() {
            // const check = this.uploadList.length < 5;
            // if (!check) {
            //     this.$Notice.warning({
            //         title: 'Up to five pictures can be uploaded.'
            //     });
            // }
            // return check;
        }
    }
};
</script>
