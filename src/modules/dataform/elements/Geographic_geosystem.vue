<template>
    <FormItem :label=label :prop=rule>
        <div class="geographic">
            <!--          <div class="point-coordinate" v-if="geometryType == 'point'">-->
            <!--            <table>-->
            <!--              <thead>-->
            <!--              <tr>-->
            <!--                <th>Уртраг</th>-->
            <!--                <th>Өргөрөг</th>-->
            <!--                <th>Төрөл</th>-->
            <!--              </tr>-->
            <!--              </thead>-->
            <!--              <tbody>-->

            <!--&lt;!&ndash;              <tr  :key="index" v-if="points.length >= 1">&ndash;&gt;-->
            <!--&lt;!&ndash;                <td>&ndash;&gt;-->
            <!--&lt;!&ndash;                  <span v-if="latlngMode == 'DD'" >{{points[0][0]}}</span>&ndash;&gt;-->
            <!--&lt;!&ndash;                  <span v-else v-html="DDtoDMS(points[0][0])"></span>&ndash;&gt;-->
            <!--&lt;!&ndash;                </td>&ndash;&gt;-->
            <!--&lt;!&ndash;                <td>&ndash;&gt;-->
            <!--&lt;!&ndash;                  <span v-if="latlngMode == 'DD'" >{{points[0][1]}}</span>&ndash;&gt;-->
            <!--&lt;!&ndash;                  <span v-else v-html="DDtoDMS(points[0][1])"></span>&ndash;&gt;-->
            <!--&lt;!&ndash;                </td>&ndash;&gt;-->
            <!--&lt;!&ndash;                <td>&ndash;&gt;-->
            <!--&lt;!&ndash;                  <RadioGroup v-model="latlngMode">&ndash;&gt;-->
            <!--&lt;!&ndash;                    <Radio label="DMS"></Radio>&ndash;&gt;-->
            <!--&lt;!&ndash;                    <Radio label="DD"></Radio>&ndash;&gt;-->
            <!--&lt;!&ndash;                  </RadioGroup>&ndash;&gt;-->
            <!--&lt;!&ndash;                </td>&ndash;&gt;-->
            <!--&lt;!&ndash;              </tr>&ndash;&gt;-->
            <!--<tr v-if="points.length >= 1" v-for="(point, index) in points" :key="index">-->
            <!--  <td>-->
            <!--    <input v-if="latlngMode == 'DD'" type="text" v-model="point[0]"/>-->
            <!--    <span v-html="DDtoDMS(point[0])"></span>-->
            <!--  </td>-->
            <!--  <td>-->
            <!--    <input v-if="latlngMode == 'DD'" type="text" v-model="point[1]"/>-->
            <!--    <span v-html="DDtoDMS(point[1])"></span>-->
            <!--  </td>-->
            <!--                  <td>-->
            <!--                    <RadioGroup v-model="latlngMode">-->
            <!--                      <Radio label="DMS"></Radio>-->
            <!--                      <Radio label="DD"></Radio>-->
            <!--                    </RadioGroup>-->
            <!--                  </td>-->
            <!--</tr>-->
            <!--<tr v-if="points.length == 0">-->
            <!--  <td>-->
            <!--    <input v-if="latlngMode == 'DD'" type="text" ref="lng" v-model="new_point.lng"-->
            <!--           @change="createNewGeometry"/>-->
            <!--    <Row class="dms" v-if="latlngMode == 'DMS'">-->
            <!--      <Col span="8"><input v-model="dms_point.lng.degree" type="text"-->
            <!--                           @change="createNewGeometry"> °-->
            <!--      </Col>-->
            <!--      <Col span="8"><input v-model="dms_point.lng.minute" type="text"-->
            <!--                           @change="createNewGeometry"> '-->
            <!--      </Col>-->
            <!--      <Col span="8"><input v-model="dms_point.lng.second" type="text"-->
            <!--                           @change="createNewGeometry"> "-->
            <!--      </Col>-->
            <!--    </Row>-->
            <!--  </td>-->
            <!--  <td>-->
            <!--    <input v-if="latlngMode == 'DD'" type="text" ref="lat" v-model="new_point.lat"-->
            <!--           @change="createNewGeometry"/>-->
            <!--    <Row class="dms" v-if="latlngMode == 'DMS'">-->
            <!--      <Col span="8"><input v-model="dms_point.lat.degree" type="text"-->
            <!--                           @change="createNewGeometry"> °-->
            <!--      </Col>-->
            <!--      <Col span="8"><input v-model="dms_point.lat.minute" type="text"-->
            <!--                           @change="createNewGeometry"> '-->
            <!--      </Col>-->
            <!--      <Col span="8"><input v-model="dms_point.lat.second" type="text"-->
            <!--                           @change="createNewGeometry"> "-->
            <!--      </Col>-->
            <!--    </Row>-->
            <!--  </td>-->
            <!--  <td>-->
            <!--    <RadioGroup v-model="latlngMode">-->
            <!--      <Radio label="DMS"></Radio>-->
            <!--      <Radio label="DD"></Radio>-->
            <!--    </RadioGroup>-->
            <!--  </td>-->
            <!--</tr>-->
            <!--              </tbody>-->
            <!--            </table>-->

            <!--          </div>-->
            <div class="geographic-map" ref="map" :class="openSide ? 'open-side' : ''">


                <div id="base-maps">
                    <ul>
                        <li v-for="(baseMap, index) in baseMaps" :key="index">
                            <a href="javascript:;" @click="changeBaseMap(index)"
                               :class="index == currentBaseMap ? 'active' : ''">
                                {{ baseMap.title }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div id="side_bar" :class="openSide ? 'open' : ''">
                <Button @click="openSide = !openSide" :icon="openSide ? 'ios-arrow-forward' : 'ios-arrow-back'"
                        :class="openSide ? 'side-toggle show' : 'side-toggle'"></Button>


                <RadioGroup v-model="latlngMode">
                    <Radio label="DMS"></Radio>
                    <Radio label="DD"></Radio>

                </RadioGroup>
                <span v-if="geometryType != 'point'"> {{lang.enterCoordinatesPressEnter}}</span>

                <table>

                    <thead>
                    <tr>
                        <th>дд</th>
                        <th>{{lang.longitude}}</th>
                        <th>{{lang.latitude}}</th>
                    </tr>
                    </thead>
                    <tbody>

                    <tr v-for="(point, index) in points" :key="index">
                        <td>{{index+1}}</td>
                        <td>
                            <input v-if="latlngMode == 'DD'" type="text" v-model="point[0]"/>
                            <Row class="dms" v-if="latlngMode == 'DMS'">
                                <Col span="8"><input v-model="dms_point.lng.degree" type="text"
                                                     @input="createNewGeometry">
                                </Col>
                                <Col span="8"><input v-model="dms_point.lng.minute" type="text"
                                                     @input="createNewGeometry">
                                </Col>
                                <Col span="8"><input v-model="dms_point.lng.second" type="text"
                                                     @input="createNewGeometry">
                                </Col>
                            </Row>
                        </td>
                        <td>
                            <input v-if="latlngMode == 'DD'" type="text" v-model="point[1]"/>
                            <Row class="dms" v-if="latlngMode == 'DMS'">
                                <Col span="8"><input v-model="dms_point.lat.degree" type="text"
                                                     @input="createNewGeometry">
                                </Col>
                                <Col span="8"><input v-model="dms_point.lat.minute" type="text"
                                                     @input="createNewGeometry">
                                </Col>
                                <Col span="8"><input v-model="dms_point.lat.second" type="text"
                                                     @input="createNewGeometry">
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    <tr v-if="points.length == 0">
                        <td></td>
                        <td>
                            <input v-if="latlngMode == 'DD'" type="text" ref="lng" v-model="new_point.lng"
                                   @input="createNewGeometry"/>
                            <Row class="dms" v-if="latlngMode == 'DMS'">
                                <Col span="8"><input v-model="dms_point.lng.degree" type="text"
                                                     @input="createNewGeometry">
                                </Col>
                                <Col span="8"><input v-model="dms_point.lng.minute" type="text"
                                                     @input="createNewGeometry">
                                </Col>
                                <Col span="8"><input v-model="dms_point.lng.second" type="text"
                                                     @change="createNewGeometry">
                                </Col>
                            </Row>
                        </td>
                        <td>
                            <input v-if="latlngMode == 'DD'" type="text" ref="lat" v-model="new_point.lat"
                                   @input="createNewGeometry"/>
                            <Row class="dms" v-if="latlngMode == 'DMS'">
                                <Col span="8"><input v-model="dms_point.lat.degree" type="text"
                                                     @input="createNewGeometry">
                                </Col>
                                <Col span="8"><input v-model="dms_point.lat.minute" type="text"
                                                     @input="createNewGeometry">
                                </Col>
                                <Col span="8"><input v-model="dms_point.lat.second" type="text"
                                                     @input="createNewGeometry">
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <Button type="success" @click="saveGraphic">{{lang.save }}</Button>
                <Button type="warning" @click="cancelGraphic">{{lang.cancel}}</Button>


                <!--<Button type="success" @click="getData">Get data</Button>-->


            </div>
            <!--<div id="spatial_query" v-if="featureLayerUrl" >-->
            <!--ТЗ-н тайлбайгаар шалгах  <i-switch size="small" v-model="checkByArea" @on-change="removeEditeLauyer"></i-switch>-->
            <!--<hr>-->
            <!--<div v-if="checkByArea">-->
            <!--<Form ref="searchForm" :model="formInline" :rules="ruleInline" inline>-->
            <!--<FormItem prop="search_value">-->
            <!--<Input type="text" size="small" v-model="formInline.search_value"-->
            <!--@on-enter="handleSubmit"-->
            <!--:placeholder="searchFieldPlaceHolder"/>-->


            <!--</FormItem>-->

            <!--<FormItem>-->
            <!--<Button :disabled="searchLoading" :loading="searchLoading" @click="handleSubmit"-->
            <!--size="small" shape="circle" icon="ios-search-outline">-->

            <!--</Button>-->
            <!--</FormItem>-->
            <!--</Form>-->
            <!--</div>-->


            <!--</div>-->
        </div>
    </FormItem>
</template>
<script>
// require('leaflet');

require('esri-leaflet');
require('leaflet-draw');
// require('leaflet.fullscreen');

import * as turf from 'turf'


export default {
    props: ["model", "rule", "label", "meta", "do_render", "editMode", "is_show"],
    computed: {
        lang() {
            const labels = ['longitude', 'latitude', 'cancel', 'save', 'thereZNoRightChangeInformation', 'enterCoordinatesCorrectly', 'error',
                'theSiteHasNotBeenSelected', ''
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
        options() {
            return this.meta.options;
        },
        geo_data() {
            return this.model.form[this.model.component]
        }
    },
    components: {},
    mounted() {
        if (this.meta.GeographicOption) {
            this.zoom = this.meta.GeographicOption.zoom;
            this.attributes = this.meta.GeographicOption.attributes.split(',');
            this.currentBaseMap = this.meta.GeographicOption.baseMap;
            this.geometryType = this.meta.GeographicOption.geometryType;
            this.center = this.meta.GeographicOption.center;

            this.checkByArea = this.meta.GeographicOption.checkByArea;
            this.featureLayerUrl = this.meta.GeographicOption.featureLayerUrl;
            this.featureTitles = this.meta.GeographicOption.featureTitles;
            this.searchField = this.meta.GeographicOption.searchField;
            this.formValueField = this.model.component;
            this.successMsg = this.meta.GeographicOption.successMsg;
            this.errorMsg = this.meta.GeographicOption.errorMsg;
            this.searchFieldPlaceHolder = this.meta.GeographicOption.searchFieldPlaceHolder;

        }

        if (!this.meta.hidden && this.do_render)
            this.initMap();
    },

    data() {
        return {
            latlngMode: 'DMS',
            formInline: {
                search_value: ''
            },
            ruleInline: {
                search_value: [
                    {required: true, message: 'Хайх утга аа оруулна уу', trigger: 'blur'}
                ]
            },
            current: null,
            new_point: {
                lng: null,
                lat: null
            },
            dms_point: {
                lat: {
                    degree: null,
                    minute: null,
                    second: null,
                },
                lng: {
                    degree: null,
                    minute: null,
                    second: null,
                }
            },
            attributes: [],
            geometryType: "point",
            points: [],
            openSide: false,

            checkByArea: false,
            featureLayerUrl: '',
            featureTitles: '',
            searchField: '',
            successMsg: '',
            formValueField: '',
            errorMsg: '',
            searchLoading: false,
            center:
                {
                    lat: 47.91876971846709,
                    lng: 106.91736415028574
                },
            zoom: 8,
            map:
                null,
            currentBaseMap:
                0,
            baseMaps:
                [
                    {
                        title: 'Google Гудамж',
                        thumb: '/webgis/images/baseMaps/googleStreets.jpg',
                        baseMap: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                            name: 'googlei',
                            maxZoom: 20,
                            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
                        }),
                        esri: false
                    },

                    {
                        title: 'Google Сансрын',
                        thumb: '/webgis/images/baseMaps/googleSatellite.jpg',
                        baseMap: L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                            name: 'googleil',
                            maxZoom: 20,
                            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
                        }),
                        esri: false
                    },
                    {
                        title: 'Open Street Map',
                        baseMap: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            name: 'osm',
                            maxZoom: 19,
                            subdomains: ['a', 'b', 'c']
                        }),
                        thumb: '/webgis/images/baseMaps/openstreet.jpg',
                        esri: false
                    }
                ],
            draw: null,
            layer: new L.FeatureGroup(),
            searchLayer: null,
            drawValue: null
        };
    },
    beforeMount() {
        if (this.meta.options) {
            this.meta.options = null;
        }
    },
    methods: {
        removeEditeLauyer() {
            this.layer.eachLayer((layer) => {

                this.layer.removeLayer(layer);
            });
            this.cancelGraphic()
        },
        clearSearchLayer() {
            if (this.searchLayer) {
                if (this.map.hasLayer(this.searchLayer)) {
                    this.map.removeLayer(this.searchLayer);
                }
                this.searchLayer = null;
            }

        },
        handleSubmit() {

            // let search_value = this.model.form[this.model.component];
            // if (search_value) {
            //     this.searchLoading = true;
            //     var instance = axios.create({
            //         headers: {
            //             common: {},
            //         },
            //     });
            //
            //     instance.get(`/api/get-region/${search_value}`).then(res => {
            //         if (res.data.object_id >= 1) {
            //             let url = `${this.featureLayerUrl}/query?returnGeometry=true&where=${this.searchField}=${res.data.object_id}&outFields=*&f=json&outSR=4326`;
            //
            //
            //             instance.get(url).then(res => {
            //
            //
            //                 if (res.data.features.length >= 1) {
            //                     var latlngs = res.data.features[0].geometry.rings[0];
            //                     let rings = [];
            //
            //
            //                     res.data.features[0].geometry.rings.forEach(ring => {
            //
            //                         let newLl = [];
            //                         ring.forEach(ll => {
            //                             newLl.push([ll[1], ll[0]])
            //                         });
            //
            //                         rings.push(newLl);
            //                     })
            //
            //                     this.clearSearchLayer();
            //
            //                     this.searchLayer = L.polygon(rings, {color: 'green'}).addTo(this.map);
            //
            //                     this.searchLayer.bindPopup(L.Util.template(this.featureTitles, res.data.features[0].attributes));
            //
            //                     let bounds = this.searchLayer.getBounds();
            //                     this.map.fitBounds(bounds);
            //
            //                     this.searchLoading = false;
            //                 } else {
            //                     this.searchLoading = false;
            //                     this.clearSearchLayer();
            //                     this.$Message.error('Талбай олдсонгүй!');
            //                 }
            //
            //
            //             })
            //         }
            //     });
            //
            //
            // }
        },

        cancelGraphic() {
            this.points = [];
            this.current = null;
            this.map.closePopup();
            this.openSide = false;
            let data = this.getData();
// this.clearSearchLayer();
            if (this.checkByArea && data) {
                if (this.searchLayer) {

                    let editAbleLayer = this.layer.toGeoJSON();
                    let searchFeature = this.searchLayer.toGeoJSON();

                    let not_inside = true;
                    searchFeature.geometry.coordinates.forEach(polygon_ => {
                        let searchLayer = turf.polygon([polygon_]);
                        editAbleLayer.features.forEach((layer) => {

                            if (this.geometryType == 'polygon') {
                                layer.geometry.coordinates[0].map(lat_lng => {
                                    let point = turf.point(lat_lng);
                                    if (turf.inside(point, searchLayer)) {
                                        not_inside = false;
                                    }
                                })
                            }
                            if (this.geometryType == 'point') {
                                let point = turf.point(layer.geometry.coordinates);
                                if (turf.inside(point, searchLayer)) {
                                    not_inside = false;
                                }
                                console.log(not_inside, "not_inside")
                            }

                        });
                    });

                    if (!not_inside) {

                        this.model.form[this.model.component] = data;
                        this.$Message.success(this.successMsg);
                    } else {

                        this.model.form[this.model.component] = null;
                        this.$Message.error(this.errorMsg);
                    }


                } else {
                    this.layer.eachLayer((layer) => {

                        this.map.removeLayer(layer);

                    });
                    this.model.form[this.model.component] = null;
                    this.$Message.error(this.lang.theSiteHasNotBeenSelected);
                }
            } else
                this.model.form[this.model.component] = data;

            if (data) {
                let dataObj = JSON.parse(data)
                this.points.push([dataObj.lng, dataObj.lat]);
            }

            if (this.editMode) {
                this.addData();
            }
        },

        createFeature(layer) {
            let geoJson = layer.toGeoJSON();
            let get_data = L.geoJSON(geoJson);
            get_data.eachLayer((l) => {
                this.layer.addLayer(this.setLayerOptions(l));
            });
        },

        setLayerOptions(layer) {
            layer.on('click', (e) => this.geometrySelectEvent(e));

            /*
                            let properties = {}
                            let popupForm = L.DomUtil.create('div');


                            this.attributes.map(attribute => {

                                properties[attribute] = layer.feature.properties[attribute] ? layer.feature.properties[attribute] : '';


                                let foromEl = L.DomUtil.create('div');
                                let line = L.DomUtil.create('br');
                                let label = L.DomUtil.create('label');

                                label.innerText = attribute;

                                let input = L.DomUtil.create('input',);

                                input.value = properties[attribute];
                                L.DomEvent.addListener(input, 'change', (e) => {

                                    properties[attribute] = input.value;
                                });

                                foromEl.appendChild(label);
                                foromEl.appendChild(line);
                                foromEl.appendChild(input);
                                popupForm.appendChild(foromEl);
                            });

                            if (!this.checkByArea)
                                layer.bindPopup(popupForm);

                            layer.feature.properties = properties;*/

            return layer;
        },
        saveGraphic() {


            let layer = null;
            if (this.geometryType == 'point') {

                if (this.latlngMode == "DMS") {
                    if (
                        this.dms_point.lng.degree !== null
                        && this.dms_point.lng.minute !== null
                        && this.dms_point.lng.second !== null
                        && this.dms_point.lat.degree !== null
                        && this.dms_point.lat.minute !== null
                        && this.dms_point.lat.second !== null

                    ) {


                        this.new_point.lng = this.DMSToDD(this.dms_point.lng.degree, this.dms_point.lng.minute, this.dms_point.lng.second);
                        this.new_point.lat = this.DMSToDD(this.dms_point.lat.degree, this.dms_point.lat.minute, this.dms_point.lat.second);


                        if (this.IsValidCoordinates([this.new_point.lng, this.new_point.lat])) {

                            this.points = [[this.new_point.lng, this.new_point.lat]];

                            layer = L.marker([this.points[0][1], this.points[0][0]]);
                        } else {

                            this.$Notice.error({
                                title: this.lang.error,
                                desc: this.lang.enterCoordinatesCorrectly
                            });

                            return true;
                        }
                    } else {

                        this.$Notice.error({
                            title: this.lang.error,
                            desc: this.lang.enterCoordinatesCorrectly
                        });

                        return true;
                    }
                } else {

                    if (this.new_point.lng !== null && this.new_point.lat !== null) {
                        this.new_point.lng = this.new_point.lng * 1;
                        this.new_point.lat = this.new_point.lat * 1;

                        if (this.IsValidCoordinates([this.new_point.lng, this.new_point.lat])) {
                            this.points = [[this.new_point.lng, this.new_point.lat]];
                            layer = L.marker([this.points[0][1], this.points[0][0]]);
                        } else {
                            this.$Notice.error({
                                title: this.lang.error,
                                desc: this.lang.enterCoordinatesCorrectly
                            });
                            return true;
                        }
                    } else {
                        if (this.editMode) {
                            if (this.points.length >= 1) {
                                this.points[0][0] = this.points[0][0] * 1;
                                this.points[0][1] = this.points[0][1] * 1;

                                if (this.IsValidCoordinates([this.points[0][0], this.points[0][1]])) {
                                    layer = L.marker([this.points[0][1], this.points[0][0]]);

                                } else {
                                    this.$Notice.error({
                                        title: this.lang.error,
                                        desc: this.lang.enterCoordinatesCorrectly
                                    });

                                    return true;
                                }
                            }
                        }
                    }
                }


            } else {

                let points = []
                this.points.map(point => {
                    if (this.IsValidCoordinates(point)) {
                        points.push([point[1], point[0]])
                    }
                });


                if (this.geometryType == 'line') {

                    layer = new L.polyline(points);

                }
                if (this.geometryType == 'polygon') {

                    layer = new L.polygon(points);


                }
            }

            if (layer) {

                this.createFeature(layer)

            }

            this.cancelGraphic();
        },
        destroy() {

            this.meta.options = null;

            if (this.map !== null) {

                this.layer.eachLayer((layer) => {

                    this.map.removeLayer(layer);
                });
                this.map.removeLayer(this.layer);


                this.layer = new L.FeatureGroup();
                this.map.remove();

                this.map = null;
                // var node = this.$refs.map;
                //
                // var parent = node.parentNode;
                // parent.removeChild(node);

                // var div = document.createElement("div");
                // div.setAttribute("id", "geographic");
                //
                // parent.appendChild(div);

            }
        },
        initMap() {


            this.map = L.map(this.$refs.map, {
                // fullscreenControl: true,
                // fullscreenControlOptions: {
                //     position: 'topleft'
                // }
            }).setView([this.center.lat, this.center.lng], this.zoom);

            this.map.addLayer(this.baseMaps[this.currentBaseMap].baseMap);

            if (!this.geo_data) {
                this.layer.eachLayer((layer) => {

                    this.map.removeLayer(layer);
                });
                this.map.removeLayer(this.layer);
            }


            this.draw = new L.Control.Draw({
                draw: {
                    polygon: this.geometryType == 'polygon' ? true : false,
                    rectangle: this.geometryType == 'polygon' ? true : false,
                    marker: this.geometryType == 'point' ? true : false,
                    polyline: this.geometryType == 'line' ? true : false,
                    circle: false,
                    circlemarker: false,
                },
                edit: {
                    featureGroup: this.layer, //REQUIRED!!
                    remove: this.meta && this.meta.disabled ? false : true
                },


            });

            this.map.addLayer(this.layer);


            this.map.addControl(this.draw);

            L.control.scale().addTo(this.map);

            this.map.on(L.Draw.Event.CREATED, (e) => {
                let type = e.layerType,
                    layer = e.layer;

                if (this.meta && this.meta.disabled) {
                    alert(this.lang.thereZNoRightChangeInformation);
                } else {
                    this.createFeature(layer);
                    this.cancelGraphic();
                }

            });

            this.map.on(L.Draw.Event.DELETED, (e) => {
                if (this.meta && this.meta.disabled) {
                    alert(this.lang.thereZNoRightChangeInformation);
                } else {
                    this.cancelGraphic();
                }
            });
            this.map.on(L.Draw.Event.EDITED, (e) => {
                if (this.meta && this.meta.disabled) {
                    alert(this.lang.thereZNoRightChangeInformation);
                } else {
                    this.cancelGraphic();
                }
            });


            if (this.model.form[this.model.component]) {

                console.log("EDIT")
                this.addData();
                this.openSide = false;

            } else {
                this.openSide = true;
            }

            // if (this.checkByArea) {
            //
            //   if (this.model.form[this.model.component]) {
            //     this.handleSubmit();
            //   }
            // }
        },
        addData() {
            let geoJsonPre = JSON.parse(this.model.form[this.model.component]);

            let geoJson = geoJsonPre;

            if (this.geometryType == 'point') {
                geoJson = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                coordinates: [geoJsonPre.lng, geoJsonPre.lat],
                                type: "Point"
                            }
                        }
                    ]
                }
            }
            let init_data = L.geoJSON(geoJson);
            init_data.eachLayer((l) => {

                this.layer.addLayer(this.setLayerOptions(l));
            });

            if (this.geometryType == 'point') {
                this.map.setView({lat: geoJsonPre.lat, lng: geoJsonPre.lng}, 10, {animation: true});

            } else {
                this.map.fitBounds(this.layer.getBounds());
            }
            this.openSide = false;
        },
        geometrySelectEvent(e) {
            if (this.meta && this.meta.disabled) {

            } else {
                this.current = e.target;
                this.points = [];
                if (e.target._latlngs) {


                    let points = [];
                    if (e.target._latlngs[0] instanceof Array) {

                        this.geometryType = 'polygon';
                        points = e.target.getLatLngs()[0];

                    } else {
                        this.geometryType = 'line';
                        points = e.target.getLatLngs();
                    }

                    points.map(point => {

                        this.points.push([
                            point.lng, point.lat
                        ]);
                    });

                } else {
                    this.geometryType = 'point';
                    let point = e.target.getLatLng();

                    this.points.push([
                        point.lng, point.lat
                    ]);

                }

                if (this.geometryType == "point") {


                    this.dms_point.lat = this.DDtoDMS2(this.points[0][1]);
                    this.dms_point.lng = this.DDtoDMS2(this.points[0][0]);
                }

                this.openSide = true;
            }

        },
        getData() {
            let geoJson = this.layer.toGeoJSON();

            if (geoJson.features.length >= 2) {
                let layerIndex = 0;
                this.layer.eachLayer((layer) => {
                    layerIndex = layerIndex + 1
                    if (layerIndex < geoJson.features.length) {
                        this.layer.removeLayer(layer);
                    }

                });
            }
            geoJson = this.layer.toGeoJSON();


            if (geoJson.features.length >= 1) {

                if (this.geometryType == 'point') {
                    this.drawValue = geoJson
                    let point = {
                        lat: geoJson.features[0].geometry.coordinates[1],
                        lng: geoJson.features[0].geometry.coordinates[0]
                    }
                    return JSON.stringify(point);
                } else {

                    return JSON.stringify(geoJson);
                }

            } else {
                return null;
            }
        },

        changeBaseMap(baseMapIndex) {
            this.map.removeLayer(this.baseMaps[this.currentBaseMap].baseMap);
            this.currentBaseMap = baseMapIndex;
            if (this.baseMaps[baseMapIndex].esri) {
                if (this.map.getZoom() > this.baseMaps[baseMapIndex].maxZoom) {
                    this.map.setZoom(this.baseMaps[baseMapIndex].maxZoom);
                }
                this.map.options.maxZoom = this.baseMaps[baseMapIndex].maxZoom;
                L.esri.basemapLayer(this.baseMaps[baseMapIndex].baseMap).addTo(this.map);

            } else {
                this.map.options.maxZoom = 20;
                this.map.addLayer(this.baseMaps[baseMapIndex].baseMap);
            }
        },

        createNewGeometry() {
            if (this.geometryType == "point") {
                return true;
            }

            if (this.latlngMode == "DMS") {

                if (
                    this.dms_point.lng.degree !== null
                    && this.dms_point.lng.minute !== null
                    && this.dms_point.lng.second !== null
                    && this.dms_point.lat.degree !== null
                    && this.dms_point.lat.minute !== null
                    && this.dms_point.lat.second !== null
                ) {
                    this.new_point.lng = this.DMSToDD(this.dms_point.lng.degree, this.dms_point.lng.minute, this.dms_point.lng.second);
                    this.new_point.lat = this.DMSToDD(this.dms_point.lat.degree, this.dms_point.lat.minute, this.dms_point.lat.second);
                    if (this.IsValidCoordinates([this.new_point.lng, this.new_point.lat])) {
                        if (this.geometryType == "point") {
                            this.points = [[this.new_point.lng, this.new_point.lat]];
                        } else {
                            this.points.push([this.new_point.lng, this.new_point.lat]);
                        }
                        this.resetInput()
                    }
                }
            } else {
                let source_value = null;
                if (this.new_point.lng !== null && this.new_point.lat === null) {
                    source_value = this.new_point.lng;
                }
                if (this.new_point.lng === null && this.new_point.lat !== null) {
                    source_value = this.new_point.lat;
                }
                if (this.new_point.lng !== null && this.new_point.lat !== null) {
                    this.new_point.lng = this.new_point.lng * 1;
                    this.new_point.lat = this.new_point.lat * 1;

                    if (this.IsValidCoordinates([this.new_point.lng, this.new_point.lat])) {
                        if (this.geometryType == "point") {
                            this.points = [[this.new_point.lng, this.new_point.lat]];
                        } else {
                            this.points.push([this.new_point.lng, this.new_point.lat]);
                        }
                        this.resetInput()
                    }
                }


                if (source_value) {
                    let coordinates = source_value.split(' ');
                    if (coordinates.length >= 1) {
                        let is_not_paste = false;
                        coordinates.map(coordinate => {
                            let lat_lng = coordinate.split('\t');
                            if (lat_lng.length >= 2) {
                                lat_lng[0] = lat_lng[0] * 1;
                                lat_lng[1] = lat_lng[1] * 1;
                                if (this.IsValidCoordinates([lat_lng[0], lat_lng[1]])) {
                                    this.points.push(lat_lng);
                                }
                            } else {
                                is_not_paste = true
                            }
                        });
                        if (!is_not_paste) {
                            this.resetInput()
                        }
                    }
                }
            }
        },

        DMSToDD(degrees, minutes, seconds) {

            // var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);
            //
            // return dd;

            return (degrees * 1) + (minutes * 1) / 60 + (seconds * 1) / (60 * 60);
        },

        DDtoDMS(dd) {
            // var d = Math.floor(Math.abs(deg));
            // var minfloat = (Math.abs(deg) - d) * 60;
            // var m = Math.floor(minfloat);
            // var secfloat = (minfloat - m) * 60;
            // var s = Math.round(secfloat);
            // if (s == 60) {
            //     m++;
            //     s = "00";
            // }
            // if (m == 60) {
            //     d++;
            //     m = "00";
            // }
            // if (s < 10) {
            //     s = "0" + s;
            // }
            // if (m < 10) {
            //     m = "0" + m;
            // }
            // var dir = "";
            // if (deg < 0) {
            //     dir = "-";
            // }


            // var dir = dd < 0
            //     ? isLng ? 'W' : 'S'
            //     : isLng ? 'E' : 'N';

            var absDd = Math.abs(dd);
            var deg = absDd | 0;
            var frac = absDd - deg;
            var min = (frac * 60) | 0;
            var sec = frac * 3600 - min * 60;
            // Round it to 2 decimal points.
            sec = Math.round(sec * 100) / 100;



            if (sec == 60) {
                min++;
                sec = "00";
            }
            if (min == 60) {
                deg++;
                min = "00";
            }
            return {
                degree: deg,
                minute: min,
                second: sec,
            };
        },

        DDtoDMS2(dd) {
            // var d = Math.floor(Math.abs(deg));
            // var minfloat = (Math.abs(deg) - d) * 60;
            // var m = Math.floor(minfloat);
            // var secfloat = (minfloat - m) * 60;
            // var s = Math.round(secfloat);
            // if (s == 60) {
            //     m++;
            //     s = "00";
            // }
            // if (m == 60) {
            //     d++;
            //     m = "00";
            // }
            // if (s < 10) {
            //     s = "0" + s;
            // }
            // if (m < 10) {
            //     m = "0" + m;
            // }
            // var dir = "";
            // if (deg < 0) {
            //     dir = "-";
            // }


            // var dir = dd < 0
            //     ? isLng ? 'W' : 'S'
            //     : isLng ? 'E' : 'N';

            var absDd = Math.abs(dd);
            var deg = absDd | 0;
            var frac = absDd - deg;
            var min = (frac * 60) | 0;
            var sec = frac * 3600 - min * 60;
            // Round it to 2 decimal points.
            sec = Math.round(sec * 100) / 100;

            if (sec == 60) {
                min++;
                sec = "00";
            }
            if (min == 60) {
                deg++;
                min = "00";
            }

            return {
                degree: deg,
                minute: min,
                second: sec,
            };
        },
        resetInput() {
            this.new_point = {
                lng: null,
                lat: null
            };
            this.dms_point = {
                lat: {
                    degree: null,
                    minute: null,
                    second: null,
                },
                lng: {
                    degree: null,
                    minute: null,
                    second: null,
                }
            };
            if (this.latlngMode == "DD") {
                this.$refs.lng.focus();
            }


        },
        IsValidCoordinates(lng_lat) {
            if (lng_lat) {
                if (lng_lat[0] && lng_lat[1]) {
                    lng_lat[0] = lng_lat[0] * 1;
                    lng_lat[1] = lng_lat[1] * 1;
                    return this.longitude(lng_lat[0]) && this.latitude(lng_lat[1])
                } else return false
            }
            return false


        },
        longitude(lon) {
            return !!(this.isNumber(lon) && this.between(lon, -180, 180))
        },
        latitude(lat) {
            return !!(this.isNumber(lat) && this.between(lat, -90, 90))
        },
        isNumber(n) {
            return typeof n === 'number'
        },
        between(value, n1, n2) {
            return n1 <= value && n2 >= value
        }
    },



    watch: {
        drawValue(value, oldValue) {
            //console.log(value, oldValue)
        },
        geo_data(value, oldValue) {

            if (value) {
                // if (this.checkByArea) {
                //   this.handleSubmit();
                // }

                if (oldValue === null) {
                    this.addData();
                }

            }
        },
        // geo_data(value, oldValue) {
        //
        //
        //   if ((value && !oldValue && this.editMode)) {
        //     console.log("watch 2")
        //     this.initMap();
        //   }
        //
        // },
        do_render(value, oldValue) {
            if (value) {
                if (!this.editMode) {
                    this.initMap();
                } else {
                    if (!this.geo_data && !this.map) {
                        this.initMap();
                    }
                }
            } else {
                this.destroy();
            }
        },
        options() {
            if (this.meta.options) {
                this.formInline.search_value = this.meta.options;
                this.handleSubmit();
            }
        }
    }

};
</script>
