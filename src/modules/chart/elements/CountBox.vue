<template>
<div class="el-count-box" v-bind:style="{ backgroundColor: bgColor}">

    <div class="icon">
        <span><i :class="icon" v-bind:style="{ color: bgColor}"></i></span>
    </div>
    <div class="text">
        <h3 v-bind:style="{ color: textColor}">{{showNumber(count)}}</h3>
        <p v-bind:style="{ color: textColor}">{{chart_title}}</p>
    </div>

<!--    <h1 v-bind:style="{ color: textColor}"><i :class="icon"></i>{{showNumber(count)}}</h1>-->

<!--    <h2 v-bind:style="{ color: textColor}">{{chart_title}}</h2>-->
<!--    <a :href="link" v-if="linkTitle && link" v-bind:style="{ color: textColor}" >{{linkTitle}}</a>-->
</div>
</template>

<script>
import axios from "axios"

import {getNumber} from '../utils/number';
import {
    idGenerator
} from "../utils/id"
export default {
    props: ['countFields', 'type', 'chart_title', 'id', 'chart_filter', 'filters', 'bgColor', 'icon', 'link', 'linkTitle', 'textColor', 'projectDomain'],
    methods: {
        showNumber(v){
            return getNumber(v);
        },
        getSeries() {

        },
        callData() {

            if (this.countFields.length >= 1 && this.countTitle) {


            }

        },
        sourceUrl() {

            if(window.init.projectSettings){

                // return window.init.projectSettings.dev_url;
                return window.init.projectSettings.production_url;
            } else {
                return ""
            }
        },
        dataCaller(filter) {
            let url = this.sourceUrl()+'/ve/get-data-count';
            if(this.projectDomain){
                url = this.projectDomain+url;
            }
            axios.post(url, {
                countFields: this.countFields

            }).then(response => {

                this.count = response.data;



            }).catch(error => {
                console.log(error)
            })
        },


    },

    mounted() {
        this.dataCaller()
    },
    data() {
        return {
            count: null,
            instance: null,
            timeout: null,

            lastFilter: []

        }
    },
    watch: {

        type: function (val) {

            this.initChart();
        },
        'countFields': {
            handler: function (after, befor) {

                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.callData();
                }, 1200);

            },
            deep: true
        },
        'chart_filter': {
            handler: function (after, befor) {

                if (this.timeout) {
                    clearTimeout(this.timeout);
                }

                this.callData();

            },
            deep: true
        },


        'title': {
            handler: function (after, befor) {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.callData();
                }, 1200);

            },
            deep: true
        }

    }
}
</script>
