<template>
    <g>
        <svg :y="y + 55" v-if="type === 'in'">
            <rect
                    :fill="fill"
                    ref="handle"
                    x="1" y="0"

                    :fill-opacity="opacity"
                    rx="5" ry="5"
                    width="10" height="10"
                    @mouseenter="enter" @mouseleave="leave" @mousedown="startDragNewLink" @mouseup="mouseup">
            </rect>

            <svg x="12" y="0" id="checkbox" viewBox="0 0 28 28" width="12" height="12" v-if="!field.output"  @mousedown="check">
                <path d="M0 0v28h28V0H0zm24 24H4V4h20v20z"></path>
                <rect
                        fill="#333"
                        fill-opacity="0"
                        x="0" y="0"


                        width="28" height="28"
                       >
                </rect>
            </svg>
            <svg x="12" y="0" id="checkbox-checked" viewBox="0 0 28 28" width="12" height="12" v-if="field.output"  @mousedown="check">
                <path d="M0 0v28h28V0H0zm24 24H4V4h20v20zm-2-13l-2.828-2.828-6.768 6.982-3.576-3.576L6 14.406l6.404 6.406L22 11z"></path>
                <rect
                        fill="#333"

                        x="0" y="0"
                        fill-opacity="0"

                        width="28" height="28"
                >
                </rect>
            </svg>
            <text x="30" y="9" font-size="7pt" font-weight="bold" fill="#1364A9" @mousedown="select_Field" v-if="selectedNodeIndex == nodeIndex && selectedFieldIndex == f_index" >{{alias}}</text>
            <text x="30" y="9" font-size="7pt" fill="#000000" @mousedown="select_Field" v-else>{{alias}}</text>
            <text :x="nodeWidth" y="7" font-size="6pt" fill="#666" text-anchor="end" @mousedown="select_Field">{{field.dbType}}</text>


        </svg>
        <svg :y="y + 55" v-else>
            <rect
                    :fill="fill"
                    ref="handle"
                    :x="nodeWidth - 1" y="0"

                    :fill-opacity="opacity"
                    rx="5" ry="5"
                    width="10" height="10"
                    @mouseenter="enter" @mouseleave="leave" @mousedown="startDragNewLink" @mouseup="mouseup">
            </rect>


        </svg>
    </g>
</template>

<script>

//
    export default {
        name: "DiagramPort",
        props: ["id", "y", "type", "field", "nodeWidth", "nodeIndex",  "portIndex", "f_index", "selectedFieldIndex", "selectedNodeIndex"],
        data() {
            return {
                fill: "#000",
                opacity:0

            };
        },
        methods: {
            mouseup() {
                this.$emit("mouseUpPort", this.id);
            },

            enter() {
                this.opacity = 0.8;
            },

            leave() {
                this.opacity = 0;
            },
            startDragNewLink() {
                this.$emit("onStartDragNewLink", this.id);
            },
            check() {
                this.$emit("changeChecked", this.nodeIndex, this.portIndex);
            },
            select_Field() {
                this.$emit("selectField", this.nodeIndex, this.f_index, this.field);
            }
        },
        computed:{
            alias:function () {

                return this.field.alias.replace(`${this.field.table}_as_`, '')
            }
        }
    };
</script>
