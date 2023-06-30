<template>
    <section class="page">
        <krud class="material" v-if="!showConfigError" :template="property.template" :property="property" >
            <template slot="nav">
                <slot name="nav"></slot>
            </template>
            <user-control slot="right"></user-control>
        </krud>
        <div style="padding: 50px" v-else>
            <Alert type="warning" >lambda.json дээр firebase-н тохиргоог хийгээгүй байна !!!</Alert>
        </div>
    </section>
</template>

<script>

export default {
    name: "crud",
    data() {
        return {
            word: {},
            // property: {
            //     template: "canvas",
            //     title: 'Зорилтод мэдэгдэл',
            //     //title: this._title,
            //     grid: 'notification_target_grid',
            //     form: 'notification_target_form',
            //     actions: ''
            // },
            showConfigError:true
        };
    },
    methods: {

    },
    beforeMount() {
       if(window.lambda.notify.firebaseConfig.apiKey && window.lambda.notify.firebaseConfig.appId){
           this.showConfigError = false;
       }
    },
    computed: {
        lang() {
            const labels = ['target_statement',];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('project.' + labels[i]);
                return obj;
            }, {});
        },
        property() {
            return{
                template: "canvas",
                title: this.lang.target_statement,
                //title: this._title,
                grid: 'notification_target_grid',
                form: 'notification_target_form',
                actions: ''
            }
        },
    },

};
</script>


