<template>
    <section class="page noti">

        <paper-header class="mini">

            <div class="krud-header-right" slot="right">
<!--                <slot name="left">-->
<!--                    <div class="header-date-filter no-border">-->
<!--                        <span class="ctrl-text">Огноо:</span>-->
<!--                        <DatePicker type="date"-->
<!--                                    @on-change="onDateChanged"-->
<!--                                    v-model="cargoDate"-->
<!--                                    style="width: 105px"-->
<!--                                    placeholder="Эхлэх сонгох"/>-->
<!--                        <span class="divider-header"> - </span>-->
<!--                        <DatePicker type="date"-->
<!--                                    @on-change="onDateEndChanged"-->
<!--                                    v-model="cargoDateEnd"-->
<!--                                    style="width: 105px"-->
<!--                                    placeholder="Огноо сонгох"-->
<!--                        />-->
<!--                        <span class="divider-header"> | </span>-->
<!--                        <Select placeholder="Сонгох"-->
<!--                                v-model="status"-->
<!--                                style="width: 105px"-->
<!--                                @on-change="onStatusChanged">-->
<!--                            <Option-->
<!--                                v-for="item in statusList"-->
<!--                                :key="item.index"-->
<!--                                :value="item.value"-->
<!--                            >-->
<!--                                {{ item.name}}-->
<!--                            </Option>-->
<!--                        </Select>-->
<!--                    </div>-->
<!--                </slot>-->
                <slot name="right">
                    <user-control></user-control>
                </slot>
            </div>

            <div slot="nav">
                <ul>
                    <li>
                        <router-link to="">
                            <i class="tu-user"></i>
                            <span>{{ lang.notice }}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </paper-header>

        <section class="page-agent-form">
            <Card dis-hover>
                <template #title>
                    <i class="ti-bell"></i>
                    {{ lang.notice }}
                </template>
                <template #extra>
                    <Button size="small" type="primary" :disabled="count == 0" @click.prevent="seenAll">
                        <!--                        {{ lang.clear_notification}}-->
                        Бүгдийг харсан болгох
                    </Button>
<!--                    <a href="#" >-->
<!--                        <Icon type="ios-loop-strong"></Icon>-->
<!--&lt;!&ndash;                        {{ lang.clear_notification}}&ndash;&gt;-->
<!--                        Бүгдийг харсан болгох-->
<!--                    </a>-->
                </template>

                <div v-if="this.loading">
                    <div class="noti-body load">
                        <Spin fix>Ачааллаж байна...</Spin>
                    </div>
                </div>
                <div v-else>
                    <div class="noti-body" v-if="notifications.length > 0">
                        <a v-for="(notif, index) in notifications" class="notif-item" href="javascript:void(0)" @click="setSeen(notif.id, notif.link)">
                            <Card :key="index" :class="notif.seen ? '' : 'not_seen'">
                                <div class="notif-content">
                                    <h4 class="notif-title">{{ notif.title }}</h4>
                                    <Tag v-if="notif.seen">Харсан</Tag>
                                    <Tag v-else color="primary" closable @on-close="seen(notif.id)">Шинэ</Tag>
                                </div>
                                <div class="notif-footer-content">
                                    <a href="javascript:void(0)">
                                        <i class="ti-user"></i> {{ notif.first_name != null ? notif.first_name : notif.login }}
                                    </a>
                                    <span class="charec"> | </span>
                                    <span>
                                    <i class="ti-time"></i> {{ notif.created_at }}
                                </span>
                                </div>
                            </Card>
                        </a>
                    </div>
                    <div class="noti-body els" v-else>
                        <p>
                            {{ lang.no_notice }}
                        </p>
                    </div>
                    <div class="noti-footer">
                        <div class="noti-info">
                            <!--                            {{ lang.total }} : {{ info.total }}-->
                            Нийт : {{ info.total }}
                        </div>

                        <Page size="small"
                              :total="info.total"
                              :current="info.currentPage"
                              @on-change="changePage"></Page>
                    </div>
                </div>
            </Card>
        </section>
    </section>
</template>

<script>
    import {loadLanguageAsync} from "../../../locale";

    export default {
        props: ['user'],
        created() {
            this.getAllNotification();
            this.getUnseenNotification();
        },
        data() {
            return {
                notifications: [],
                loading: false,
                count: 0,
                info: {
                    total: 0,
                    totalPage: 0,
                    currentPage: 1
                },
                cargoDate: null,
                cargoDateEnd: null,
                status: 1,
                statusList: [
                    {
                        name: 'Бүгд',
                        value: 1
                    },
                    {
                        name: 'Харсан',
                        value: 2
                    },
                    {
                        name: 'Шинэ',
                        value: 3
                    }
                ]
            }
        },
        computed: {
            lang() {
                const labels = ['notice','no_notice','total','clear_notification'];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('notify.' + labels[i]);
                    return obj;
                }, {});
            },
        },
        beforeMount() {
            if (this.selectedLang != "mn") {
                loadLanguageAsync(this.selectedLang);
            }
        },
        methods: {
            getAllNotification() {
                this.loading = true;
                axios.get('/lambda/notify/all').then(o => {
                    this.info.total = o.data.total;
                    this.notifications = o.data.data;
                    this.loading = false;
                });
            },
            getUnseenNotification() {
                axios.get('/lambda/notify/new/' + this.$user.id).then(o => {
                    this.count = o.data.count;
                });
            },
            switchLanguage(val) {
                this.selectedLang = val;
                loadLanguageAsync(val);
            },
            seenAll() {
                this.loading = true;
                axios.get('/lambda/notify/seen-all').then(o => {
                    if (o.status) {
                        let currentNotif = this.notifications.map(item => {
                            if (item.seen == false) {
                                item.seen = true;
                            }
                        });
                        if (currentNotif) {
                            this.count = 0;
                            this.loading = false;
                            this.getUnseenNotification;
                        }
                    }
                });
            },
            seen(id) {
                axios.get('/lambda/notify/seen/' + id).then(o => {
                    if (o.status) {
                        let currentNotif = this.notifications.find(item => item.id == id);
                        if (currentNotif) {
                            this.count = this.count >= 1 ? this.count - 1 : 0;
                            currentNotif.seen = true;
                        }
                    }
                });
            },
            setSeen(id, link) {
                axios.get('/lambda/notify/seen/' + id).then(o => {
                    if (o.status) {
                        this.count = this.count >= 1 ? this.count - 1 : 0;
                        let currentNotif = this.notifications.find(item => item.id == id);
                        if (currentNotif) {
                            currentNotif.seen = true;
                        }
                        this.$router.push({path: link, hash: 'had'});
                    }
                });
            },
            changePage(pageNumber) {
                this.loading = true;
                axios.get('/lambda/notify/all?page=' + pageNumber).then(o => {
                    this.notifications = o.data.data;
                    this.info.currentPage = o.data.current_page;
                    this.loading = false;
                });
            },
            onDateChanged(value) {
                if (value == null || value == "") {
                    this.$Message.error("Огноо сонгоно уу!");
                    return;
                }

                if (!(typeof value === "string" || value instanceof String)) {
                    this.cargoDate = getDate(value);
                } else {
                    this.cargoDate = value;
                }

                this.property.custom_condition[0].value = [this.cargoDate, this.cargoDateEnd];

                this.$router.push(`/logistic/cargotrack?cargoDate=${this.cargoDate}&cargoDateEnd=${this.cargoDateEnd}`);

                setTimeout(() => {
                    this.$refs.localKrud.$refs.krud.$refs.grid.refresh();
                }, 400);
            },

            onDateEndChanged(value) {
                if (value == null || value == '') {
                    this.$Message.error('Огноо сонгоно уу!');
                    return;
                }

                if (!(typeof value === "string" || value instanceof String)) {
                    this.cargoDateEnd = getDate(value);
                } else {
                    this.cargoDateEnd = value
                }

                this.property.custom_condition[0].value = [this.cargoDate, this.cargoDateEnd];

                this.$router.push(`/logistic/cargotrack?cargoDate=${this.cargoDate}&cargoDateEnd=${this.cargoDateEnd}`);

                setTimeout(() => {
                    this.$refs.localKrud.$refs.krud.$refs.grid.refresh();
                }, 400);
            },
            onStatusChanged(value) {
                this.loading = true;
                switch (value) {
                    case 1: var newArray =  this.notifications.filter(function (el) {
                        return el.seen = 1;
                        console.log('Бүгд');
                        this.notifications = newArray;
                        this.loading = false;
                    }); break;
                    case 2: var newArray =  this.notifications.filter(function (el) {
                        return el.seen = 0;
                        console.log('Бүгд');
                        this.notifications = newArray;
                        this.loading = false;
                    }); break;
                    case 3: console.log('Шинэ'); break;
                }
                console.log(value);

            }
        }
    }
</script>
<style lang="scss">
@import "../scss/notify";
</style>
