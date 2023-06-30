<template>
    <FormItem :label=label :prop=rule>
        <div v-if="isShow" class="qgis-map">
            <Spin fix v-if="isLoading"></Spin>
            <Spin fix v-if="isLoadingLayer"></Spin>
            <div id="qgis" style="height: 350px; border-radius: 10px;"></div>

            <div class="map-layer-switcher">
                <a href="javascript:void(0)" @click="switchLayer('googleRoad')">
                    <img src="/images/maps/google-road.jpg" alt="">
                    <span>Google road</span>
                </a>

                <a href="javascript:void(0)" @click="switchLayer('googleSatellite')">
                    <img src="/images/maps/google-satellite.jpg" alt="">
                    <span>Google satellite</span>
                </a>

                <a href="javascript:void(0)" @click="switchLayer('osm')">
                    <img src="/images/maps/openstreet.jpg" alt="">
                    <span>Open Street Map</span>
                </a>
            </div>

            <div class="map-filter">
                <Select v-model="filterFrm.aimag_id" placeholder="Аймаг/Хот" size="small" @on-change="getSum">
                    <Option
                        v-for="item in aimag"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </Option>
                </Select>

                <Select v-model="filterFrm.sum_id" placeholder="Сум/Дүүрэг" @on-change="getBag"
                        size="small">
                    <Option
                        v-for="item in soum"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </Option>
                </Select>

                <Select v-model="filterFrm.bag_id" placeholder="Баг/Хороо" @on-change="zoomToBag"
                        size="small">
                    <Option
                        v-for="item in bag"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </Option>
                </Select>
            </div>
        </div>
    </FormItem>
</template>
<script>

export default {
    props: ["model", "rule", "label", "meta", "do_render", "editMode", "tbl"],
    components: {},
    data() {
        return {
            isShow: false,
            map: null,
            parcelLayer: null,
            currentLayer: null,
            vector: null,
            source: null,
            isLoading: false,
            isLoadingLayer: false,
            q: "",
            selectedLayer: null,
            layers: {
                otm: new ol.source.TileImage({url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png"}),
                osm: new ol.source.TileImage({url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),
                osmBW: new ol.source.TileImage({url: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"}),
                osmCycle: new ol.source.TileImage({url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png"}),
                googleLayerRoadNames: new ol.source.TileImage({url: "https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}"}),
                googleLayerRoadmap: new ol.source.TileImage({url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"}),
                googleLayerSatellite: new ol.source.TileImage({url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"}),
                esriLayerStreet: new ol.source.TileImage({url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"}),
                esriLayerTopo: new ol.source.TileImage({url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"}),
                cartoPositron: new ol.source.TileImage({url: "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"}),
                stamenTerrain: new ol.source.TileImage({url: "https://a.tile.stamen.com/terrain/{z}/{x}/{y}.png"}),
                alagacSpecial: new ol.source.TileImage({url: "https://geoportal.nsdi.gov.mn/alagac/rest/services/ALAGAC/11THG/MapServer/tile/{z}/{y}/{x}"}),
                alagacForest: new ol.source.TileImage({url: "https://geoportal.nsdi.gov.mn/alagac/rest/services/ALAGAC/CTM_map/MapServer/tile/{z}/{y}/{x}"}),
                nsdi: new ol.source.TileImage({url: "https://gisserver01.nsdi.gov.mn/gzbgzzg/rest/services/EngineerHM/Ulaanbaatar_Gazar_Hudlul_Bichil_Mujlal_Hursnii_Orgil_Hurdatgal_UTM48N/MapServer/export?bbox=606139.8364730093,5264976.112310054,765882.3714873542,5333060.391939491"})
            },
            filterFrm: {
                aimag_id: null,
                sum_id: null,
                bag_id: null,
            },
            aimag: [],
            soum: [],
            bag: [],
            selectedAu: null,
            auCode: null
        };
    },

    created() {
        this.getAimag();
    },

    computed: {
        geoVal() {
            return this.model.form[this.model.component]
        }
    },

    watch: {
        do_render(value, oldValue) {
            if (value) {
                this.isShow = true;
                this.$nextTick(() => {
                    this.initMap();
                })
            } else {
                this.isShow = false;
                this.destroy();
            }
        },

        geoVal(value, oldValue) {
            if (value) {
                if (oldValue === null) {
                    this.getGisData(1);
                }
            }
        },
    },

    methods: {
        initMap() {
            this.source = new ol.source.Vector();
            this.vector = new ol.layer.Vector({
                source: this.source,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: "rgba(255, 255, 255, 0.2)",
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#ffcc33",
                        width: 2,
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: "#ffcc33",
                        }),
                    }),
                }),
            });

            this.currentLayer = new ol.layer.Tile({
                source: new ol.source.TileImage({
                    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
                    crossOrigin: "Anonymous",
                }),
            });

            this.map = new ol.Map({
                target: 'qgis',
                layers: [this.currentLayer, this.vector],
                view: new ol.View({
                    center: ol.proj.fromLonLat([106.831832, 47.8916288]),
                    zoom: 12
                }),
                controls: ol.control.defaults().extend([
                    new ol.control.FullScreen()
                ])
            });

            this.drawLayer();

            this.map.on("click", (evt) => {
                let latlng = ol.proj.transform(
                    evt.coordinate,
                    "EPSG:3857",
                    "EPSG:4326"
                );

                let lat = parseFloat(latlng[1]).toFixed(6);
                let lng = parseFloat(latlng[0]).toFixed(6);

                this.map.getView().setCenter(ol.proj.fromLonLat([parseFloat(lng), parseFloat(lat)]));
                this.map.getView().setZoom(18);

                if (this.parcelLayer != null) {
                    let view = this.map.getView();
                    let viewResolution = view.getResolution();
                    let source = this.parcelLayer.getSource();

                    let url = source.getGetFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), {
                        "INFO_FORMAT": "application/json",
                        "FEATURE_COUNT": 50
                    });

                    if (url) {
                        this.isLoadingLayer = true;
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                this.isLoadingLayer = false;
                                if (data != null && data.features.length > 0) {
                                    data.features.forEach(item => {
                                        if (item.properties) {
                                            // if (item.geometry.type == 'Point') {
                                            //     this.drawSelectedPoint(item.geometry.coordinates);
                                            //     // console.log(item.geometry.coordinates);
                                            // } else {
                                            this.setFormField(item.properties);
                                            this.model.form[this.model.component] = item.properties[this.meta.qgisOptions.cAttr];
                                            this.geoVal = item.properties[this.meta.qgisOptions.cAttr];
                                            // }

                                            if (Object.prototype.hasOwnProperty.call(item.properties, 'gid')) {
                                                this.getGisData(0);
                                            } else {
                                                this.$Message.error('Gid тохируулаагүй байна!');
                                            }
                                        }
                                    })
                                }
                            }).catch(e => {
                            this.isLoadingLayer = false;
                        })
                    }
                }
            });

            this.map.removeLayer(this.selectedLayer);
            this.map.removeLayer(this.markerLayer);
        },

        switchLayer(layer) {
            switch (layer) {
                case "otm":
                    this.currentLayer.setSource(this.layers.otm);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                case "googleRoad":
                    this.currentLayer.setSource(this.layers.googleLayerRoadmap);
                    // this.nameLayer = this.layers.googleLayerRoadNames;
                    // this.map.addLayer(this.nameLayer);
                    break;
                case "googleSatellite":
                    this.currentLayer.setSource(this.layers.googleLayerSatellite);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                case "esriTopo":
                    this.currentLayer.setSource(this.layers.esriLayerTopo);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                case "esriStreet":
                    this.currentLayer.setSource(this.layers.esriLayerStreet);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                case "cartoPositron":
                    this.currentLayer.setSource(this.layers.cartoPositron);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                case "stamenTerrain":
                    this.currentLayer.setSource(this.layers.stamenTerrain);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                case "osm":
                    this.currentLayer.setSource(this.layers.osm);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                case "osmBW":
                    this.currentLayer.setSource(this.layers.osmBW);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                case "osmCycle":
                    this.currentLayer.setSource(this.layers.osmCycle);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                case "alagacSpecial":
                    this.currentLayer.setSource(this.layers.alagacSpecial);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                case "alagacForest":
                    this.currentLayer.setSource(this.layers.alagacForest);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                case "nsdi":
                    this.currentLayer.setSource(this.layers.nsdi);
                    // this.map.removeLayer(this.nameLayer);
                    break;
                default:
                    break;
            }
        },

        setFormField(attr) {
            this.meta.qgisOptions.attrList.forEach(item => {
                this.model.form[item.label] = attr[item.value];
            })
        },

        drawLayer() {
            this.map.removeLayer(this.parcelLayer);

            this.isLoadingLayer = true;
            this.parcelLayer = new ol.layer.Tile({
                name: "wms",
                source: new ol.source.TileWMS({
                    ratio: 1,
                    url: this.meta.qgisOptions.service,
                    params: {
                        'FORMAT': 'image/png',
                        'VERSION': '1.1.1',
                        tiled: true,
                        "STYLES": '',
                        "LAYERS": this.meta.qgisOptions.link,
                        "exceptions": 'application/vnd.ogc.se_inimage',
                        "viewparams": "code:" + this.auCode,
                        tilesOrigin: 619573.6875 + "," + 5296553.5
                    }
                })
            });

            this.map.addLayer(this.parcelLayer);
            this.isLoadingLayer = false;
        },

        getGisData(isEdit) {
            this.isLoading = true;
            axios.get(`/urban/gis/${this.meta.qgisOptions.cTable}/${this.meta.qgisOptions.cShapeField}/${this.meta.qgisOptions.cAttr}/${this.geoVal}?tbl=${this.tbl}&edit=${isEdit}`)
                .then(({data}) => {
                    if (data.status) {
                        this.map.removeLayer(this.selectedLayer);
                        if (data.point) {
                            let point = JSON.parse(data.geo_shape);
                            this.drawSelectedPoint(point.coordinates)
                        } else {
                            this.drawSelected(data.shape);
                        }
                        let center = JSON.parse(data.center);
                        this.map.getView().setCenter(ol.proj.fromLonLat(center.coordinates));
                        this.map.getView().setZoom(16);
                    } else {
                        this.$Message.error(data.msg);
                    }
                    this.isLoading = false;
                }).catch(() => {
                this.isLoading = false;
            })
        },

        drawSelectedPoint(coords) {
            console.log('I am point', coords);

            this.map.removeLayer(this.markerLayer);
            let markerGeometry = new ol.geom.Point(ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'));
            let markerFeature = new ol.Feature({
                geometry: markerGeometry
            });

            let markerStyle = new ol.style.Icon(({
                src: '/images/markers/default.png',
                // src: 'https://github.com/openlayers/openlayers/blob/v3.20.1/examples/resources/logo-70x70.png'
            }));

            markerFeature.setStyle(new ol.style.Style({
                image: markerStyle,
            }));

            let vectorSource = new ol.source.Vector({
                features: [markerFeature]
            });

            this.markerLayer = new ol.layer.Vector({
                title: "Selected Point",
                visible: true,
                source: vectorSource
            });

            this.map.addLayer(this.markerLayer);
        },

        drawSelected(geom) {
            this.map.removeLayer(this.selectedLayer);
            let format = new ol.format.WKT();
            let feature = format.readFeature(geom);
            feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

            let wktStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255,0,0, .5)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(255,0,0, 1)',
                    width: 4
                }),
            });

            this.selectedLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [feature]
                }),
                style: wktStyle
            });

            this.map.addLayer(this.selectedLayer);
        },

        destroy() {
            this.filterFrm = {
                aimag_id: null,
                sum_id: null,
                bag_id: null,
            }

            // this.map.removeLayer(this.parcelLayer);
            // this.map.removeLayer(this.selectedAu);
            // this.map.removeLayer(this.selectedLayer);
            // this.map.getView().setCenter(ol.proj.fromLonLat([106.831832, 47.8916288]));
            // this.map.getView().setZoom(12);

            // this.$destroy();
            // this.$el.parentNode.removeChild(this.$el);
        },

        getAimag() {
            axios.get("/api/aimag").then(o => {
                this.aimag = o.data;
                if (this.editMode) {
                    this.getSum(this.filterFrm.aimag_id)
                }
            });
        },

        getSum(val) {
            console.log('a ID: ', val);
            if (typeof val !== "undefined") {
                console.log('I am here');

                this.soum = [];
                this.filterFrm.aimag_id = val;
                this.filterFrm.sum_id = null;

                axios.get("/api/sum/" + val).then(o => {
                    this.soum = o.data;
                });

                let currentAimag = this.aimag.find(item => item.code == val);
                let center = JSON.parse(currentAimag.center)
                this.map.getView().setCenter(ol.proj.fromLonLat([parseFloat(center.coordinates[0]), parseFloat(center.coordinates[1])]));
                this.map.getView().setZoom(8);
                this.drawPolygon(currentAimag.shape)
                this.auCode = val;
                this.drawLayer();
            }
        },

        getBag(val) {
            this.filterFrm.sum_id = val;
            this.bag = [];
            this.filterFrm.bag_id = null;

            axios.get("/api/baghoroo/" + val).then(o => {
                this.bag = o.data;
            });

            let currentSoum = this.soum.find(item => item.code == val);
            let center = JSON.parse(currentSoum.center)
            this.map.getView().setCenter(ol.proj.fromLonLat([parseFloat(center.coordinates[0]), parseFloat(center.coordinates[1])]));
            this.map.getView().setZoom(9);
            this.drawPolygon(currentSoum.shape)
            this.auCode = val;
            this.drawLayer();
        },

        zoomToBag(val) {
            this.filterFrm.bag_id = val;
            let currentBag = this.bag.find(item => item.code == val);
            let center = JSON.parse(currentBag.center)
            this.map.getView().setCenter(ol.proj.fromLonLat([parseFloat(center.coordinates[0]), parseFloat(center.coordinates[1])]));
            this.map.getView().setZoom(14);
            this.drawPolygon(currentBag.shape)
            this.auCode = val;
            this.drawLayer();
        },

        drawPolygon(geoData, opacity = '0.0') {
            if (this.selectedAu != null) {
                this.map.removeLayer(this.selectedAu);
            }

            geoData = JSON.parse(geoData);

            let parcelVector = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(geoData, {featureProjection: "EPSG:3857"})
            });

            this.selectedAu = new ol.layer.Vector({
                source: parcelVector,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "rgba(0, 0, 0, 0.3)",
                        lineDash: [4],
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba(0,0,0, 0.1)"
                    })
                })
            });

            this.map.addLayer(this.selectedAu);
        },
    }
}
</script>
