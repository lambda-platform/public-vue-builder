<template>
        <div class="subform-image-wrapper">
            <Upload
                ref="upload"
                :with-credentials="true"
                v-model="model.form[model.component]"
                :action="`${url ? url : ''}/lambda/krud/upload`"
                class="subform-image"
                :on-success="success">
                <Button type="dashed">
                    <img class="preview-img subform-img-preview" v-if="this.model.form[this.model.component] != null" :src="this.model.form[this.model.component]"
                         alt="image">
                    <div>
                        <i class="tu ti-camera"></i>
                        {{ label }}
                    </div>
                </Button>
            </Upload>
        </div>
</template>

<script>
    export default {
        props: ["model", "label", "rule", "meta", "do_render", "url"],

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
            }
        },

        methods: {
            handleView(imageUrl) {
                this.showImage = true;
                this.showImageUrl = imageUrl;
            },

            success(val) {
                    this.model.form[this.model.component] = val;
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

