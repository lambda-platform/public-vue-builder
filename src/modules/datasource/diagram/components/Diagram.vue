<template>
    <div>

        <SvgPanZoom
                :style="{ width: width + 'px', height: height + 'px', border:'1px solid #ccc'}"
                xmlns="http://www.w3.org/2000/svg"
                :zoomEnabled="zoomEnabled"
                id="svgroot"
                :panEnabled="panEnabled"
                :controlIconsEnabled="false"
                :dblClickZoomEnabled="false"
                :fit="false"
                :center="true"
                viewportSelector="#svgroot2"
                :preventMouseEventsDefault="false"
                :minZoom="-8"
                :beforePan="beforePan">
            <svg
                    id="svgroot2"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    :viewBox="'0 0 ' + width + ' ' + height"
                    :width="width"
                    :height="height"
                    preserveAspectRatio="xMinYMin meet"
                    class="svg-content"
                    ref="dragramRoot"
                    @mousemove="mouseMove"
                    @mouseup="mouseUp">
                <defs>
                    <pattern id="smallGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="gray" stroke-width="0.5"/>
                    </pattern>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)"/>
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
                    </pattern>
                </defs>

                <rect x="-5000px" y="-5000px" width="10000px" height="10000px" fill="url(#grid)"
                      @mousedown="clearSelection" ref="grid" class="svg-pan-zoom_viewport"/>
                <g ref="viewPort" id="viewport" x="50" y="50">
                    <DiagramLink
                            :ref="'link-' + index"
                            :positionFrom="link.positionFrom"
                            :positionTo="link.positionTo"
                            :points="link.points"
                            :id="link.id"
                            :index="index"
                            :key="index"
                            v-for="(link, index) in model._model.links"
                            @onStartDrag="startDragPoint"
                            @onCreatePoint="createPoint"
                    />
                    <line
                            :x1="getPortHandlePosition(newLink.startPortId).x -6"
                            :y1="getPortHandlePosition(newLink.startPortId).y"
                            :x2="convertXYtoViewPort(mouseX, 0).x"
                            :y2="convertXYtoViewPort(0, mouseY).y"
                            style="stroke:rgb(255,0,0);stroke-width:2"
                            v-if="newLink"
                    />
                    <DiagramNode
                            :ref="'node-' + nodeIndex"
                            :title="node.title"
                            :x="node.x"
                            :y="node.y"
                            :width="node.width"
                            :height="node.height"
                            :color="node.color"
                            :deletable="node.deletable"
                            :ports="node.ports"
                            :selected="selectedItem.type === 'nodes' && selectedItem.index === nodeIndex"
                            :index="nodeIndex"

                            :key="nodeIndex"
                            v-for="(node, nodeIndex) in model._model.nodes"
                            :all_checked="node.all_checked"
                            @onStartDrag="startDragItem"

                            @selectAll="selectAll"
                            @delete="model.deleteNode(node)"
                    >
                        <DiagramPort
                                v-for="(port, portIndex) in node.ports"
                                :key="portIndex"
                                :ref="'port-' + port.id"
                                :id="port.id"
                                :nodeIndex="nodeIndex"
                                :selectedNodeIndex="selectedNodeIndex"
                                :selectedFieldIndex="selectedFieldIndex"
                                :portIndex="portIndex"
                                :y="getY(portIndex)"
                                :nodeWidth="node.width"
                                :type="port.type"
                                :checked="port.checked"
                                :f_index="port.f_index"
                                :field="port.field"

                                @onStartDragNewLink="startDragNewLink"
                                @mouseUpPort="mouseUpPort"
                                @changeChecked="changeChecked"
                                @selectField="selectField"
                        />
                    </DiagramNode>
                </g>
            </svg>
        </SvgPanZoom>
    </div>
</template>
<script>
    import SvgPanZoom from "vue-svg-pan-zoom";

    import DiagramModel from "./../DiagramModel";
    import DiagramNode from "./DiagramNode";
    import DiagramLink from "./DiagramLink";
    import DiagramPort from "./DiagramPort";

    var generateId = function () {
        return Math.trunc(Math.random() * 1000);
    };

    function getAbsoluteXY(element) {
        var viewportElement = document.documentElement;
        var box = element.getBoundingClientRect();
        var scrollLeft = viewportElement.scrollLeft;
        var scrollTop = viewportElement.scrollTop;
        var x = box.left + scrollLeft;
        var y = box.top + scrollTop;
        return {x: x, y: y};
    }

    function snapToGrip(val, gridSize) {
        return gridSize * Math.round(val / gridSize);
    }

    export default {
        name: "Diagram",
        Model: DiagramModel,
        props: {
            model: {
                required: true
            },
            width: {
                default: 800
            },
            height: {
                default: 600
            },
            gridSnap: {
                default: 1
            },
            selectedFieldIndex: {
                default: null
            },
            selectedNodeIndex: {
                default: null
            },
        },

        data() {
            this.updateLinksPositions();

            return {
                document,
                zoomEnabled: true,
                panEnabled: true,
                draggedItem: undefined,
                selectedItem: {},
                initialDragX: 0,
                initialDragY: 0,
                newLink: undefined,
                mouseX: 0,
                mouseY: 0
            };
        },
        components: {
            DiagramNode,
            DiagramLink,
            DiagramPort,
            SvgPanZoom
        },

        methods: {
            convertXYtoViewPort(x, y) {
                let rootelt = document.getElementById("svgroot2");
                let rec = document.getElementById("viewport");
                let point = rootelt.createSVGPoint();
                let rooteltPosition = getAbsoluteXY(rootelt);
                point.x = x - rooteltPosition.x;
                point.y = y - rooteltPosition.y;
                let ctm = rec.getCTM().inverse();
                return point.matrixTransform(ctm);
            },
            beforePan() {
                if (this.selectedItem.type || this.draggedItem || this.newLink)
                    return false;
                else return true;
            },
            isEven(n) {
                return n % 2 == 0;
            },

            getY(index) {


                let y_ = 0;
                if (this.isEven(index)) {
                    y_ = index * 10
                } else {
                    y_ = (index - 1) * 10
                }


                return y_
            },

            createPoint(x, y, linkIndex, pointIndex) {
                let coords = this.convertXYtoViewPort(x, y);
                let links = this.model._model.links;

                //FIXME works well only on links created at startup
                if (links[linkIndex].points === undefined) links[linkIndex].points = [];

                var points = links[linkIndex].points;
                points.splice(pointIndex, 0, coords);
                links[linkIndex].points = points;
            },

            clearSelection() {
                this.selectedItem = {};
            },

            updateLinksPositions() {
                var links = [];

                if (this.model && this.model._model) links = this.model._model.links;

                this.$nextTick(() => {
                    setTimeout(() => {
                        for (var i = 0; i < links.length; i++) {
                            var coords;
                            coords = this.getPortHandlePosition(links[i].from);
                            links[i].positionFrom = {x: coords.x, y: coords.y};
                            coords = this.getPortHandlePosition(links[i].to);
                            links[i].positionTo = {x: coords.x, y: coords.y};
                        }
                    }, 100);
                });
            },

            startDragNewLink(startPortId) {

                this.panEnabled = false;
                this.newLink = {
                    startPortId
                };
            },

            changeChecked(nodeIndex, portIndex) {



                if (this.model._model.nodes[nodeIndex].ports[portIndex].field.output)
                    this.model._model.nodes[nodeIndex].ports[portIndex].field.output = false
                else
                    this.model._model.nodes[nodeIndex].ports[portIndex].field.output = true;

                this.$emit("changeChecked", nodeIndex, portIndex);

            },
            selectAll(nodeIndex){
                let select_all = true;
                if(this.model._model.nodes[nodeIndex].all_checked){
                    select_all = false;

                }
                this.model._model.nodes[nodeIndex].all_checked = select_all;

                this.model._model.nodes[nodeIndex].ports.forEach(port=>{
                    port.field.output = select_all;
                })

                this.$emit("changeChecked");

            },

            selectField(nodeIndex, fieldIndex, field) {

                this.$emit("selectField", nodeIndex, fieldIndex, field);

            },

            getPortHandlePosition(portId) {
                if (this.$refs["port-" + portId]) {
                    var port = this.$refs["port-" + portId][0];
                    var node = this.$refs["node-" + port.nodeIndex][0];
                    var x;
                    var y;
                    if (port.type === "in") {
                        x = node.x + 10;
                        y = node.y + port.y + 64;
                    } else {
                        x = node.x + node.width + 10;
                        y = node.y + port.y + 64;
                    }

                    return {x, y};
                } else {
                    console.warn(
                        `port "${portId}" not found. you must call this method after the first render`
                    );
                    return 0;
                }
            },

            mouseMove(pos) {
                var links = this.model._model.links;
                this.mouseX = pos.x;
                this.mouseY = pos.y;
                if (this.draggedItem) {
                    var index = this.draggedItem.index;
                    var type = this.draggedItem.type;
                    if (type === "points") {
                        let coords = this.convertXYtoViewPort(this.mouseX, this.mouseY);

                        coords.x = snapToGrip(coords.x, this.gridSnap) - this.gridSnap / 2;
                        coords.y = snapToGrip(coords.y, this.gridSnap);

                        links[this.draggedItem.linkIndex].points[
                            this.draggedItem.pointIndex
                            ].x =
                            coords.x;
                        links[this.draggedItem.linkIndex].points[
                            this.draggedItem.pointIndex
                            ].y =
                            coords.y;
                        this.updateLinksPositions();
                    } else {
                        let coords = this.convertXYtoViewPort(this.mouseX, this.mouseY);

                        coords.x = snapToGrip(coords.x, this.gridSnap) - this.gridSnap / 2;
                        coords.y = snapToGrip(coords.y, this.gridSnap);

                        this.model._model[type][index].x = coords.x - 30;
                        this.model._model[type][index].y = coords.y - 30;
                        this.updateLinksPositions();
                    }
                }
            },

            mouseUp() {
                this.draggedItem = undefined;
                this.newLink = undefined;
            },

            mouseUpPort(portId) {
                var links = this.model._model.links;


                if (this.draggedItem && this.draggedItem.type === "points") {
                    console.log(this.draggedItem);
                    var pointIndex = this.draggedItem.pointIndex;
                    var linkIndex = this.draggedItem.linkIndex;

                    if (this.$refs["port-" + portId][0].type === "in") {
                        var l = links[linkIndex].points.length;
                        links[linkIndex].points.splice(
                            pointIndex,
                            l - this.draggedItem.pointIndex
                        );
                    } else {
                        links[linkIndex].points.splice(0, pointIndex + 1);
                    }
                    this.updateLinksPositions();
                }

                if (this.newLink !== undefined) {
                    var port1Id = this.newLink.startPortId;
                    var port2Id = portId;

                    var port1 = this.$refs["port-" + port1Id][0];
                    var port2 = this.$refs["port-" + port2Id][0];


                    if (port1.type === "in" && port2.type === "out") {
                        links.push({
                            id: generateId(),
                            from: port2.id,
                            to: port1.id,
                            positionFrom: {},
                            positionTo: {},
                            points: []
                        });
                    } else if (port2.type === "in" && port1.type === "out") {
                        links.push({
                            id: generateId(),
                            from: port1.id,
                            to: port2.id,
                            positionFrom: {},
                            positionTo: {},
                            points: []
                        });
                    } else {
                        console.warn("You must link one out port and one in port");
                    }

                    this.model._model.links = links;


                    this.updateLinksPositions();
                }
            },

            startDragPoint(pointInfo) {

                // this.draggedItem = pointInfo;

                this.model._model.links.splice(pointInfo.linkIndex, 1);
            },

            startDragItem(item, x, y) {

                this.panEnabled = false;
                this.draggedItem = item;
                this.selectedItem = item;
                this.initialDragX = x;
                this.initialDragY = y;
            }
        },
        computed: {
            querySelector: ()=> {
                return document.querySelector("#viewport");
            }
        },

        watch: {
            "model._model.links": function () {
                this.updateLinksPositions();
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    svg {
        user-select: none;
        font-family: Helvetica;
    }
</style>
