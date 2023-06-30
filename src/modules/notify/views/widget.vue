<template>
    <Poptip placement="bottom-end" class="no-animation">
        <a href="javascript:void(0)">
            <Badge :count="count">
                <i class="ti-bell"></i>
            </Badge>
        </a>
        <div class="header-notifications" slot="content">
            <div class="header-notification-info">
                <h3>{{ lang.notice }}</h3>
            </div>
<!--            <ul v-if="notifications.length > 0" v-slimscroll="scrollOptions">-->
            <ul v-if="notifications.length > 0">
                <li v-for="(notif, index) in notifications" :class="notif.seen ? 'seen' : ''">
                    <a class="notif-item" href="javascript:void(0)" @click="setSeen(notif.id, notif.link)">
                        <h4 class="notif-title">{{ notif.title }} | {{ notif.body }}</h4>
                        <div class="notif-content">
                            <a href="javascript:void(0)">
                                <i class="ti-user"></i> {{ notif.first_name != null ? notif.first_name : notif.login }}
                            </a>
                            <span>
                                <i class="ti-time"></i> {{ notif.created_at }}
                            </span>
                        </div>
                    </a>
                </li>
            </ul>
            <div v-else class="no-notifs">
                {{ lang.no_notice }}
            </div>

            <a class="all-notif" href="javascript:void(0)" @click="getAllNotification">
                <span>{{ lang.view_all_notifications }}</span>
                <i class="ti-arrow-right"></i>
            </a>
        </div>
    </Poptip>
</template>

<script>
import * as firebase from 'firebase/app';
import '@firebase/messaging';
import {loadLanguageAsync} from "../../../locale";

// import io from 'socket.io-client';
// const socket = io.connect(window.config.socketServer, {
//     'secure': true,
//     'reconnect': true,
//     'reconnection delay': 5000
// });

export default {
    props: ['user'],
    data() {
        return {
            notifications: [],
            count: 0
        }
    },

    mounted() {
        if (window.init.firebase_config) {
            if (!firebase.apps.length) {
                this.initFirebase();
                this.getNotificationGrant();
            }
        }

        this.getUnseenNotification();
    },

    computed: {
        lang() {
            const labels = ['notice', 'no_notice', 'view_all_notifications'];
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
        switchLanguage(val) {
            this.selectedLang = val;
            loadLanguageAsync(val);
        },

        getNotificationGrant() {
            Notification.requestPermission().then((permission) => {
                if (permission !== 'granted') {
                    console.log('Unable to get permission to notify.');
                }
            });
        },

        initFirebase() {
            var firebaseConfig = {
                apiKey: window.init.firebase_config.apiKey,
                authDomain: window.init.firebase_config.authDomain,
                databaseURL: window.init.firebase_config.databaseURL,
                projectId: window.init.firebase_config.projectId,
                storageBucket: window.init.firebase_config.storageBucket,
                messagingSenderId: window.init.firebase_config.messagingSenderId,
                appId: window.init.firebase_config.appId,
                measurementId: window.init.firebase_config.measurementId
            };
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);

            const messaging = firebase.messaging();
            messaging.usePublicVapidKey(window.init.firebase_config.publicKey);

            messaging.getToken().then((currentToken) => {
                if (currentToken) {
                    axios.get('/lambda/notify/token/' + window.init.user.id + '/' + currentToken).then(o => {
                        if (o.status) {
                            console.log('set token for user');
                        }
                    });
                } else {
                    console.log('No Instance ID token available. Request permission to generate one.');
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
            });

            messaging.onMessage((payload) => {
                this.notify(payload.data);
            });

        },

        getUnseenNotification() {
            console.log('working notification');
            axios.get('/lambda/notify/new/' + this.$props.user).then(o => {
                this.count = o.data.count;
                this.notifications = o.data.notifications;
            });
        },
        getAllNotification() {
            this.$router.push({path: '/module/notify'});
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

        notify(msg) {
            console.log(msg)
            // let parsedMsg = JSON.parse(msg.message);
            // console.log(parsedMsg);

            let nIndex = this.notifications.findIndex(noti => noti.id == msg.id);

            if (nIndex == -1) {
                this.notifications.unshift({
                    title: msg.title,
                    body: msg.body,
                    link: msg.link,
                    first_name: msg.first_name,
                    created_at: msg.created_at,
                    id: msg.id,
                });
                this.count = this.count + 1;
            }
            let notificationAudio = new Audio(msg.sound);
            notificationAudio.play()
            new Notification(msg.title, {
                title: msg.title,
                body: msg.body,
                icon: msg.icon,
            });


        },
    }
}
</script>

<style lang="scss">
.ivu-notice {
    top: auto;
    bottom: 30px;

    a {
        color: #565656;
        font-size: 12px;

        h4 {
            margin-bottom: 5px;
            font-weight: 500;
            font-size: 14px;
        }
    }

    &-notice {

    }
}
</style>
