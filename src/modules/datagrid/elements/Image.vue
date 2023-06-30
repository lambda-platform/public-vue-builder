<template>
    <div>
        <div v-if="multiImage" class="multi-images">
            <img v-for="(item, index) in images" :key="item.name" :src="`${baseUrl}${item.response}`" @click="multiZoom(index)"
                 class="ag-grid-image-multi"/>
            <span class="image-plus" v-if="plusCount > 1" @click="multiZoom(3)">+{{ plusCount }}</span>
        </div>
        <img v-else :src="`${baseUrl}${this.params.value ? this.params.value : '/assets/lambda/images/no-image.png'}`"
             @click="singleZoom"
             class="ag-grid-image"/>

        <Modal v-model="isZoom" class="grid-zoom-image-modal">
            <div slot="close">
                <a href="javascript:void(0)" class="grid-image-close-btn" @click="isZoom = false;"><i class="ti-close"></i></a>
            </div>
            <p slot="header"></p>
            <div class="grid-zoom-image">
                <div v-if="multiImage">
                    <a v-if="havePrev" href="javascript:void(0)" class="grid-image-prev-btn" @click="isPrev"><i class="ti-angle-left"></i></a>
                    <a v-if="haveNext" href="javascript:void(0)" class="grid-image-next-btn" @click="isNext"><i class="ti-angle-right"></i></a>
                    <img :src="`${baseUrl}${this.popUpImage}`" />
                </div>
                <img v-else :src="`${baseUrl}${this.params.value ? this.params.value : '/assets/lambda/images/no-image.png'}`" />
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            images: [],
            allImages: [],
            multiImage: false,
            plusCount: 0,
            defaultImage: null,
            isZoom: false,
            itemIndex: null,
            popUpImage: '',
            havePrev: true,
            haveNext: true,
        };
    },
    computed: {
        baseUrl() {
            try {
                let jsonData = JSON.parse(this.params.value);
                if (Array.isArray(jsonData)) {
                    this.multiImage = true;
                    this.allImages = jsonData;
                    if (jsonData.length <= 4) {
                        this.images = jsonData;
                    } else {
                        this.images = jsonData.slice(0, 3);
                        this.plusCount = jsonData.length - 3;
                    }
                }
            } catch (e) {
            }
            return this.params.baseUrl ? this.params.baseUrl : ""
        }
    },
    methods: {
        singleZoom() {
            this.isZoom = true;
        },
        multiZoom(index) {
            this.havePrev = index == 0 ? false : true;
            this.haveNext = this.allImages.length == index + 1 ? false : true;
            this.itemIndex = index;
            this.popUpImage = this.allImages[index].response;
            this.isZoom = true;
        },
        isPrev() {
            this.itemIndex = this.itemIndex - 1;
            this.havePrev = this.itemIndex == 0 ? false : true;
            this.haveNext = true;
            this.popUpImage = this.allImages[this.itemIndex].response;
        },
        isNext() {
            this.itemIndex = this.itemIndex + 1;
            this.haveNext = this.allImages.length == this.itemIndex + 1 ? false : true;
            this.havePrev = true;
            this.popUpImage = this.allImages[this.itemIndex].response;
        }
    }
});
</script>
