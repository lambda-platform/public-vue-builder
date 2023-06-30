<template>
    <section class="offcanvas-template">
        <div class="crud-page">
            <div class="crud-page-header">
                <div class="crud-page-header-left">
                    <h3>{{ $props.title.replace('-', ' ') }}</h3>
                    <!--<Button type="success" @click="openSlidePanel = true; editMode = false;" shape="circle" size="small" icon="plus"></Button>-->
                </div>
                <div class="crud-page-header-right">

                    <Tooltip :content="lang.re_call">
                        <Button type="ghost" class="crud-tool" icon="ios-refresh-empty"
                                @click="$props.refreshtree"></Button>
                    </Tooltip>
                </div>
            </div>

            <div class="crud-page-body" style="padding:50px; overflow-y :auto">
                <Tree :data="$props.treedata" :render="renderContent"></Tree>
            </div>

            <slide-panel v-model="openSlidePanel" :widths="['36%']" @close="openSlidePanel = false">
                <dataform ref="form" :schemaID="form" :editMode="editMode" :onSuccess="onSuccess"
                          :onError="onError"></dataform>
            </slide-panel>
        </div>
    </section>
</template>

<script>
import slidePanel from "../components/slidePanel";
import krudtools from "./krudtools.vue"


export default {
    props: ["title", "treeid", "treedata", "form", "refreshtree", "deletetreeitem"],
    components: {
        krudtools,
        "slide-panel": slidePanel
    },
    data() {
        return {
            openSlidePanel: false,
        };
    },
    mounted() {
        // alert(this.url);
        //  this.$prop.treedata[0]['render']=
    },
    computed: {
        lang() {
            const labels = ['re_call',];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('crud.' + labels[i]);
                return obj;
            }, {});
        },
    },
    methods: {
        templateEdit() {
            this.openSlidePanel = true;
        },
        templateOnSuccess() {
            this.openSlidePanel = false;
        },
        templateOnError() {
            this.openSlidePanel = false;
        },
        onSuccess(val) {
            this.$props.refreshtree();
            //From template
            if (this.templateOnSuccess) {
                this.templateOnSuccess();
            }
        },

        onError(val) {
            //From template
            if (this.templateOnError) {
                this.templateOnError();
            }
        },
        renderContent(h, {root, node, data}) {
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%'
                }
            }, [
                h('span', [
                    h('Icon', {
                        props: {
                            type: 'ios-paper-outline'
                        },
                        style: {
                            marginRight: '8px'
                        }
                    }),
                    h('span', data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        marginRight: '32px'
                    }
                }, [
                    h('Button', {
                        props: Object.assign({}, {
                            icon: 'ios-plus-empty',
                            type: 'primary'
                        }, {
                            icon: 'ios-plus-empty'
                        }),
                        style: {
                            marginRight: '8px'
                        },
                        on: {
                            click: () => {
                                this.append(data)
                            }
                        }
                    }),
                    h(
                        "Poptip",
                        {
                            props: {
                                confirm: true,
                                title:
                                    "Уг өгөгдлийг устгахдаа итгэлтэй байна уу?",
                                transfer: true
                            },
                            on: {
                                "on-ok": () => {
                                    this.$props.deletetreeitem(data);
                                }
                            }
                        },
                        [
                            h("Button", {
                                props: Object.assign({}, {
                                    icon: 'ios-plus-empty',
                                    type: 'primary'
                                }, {
                                    icon: 'ios-minus-empty'
                                }),
                                style: {
                                    marginRight: '8px'
                                },
                            })
                        ]
                    )
                    ,
                    h('Button', {
                        props: Object.assign({}, {
                            icon: 'ios-plus-empty',
                            type: 'primary'
                        }, {
                            icon: 'ios-color-wand-outline'
                        }),
                        style: {
                            marginRight: '8px'
                        },
                        on: {
                            click: () => {
                                this.edittree(data)
                            }
                        }
                    })
                    ,
                    h('Button', {
                        props: Object.assign({}, {
                            icon: 'ios-plus-empty',
                            type: 'primary'
                        }, {
                            icon: 'ios-musical-notes'
                        }),
                        style: {
                            marginRight: '8px'
                        },
                        on: {
                            click: () => {
                                this.remove(root, node, data)
                            }
                        }
                    })
                    ,
                    h('Button', {
                        props: Object.assign({}, {
                            icon: 'ios-plus-empty',
                            type: 'primary'
                        }, {
                            icon: 'ios-browsers-outline'
                        }),
                        on: {
                            click: () => {
                                this.remove(root, node, data)
                            }
                        }
                    })

                ])
            ]);
        },
        append(data) {
            this.editMode = false;
            this.openSlidePanel = true;
            this.$refs.form.setHiddenValues([{key: 'group_id', val: data.id}]);
            // const children = data.children || [];
            // children.push({
            //     title: 'appended node',
            //     expand: true
            // });
            // this.$set(data, 'children', children);
        },
        remove(root, node, data) {
            const parentKey = root.find(el => el === node).parent;
            const parent = root.find(el => el.nodeKey === parentKey).node;
            const index = parent.children.indexOf(data);
            parent.children.splice(index, 1);
        },
        edittree(data) {
            this.editMode = true;
            this.$refs.form.editModel(data['id']);
            //From template
            if (this.templateEdit) {
                this.templateEdit();
            }
        }
    }
};
</script>

