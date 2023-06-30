<template>
    <FormItem :prop=rule :label=label>
        <ckeditor ref="ckeditor" :editor="editor" :disabled="editorDisabled"
                  v-model="model.form[model.component]"
                  :config="editorConfig" :key="meta.editorType"
                  @ready="onReady" @blur="onBlur($event)" @focus="onFocus($event)"></ckeditor>
    </FormItem>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue2';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

export default {
    props: ["label", "model", "rule", "meta"],
    components: {
        ckeditor: CKEditor.component
    },
    data() {
        return {
            editor: Editor,
            editorConfig: {
                toolbar: {
                    items: ['heading', '|',
                        'bold', 'italic', '|', 'link', '|',
                        'blockQuote', '|',
                        'insertTable', '|',
                        "indent", "outdent", '|',
                        'mediaEmbed'], shouldNotGroupWhenFull: true
                },
                removePlugins: ['Title'],
                placeholder: this.meta && this.meta.placeHolder !== null ? this.meta.placeHolder : this.label

            },
            editorDisabled: this.meta && this.meta.disabled ? this.meta.disabled : false,
        };
    },
    created() {
        if (this.meta.editorType == "article") {
            this.editorConfig = {
                toolbar: {
                    items: ['undo', 'redo', '|',
                        'selectAll', '|',
                        'bold', 'italic', '|',
                        'link', '|',
                        'bulletedList', 'numberedList', '|',
                        'heading', '|',
                        'blockQuote', '|',
                        'insertTable', '|',
                        "indent", "outdent", '|',
                        'mediaEmbed', 'imageUpload', 'ckfinder', '|'],
                    shouldNotGroupWhenFull: true
                },
                ckfinder: {
                    uploadUrl: '/vendor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json'
                },
                removePlugins: ['Title'],
                placeholder: this.meta && this.meta.placeHolder !== null ? this.meta.placeHolder : this.label

            }
        } else if (this.meta.editorType == "full") {
            this.editorConfig = {
                toolbar: {
                    //items: ['alignment:left', 'alignment:right', 'alignment:center', 'alignment:justify', 'alignment', 'undo', 'redo', 'blockQuote', 'bold', 'link', 'ckfinder', 'code', 'codeBlock', 'selectAll', 'findAndReplace', 'fontBackgroundColor', 'fontColor', 'fontFamily', 'fontSize', 'heading', 'highlight:yellowMarker', 'highlight:greenMarker', 'highlight:pinkMarker', 'highlight:blueMarker', 'highlight:redPen', 'highlight:greenPen', 'removeHighlight', 'highlight', 'horizontalLine', 'htmlEmbed', 'imageTextAlternative', 'toggleImageCaption', 'uploadImage', 'imageUpload', 'insertImage', 'imageInsert', 'resizeImage:original','resizeImage', 'imageResize', 'imageStyle:inline', 'imageStyle:alignLeft', 'imageStyle:alignRight', 'imageStyle:alignCenter', 'imageStyle:alignBlockLeft', 'imageStyle:alignBlockRight', 'imageStyle:block', 'imageStyle:side', 'imageStyle:wrapText', 'imageStyle:breakText', 'indent', 'outdent', 'italic', 'linkImage', 'numberedList', 'bulletedList', 'todoList', 'underline','mediaEmbed', 'pageBreak', 'removeFormat', 'sourceEditing', 'specialCharacters', 'restrictedEditingException', 'strikethrough', 'subscript', 'superscript', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', 'toggleTableCaption', 'tableCellProperties', 'tableProperties', 'textPartLanguage', 'todoList', 'underline'],
                    items: ['undo', 'redo', '|', 'selectAll', 'findAndReplace', '|', 'alignment', 'bold', 'italic',
                        'link', '|', 'linkImage', 'blockQuote', 'code', 'codeBlock', '|',
                        'fontBackgroundColor',
                        'fontColor', 'fontFamily', 'fontSize', 'heading', '|', 'removeHighlight', 'highlight', '|',
                        'horizontalLine', 'htmlEmbed', '|', 'imageTextAlternative', 'toggleImageCaption', 'uploadImage',
                        'imageInsert', 'resizeImage', 'imageStyle:inline', 'imageStyle:alignLeft', 'imageStyle:alignRight',
                        'imageStyle:alignCenter', 'imageStyle:alignBlockLeft', 'imageStyle:alignBlockRight',
                        'imageStyle:block', 'imageStyle:side', 'imageStyle:wrapText', 'imageStyle:breakText', '|',
                        'indent', 'outdent', '|', 'numberedList', 'bulletedList', '|', 'pageBreak',
                        'removeFormat', '|', 'specialCharacters', 'restrictedEditingException',
                        'strikethrough', 'subscript', 'superscript', '|', 'insertTable', 'tableColumn', 'tableRow',
                        'mergeTableCells', 'toggleTableCaption', 'tableCellProperties', 'tableProperties', '|',
                        'mediaEmbed', 'ckfinder', '|', 'sourceEditing'],
                    shouldNotGroupWhenFull: true
                },
                ckfinder: {
                    uploadUrl: '/vendor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json'
                },
                allowedContent:true,
                removePlugins: ['Title'],
                placeholder: this.meta && this.meta.placeHolder !== null ? this.meta.placeHolder : this.label
            }
        }

    },

    methods: {
        onBlur(editor) {
        },
        onFocus(editor) {
        },
        onReady(editor) {
            // Allow <div> elements in the model.
            editor.model.schema.register( 'div', {
                allowWhere: '$block',
                allowContentOf: '$root',
                inheritAllFrom: '$block',
                allowAttributes: [ 'style' ]
            } );

            // Allow <div> elements in the model to have all attributes.
            editor.model.schema.addAttributeCheck( context => {
                if ( context.endsWith( 'div' ) ) {
                    return true;
                }
            } );

            // The view-to-model converter converting a view <div> with all its attributes to the model.
            editor.conversion.for( 'upcast' ).elementToElement( {
                view: 'div',
                model: ( viewElement, { writer: modelWriter } ) => {
                    return modelWriter.createElement( 'div', viewElement.getAttributes() );
                }
            } );

            // The model-to-view converter for the <div> element (attributes are converted separately).
            editor.conversion.for( 'downcast' ).elementToElement( {
                model: 'div',
                view: 'div'
            } );

            // The model-to-view converter for <div> attributes.
            // Note that a lower-level, event-based API is used here.
            editor.conversion.for( 'downcast' ).add( dispatcher => {
                dispatcher.on( 'attribute', ( evt, data, conversionApi ) => {
                    // Convert <div> attributes only.
                    if ( data.item.name != 'div' ) {
                        return;
                    }

                    const viewWriter = conversionApi.writer;
                    const viewDiv = conversionApi.mapper.toViewElement( data.item );

                    // In the model-to-view conversion we convert changes.
                    // An attribute can be added or removed or changed.
                    // The below code handles all 3 cases.
                    if ( data.attributeNewValue ) {
                        viewWriter.setAttribute( data.attributeKey, data.attributeNewValue, viewDiv );
                    } else {
                        viewWriter.removeAttribute( data.attributeKey, viewDiv );
                    }
                } );
            } );
        }

    }
};
</script>
