<template>
    <FormItem :label=label :prop=rule>
        <div class="drag-map">

        </div>
    </FormItem>
</template>

<script>
export default {
    props: ["model", "rule", "label", "meta"],
    methods: {
        initMap(position) {
            var map = new google.maps.Map(
                this.$el.getElementsByClassName("drag-map")[0],
                {
                    zoom: this.zoom,
                    center: position
                }
            );

            this.marker = new google.maps.Marker({
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: { lat: position.lat, lng: position.lng }
            });
            this.marker.addListener("click", this.toggleBounce);
            this.marker.addListener(
                "position_changed",
                this.moveEvent.bind(this)
            );
        },
        toggleBounce() {
            if (this.marker.getAnimation() !== null) {
                this.marker.setAnimation(null);
            } else {
                this.marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        },
        moveEvent() {
            let posistion = {
                lat: this.marker.getPosition().lat(),
                lng: this.marker.getPosition().lng()
            };

            this.model.form[this.model.component] = JSON.stringify(posistion);
        },
        init() {
            const Cvalue = this.model.form[this.model.component];
            if (Cvalue !== null && Cvalue != "" && Cvalue != "''") {
                let position = JSON.parse(Cvalue);
                if (position.hasOwnProperty("lat")) {
                    this.initMap(position);
                } else this.initMap(this.center);
            } else this.initMap(this.center);
        }
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            center: { lat: 47.9197668, lng: 106.9183483 },
            zoom: 11,
            marker: null
        };
    },
    computed: {
        dateValue() {
            return this.model.form[this.model.component];
        }
    },
    watch: {
        dateValue(value, oldValue) {

            if(oldValue && !value || value && !oldValue){
                this.init();
            }

        }
    }
};
</script>

