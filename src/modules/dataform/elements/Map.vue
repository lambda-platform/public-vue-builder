<template>
    <div class="lambda-map-wrapper">
        <FormItem :label=label :prop=rule>
            <div class="lambda-lat-lng">
                <Input v-model="center.lat" :placeholder="lang.latitude" @on-blur="updateLat"/>
                <Input v-model="center.lng" :placeholder="lang.longitude"/>

            </div>
            <span>Хотын төвөөс: {{ fromCityCenter }} км</span>
            <div class="lambda-map"></div>
        </FormItem>
    </div>
</template>

<script>

export default {
    props: ["model", "rule", "label", "meta"],
    data() {
        return {
            map: null,
            center: {lat: 47.9197668, lng: 106.9183483},
            zoom: 11,
            marker: null, fromCityCenter: 0,
            isRender: false,
        };
    },

    computed: {
        coordinate() {
            return this.model.form[this.model.component];
        },
        lang() {
            const labels = ['fromCityCenter', 'latitude', 'longitude'
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
    },

    watch: {
        coordinate(value, oldValue) {
            if ((oldValue && !value) || (value && !oldValue)) {
                if (value) {
                    let center = JSON.parse(value);
                    this.center = {
                        lat: parseFloat(center.lat),
                        lng: parseFloat(center.lng)
                    };
                    this.init();
                }

            }
        }
    },

    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.map = new google.maps.Map(
                this.$el.getElementsByClassName("lambda-map")[0],
                {
                    zoom: this.zoom,
                    center: this.center
                }
            );

            this.marker = new google.maps.Marker({
                map: this.map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: this.center
            });

            google.maps.event.addListener(this.map, "click", e => {
                this.model.form[this.model.component] = JSON.stringify(e.latLng);
                this.marker.setPosition(e.latLng);
            });
            this.marker.addListener("position_changed", this.moveEvent.bind(this));
        },

        calcDistance(lat2, lon2) {
            let lat1 = 47.918540;
            let lon1 = 106.917658
            let p = 0.017453292519943295;    // Math.PI / 180
            let c = Math.cos;
            let a = 0.5 - c((lat2 - lat1) * p) / 2 +
                c(lat1 * p) * c(lat2 * p) *
                (1 - c((lon2 - lon1) * p)) / 2;

            this.fromCityCenter = (12742 * Math.asin(Math.sqrt(a))).toFixed(2); // 2 * R; R = 6371 km
        },

        moveEvent() {
            this.center = {
                lat: this.marker
                    .getPosition()
                    .lat()
                    .toFixed(10),
                lng: this.marker
                    .getPosition()
                    .lng()
                    .toFixed(10)
            };

            this.calcDistance(this.center.lat, this.center.lng);

            let latlng = new google.maps.LatLng(this.center.lat, this.center.lng);
            // this.map.setCenter(latlng);

            this.model.form[this.model.component] = JSON.stringify(this.center);
        },

        updateLat(e) {
            this.center.lat = parseFloat(e.target.value).toFixed(10);
            let latlng = new google.maps.LatLng(this.center.lat, this.center.lng);
            this.marker.setPosition(latlng);
        },

        updateLng(e) {
            this.center.lng = parseFloat(e.target.value).toFixed(10);
            let latlng = new google.maps.LatLng(this.center.lat, this.center.lng);
            this.marker.setPosition(latlng);
        }
    }
};
</script>


