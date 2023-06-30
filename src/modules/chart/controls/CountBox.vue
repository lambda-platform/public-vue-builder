<template>
    <div>

        <Tabs>
            <TabPane
                    :label="lang.field"
                    icon="ios-list"
            >
                <div>
                    <h5 class="ve-title">{{ lang.icon }}</h5>
                    <div>

                        <div class="data-element">

                            <input
                                    v-model="icon"
                                    placeholder="Icon"
                            ></input>

                        </div>
                    </div>
                    <h5 class="ve-title">{{ lang.bg_color }}</h5>
                    <div>

                        <div class="data-element">

                            <input
                                    v-model="bgColor"
                                    placeholder="bgColor"
                            ></input>


                            <input type="color" v-model="bgColor"/>

                        </div>

                    </div>
                    <h5 class="ve-title">{{ lang.text_color }}</h5>
                    <div>

                        <div class="data-element">

                            <input
                                    v-model="textColor"
                                    placeholder="textColor"
                            ></input>

                        </div>


                    </div>
                    <h5 class="ve-title">{{ lang.link_title }}</h5>
                    <div>

                        <div class="data-element">

                            <input
                                    v-model="linkTitle"
                                    placeholder="linkTitle"
                            ></input>

                        </div>


                    </div>
                    <h5 class="ve-title">{{ lang.link }}</h5>
                    <div>

                        <div class="data-element">

                            <input
                                    v-model="link"
                                    placeholder="Link"
                            ></input>

                        </div>

                    </div>

                    <h5 class="ve-title">{{ lang.values }}</h5>
                    <div>

                        <draggable
                                class="dragArea"
                                v-model="countBox.countFields"
                                :options="{group:'element'}"
                        >
                            <div
                                    v-for="(column, index) in countBox.countFields"
                                    :key="index"
                                    class="data-element"
                            >
                        <span
                                class="groupBy"
                                v-if="column.groupBy"
                        >{{ lang.groupBy }}</span>
                                <span
                                        class="aggregation"
                                        v-if="column.aggregate != 'none'"
                                >{{column.aggregate}}</span>
                                <input
                                        v-model="column.title"
                                        :placeholder="column.name"
                                        @blur="column.editing = false"
                                ></input>
                                <Button
                                        class="delete-field"
                                        size="small"
                                        @click="deleteValues(index)"
                                >
                                    <Icon type="ios-close"/>
                                </Button>
                            </div>
                        </draggable>

                    </div>

                    <div>
                    </div>
                </div>

            </TabPane>
            <TabPane
                    :label="lang.settings"
                    icon="android-options"
            >
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

    import {
        mapGetters
    } from 'vuex';


    export default {
        methods: {

            showTable(table) {
                console.log('showing ', table)
            },
            deleteValues(index) {
                this.countBox.countFields.splice(index, 1);
            },
        },
        watch: {
            icon() {
                this.$store.commit('setCount', {target: 'icon', value: this.icon});
            },
            bgColor() {
                this.$store.commit('setCount', {target: 'bgColor', value: this.bgColor});
            },
            textColor() {
                this.$store.commit('setCount', {target: 'textColor', value: this.textColor});
            },
            link() {
                this.$store.commit('setCount', {target: 'link', value: this.link});
            },
            linkTitle() {
                this.$store.commit('setCount', {target: 'linkTitle', value: this.linkTitle});
            }
        },
        mounted() {


            this.icon = this.countBox.icon
            this.bgColor = this.countBox.bgColor
            this.countFields = this.countBox.countFields
            this.link = this.countBox.link
            this.linkTitle = this.countBox.linkTitle
            this.textColor = this.countBox.textColor
        },

        data() {
            return {
                filters: [],
                icon: 'flaticon-dashboard',
                bgColor: '#2ecc71',
                textColor: '#ffffff',
                linkTitle: '',
                link: '',
            }
        },
        computed: {
            ...mapGetters({
                elementTypes: 'elementTypes',
                elementType: 'elementType',
                countBox: 'countBox',
            }),
            lang() {
                const labels = ['icon','bg_color','text_color','link_title','link','values','groupBy','settings','_big','_small','field'];
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
