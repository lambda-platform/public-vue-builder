<template>
    <FormItem :prop=rule :label=label>
        <vue-ckeditor ref="ckeditor" v-model="model.form[model.component]" :config="config" @blur="onBlur($event)" @focus="onFocus($event)" />
    </FormItem>
</template>

<script>
import VueCkeditor from 'vue-ckeditor2';
export default {
    props: ["label", "model", "rule", "meta"],
    components: { VueCkeditor },
    data() {
        return {
            mini: [
                [
                    "Undo",
                    "Redo",
                    "-",
                    "Find",
                    "Replace",
                    "-",
                    "SelectAll",
                    "RemoveFormat"
                ],
                [
                    "Bold",
                    "Italic",
                    "Underline",
                    "Strike",
                    "-",
                    "Subscript",
                    "Superscript"
                ],
                ["NumberedList", "BulletedList", "-", "Outdent", "Indent"],
                ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"]
            ],
            article: [
                [
                    "Undo",
                    "Redo",
                    "-",
                    "Find",
                    "Replace",
                    "-",
                    "SelectAll",
                    "RemoveFormat"
                ],
                [
                    "Bold",
                    "Italic",
                    "Underline",
                    "Strike",
                    "-",
                    "Subscript",
                    "Superscript"
                ],
                ["NumberedList", "BulletedList", "-", "Outdent", "Indent"],
                [
                    "JustifyLeft",
                    "JustifyCenter",
                    "JustifyRight",
                    "JustifyBlock"
                ],
                ["Link", "Unlink"],
                ["Image", "Table", "HorizontalRule"],
                ["Styles", "Format", "Font", "FontSize"],
                ["TextColor", "BGColor","video"]
            ],
            full: []
        };
    },
    computed: {
        config() {
            switch (this.meta.editorType) {
                case "mini":
                    return {
                        toolbar: this.mini,
                        height: 250,
                        readOnly:this.meta && this.meta.disabled ? this.meta.disabled : false
                    };
                case "article":
                    return {
                        toolbar: this.article,
                        height: 250,
                        filebrowserBrowseUrl : '/vendor/filemanager/dialog.php?type=2&editor=ckeditor&fldr=',
                        filebrowserUploadUrl : '/vendor/filemanager/dialog.php?type=2&editor=ckeditor&fldr=',
                        filebrowserImageBrowseUrl : '/vendor/filemanager/dialog.php?type=1&editor=ckeditor&fldr=',
                        readOnly:this.meta && this.meta.disabled ? this.meta.disabled : false,
                        extraPlugins : 'video'
                    };
                default:
                    return {
                        height: 350,
                        filebrowserBrowseUrl : '/vendor/filemanager/dialog.php?type=2&editor=ckeditor&fldr=',
                        filebrowserUploadUrl : '/vendor/filemanager/dialog.php?type=2&editor=ckeditor&fldr=',
                        filebrowserImageBrowseUrl : '/vendor/filemanager/dialog.php?type=1&editor=ckeditor&fldr=',
                        readOnly:this.meta && this.meta.disabled ? this.meta.disabled : false,
                        extraPlugins : 'video,youtube,tweetabletext'
                    };
            }
        }
    },
    methods: {
        onBlur(editor) {},
        onFocus(editor) {}
    }
};
</script>
