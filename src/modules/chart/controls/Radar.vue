<template>
    <div >

        <Tabs>
            <TabPane :label="lang.field" icon="ios-list">
                <div>
                    <h5 class="ve-title">{{ lang.values }}</h5>
                    <div>
                        <draggable class="dragArea" v-model="radarFields.values" :options="{group:'element'}">
                            <div  v-for="(column, index) in radarFields.values" :key="index" class="data-element">

                                <input v-model="column.title"  :placeholder="column.name"  ></input>
                                <input v-model="column.indicator"  :placeholder="lang.responsible_value"  ></input>
                                <Button class="delete-field" size="small" @click="deleteValues(index)">
                                    <Icon type="md-close" />
                                </Button>
                            </div>
                        </draggable>
                    </div>

                </div>

            </TabPane>
            <TabPane :label="lang.settings" icon="android-options">
                <div>
                    <i-switch>
                        <span slot="open">{{ lang._big }}</span>
                        <span slot="close">{{ lang._small }}</span>
                    </i-switch>
                </div>
            </TabPane>

        </Tabs>

    </div>

</template>

<script>

    import draggable from 'vuedraggable';
    import {mapGetters} from 'vuex';


    export default {
        methods: {

            showTable(table) {
                console.log('showing ', table)
            },
            deleteValues(index) {

                this.radarFields.values.splice(index, 1);
            },
        },
        mounted() {

        },
        data() {
            return {
                filters: [],

            }
        },
        computed: {
            ...mapGetters({
                elementTypes: 'elementTypes',
                elementType: 'elementType',
                radarFields: 'radarFields',
            }),
            lang() {
                const labels = ['_name','field','groupBy','values','settings','_big','_small','responsible_value'];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('chart.' + labels[i]);
                    return obj;
                }, {});
            },
        },
        components: {
            draggable,

        },



    };
</script>

