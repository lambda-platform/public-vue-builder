<template>
    <div>
        <Modal v-model="iconSelector" title="ICON сонгох" width="1000px">

            <div style="text-align:center">
                <Input :placeholder="lang.search" v-model="iconSearch"/>
                <br>
                <Form>
                    <Input placeholder="Айкон класс нэр" @on-change="setIconClass"/>
                </Form>
                <section class="icons-list">
                    <div class="pagewidth">
                        <div class="icon-section" v-for="iconGroup in filteredIcons" :key="iconGroup.index">
                            <h3>{{ iconGroup.title }}</h3>
                            <div v-if="iconGroup.hasOwnProperty('svgs')">
                                <div class="icon-container" v-for="svg in iconGroup.svgs" :key="svg.index"
                                     @click="setIcon(svg.url, true)">
                                    <inline-svg :src="svg.url"/>
                                    <span class="icon-name">{{ svg.name }}</span>
                                </div>
                            </div>
                            <div v-else>
                                <div class="icon-container" v-for="icon in iconGroup.icons" :key="icon.index"
                                     @click="setIcon(icon, false)">
                                    <i :class="icon"></i><span class="icon-name"> {{ icon }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- /pagewidth -->
                </section>
            </div>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg';

export default {
    props: [
        "iconSelector"
    ],
    components: {
        InlineSvg,
    },
    data() {
        let customIcons = [];
        if (window.init) {
            if (window.init.custom_icons) {
                customIcons = window.init.custom_icons;
            }
        }
        return {
            iconSearch: "",
            iconData: [
                ...customIcons,

                {
                    "title": "Flat Icons",
                    "icons": [
                        "flaticon-users",
                        "flaticon-list-3",
                        "flaticon-file-1",
                        "flaticon-time-3",
                        "flaticon-profile-1",
                        "flaticon-time-2",
                        "flaticon-list-2",
                        "flaticon-multimedia-2",
                        "flaticon-interface-9",
                        "flaticon-file",
                        "flaticon-background",
                        "flaticon-chat-1",
                        "flaticon-graph",
                        "flaticon-pie-chart",
                        "flaticon-bag",
                        "flaticon-warning-2",
                        "flaticon-visible",
                        "flaticon-line-graph",
                        "flaticon-diagram",
                        "flaticon-statistics",
                        "flaticon-paper-plane",
                        "flaticon-cogwheel-2",
                        "flaticon-lifebuoy",
                        "flaticon-settings",
                        "flaticon-menu-button",
                        "flaticon-user",
                        "flaticon-apps",
                        "flaticon-clock-1",
                        "flaticon-close",
                        "flaticon-pin",
                        "flaticon-circle",
                        "flaticon-interface-8",
                        "flaticon-technology-1",
                        "flaticon-danger",
                        "flaticon-exclamation-square",
                        "flaticon-cancel",
                        "flaticon-calendar-2",
                        "flaticon-warning-sign",
                        "flaticon-more",
                        "flaticon-exclamation-2",
                        "flaticon-cogwheel-1",
                        "flaticon-book",
                        "flaticon-squares-4",
                        "flaticon-clock",
                        "flaticon-graphic-2",
                        "flaticon-symbol",
                        "flaticon-tool-1",
                        "flaticon-laptop",
                        "flaticon-event-calendar-symbol",
                        "flaticon-logout",
                        "flaticon-refresh",
                        "flaticon-questions-circular-button",
                        "flaticon-search-magnifier-interface-symbol",
                        "flaticon-search-1",
                        "flaticon-more-v2",
                        "flaticon-attachment",
                        "flaticon-speech-bubble-1",
                        "flaticon-open-box",
                        "flaticon-coins",
                        "flaticon-speech-bubble",
                        "flaticon-squares-3",
                        "flaticon-computer",
                        "flaticon-alert-2",
                        "flaticon-alert-off",
                        "flaticon-map",
                        "flaticon-interface-7",
                        "flaticon-graphic-1",
                        "flaticon-cogwheel",
                        "flaticon-alert-1",
                        "flaticon-folder-4",
                        "flaticon-interface-6",
                        "flaticon-interface-5",
                        "flaticon-calendar-1",
                        "flaticon-time-1",
                        "flaticon-signs-2",
                        "flaticon-calendar",
                        "flaticon-search",
                        "flaticon-infinity",
                        "flaticon-list-1",
                        "flaticon-bell",
                        "flaticon-delete",
                        "flaticon-squares-2",
                        "flaticon-clipboard",
                        "flaticon-shapes",
                        "flaticon-comment",
                        "flaticon-squares-1",
                        "flaticon-mark",
                        "flaticon-signs-1",
                        "flaticon-squares",
                        "flaticon-business",
                        "flaticon-car",
                        "flaticon-light",
                        "flaticon-information",
                        "flaticon-dashboard",
                        "flaticon-edit-1",
                        "flaticon-location",
                        "flaticon-technology",
                        "flaticon-exclamation-1",
                        "flaticon-tea-cup",
                        "flaticon-notes",
                        "flaticon-analytics",
                        "flaticon-transport",
                        "flaticon-truck",
                        "flaticon-user-settings",
                        "flaticon-user-add",
                        "flaticon-user-ok",
                        "flaticon-internet",
                        "flaticon-alert",
                        "flaticon-alarm",
                        "flaticon-grid-menu",
                        "flaticon-up-arrow-1",
                        "flaticon-more-v3",
                        "flaticon-lock-1",
                        "flaticon-profile",
                        "flaticon-map-location",
                        "flaticon-placeholder-2",
                        "flaticon-route",
                        "flaticon-more-v4",
                        "flaticon-lock",
                        "flaticon-multimedia-1",
                        "flaticon-add",
                        "flaticon-more-v5",
                        "flaticon-more-v6",
                        "flaticon-grid-menu-v2",
                        "flaticon-suitcase",
                        "flaticon-app",
                        "flaticon-interface-4",
                        "flaticon-time",
                        "flaticon-list",
                        "flaticon-music-2",
                        "flaticon-tool",
                        "flaticon-security",
                        "flaticon-interface-3",
                        "flaticon-interface-2",
                        "flaticon-interface-1",
                        "flaticon-layers",
                        "flaticon-placeholder-1",
                        "flaticon-placeholder",
                        "flaticon-web",
                        "flaticon-multimedia",
                        "flaticon-tabs",
                        "flaticon-signs",
                        "flaticon-interface",
                        "flaticon-network",
                        "flaticon-share",
                        "flaticon-info",
                        "flaticon-exclamation",
                        "flaticon-music-1",
                        "flaticon-medical",
                        "flaticon-imac",
                        "flaticon-cart",
                        "flaticon-download",
                        "flaticon-edit",
                        "flaticon-graphic",
                        "flaticon-browser",
                        "flaticon-up-arrow",
                        "flaticon-folder-3",
                        "flaticon-folder-2"
                    ]
                },
                {
                    "title": "TI | Arrows & Direction Icons",
                    "icons": [
                        "ti-arrow-up",
                        "ti-arrow-right",
                        "ti-arrow-left",
                        "ti-arrow-down",
                        "ti-arrows-vertical",
                        "ti-arrows-horizontal",
                        "ti-angle-up",
                        "ti-angle-right",
                        "ti-angle-left",
                        "ti-angle-down",
                        "ti-angle-double-up",
                        "ti-angle-double-right",
                        "ti-angle-double-left",
                        "ti-angle-double-down",
                        "ti-move",
                        "ti-fullscreen",
                        "ti-arrow-top-right",
                        "ti-arrow-top-left",
                        "ti-arrow-circle-up",
                        "ti-arrow-circle-right",
                        "ti-arrow-circle-left",
                        "ti-arrow-circle-down",
                        "ti-arrows-corner",
                        "ti-split-v",
                        "ti-split-v-alt",
                        "ti-split-h",
                        "ti-hand-point-up",
                        "ti-hand-point-right",
                        "ti-hand-point-left",
                        "ti-hand-point-down",
                        "ti-back-right",
                        "ti-back-left",
                        "ti-exchange-vertical"
                    ]
                },
                {
                    "title": "TI | Web App Icons",
                    "icons": [
                        "ti-wand",
                        "ti-save",
                        "ti-save-alt",
                        "ti-direction",
                        "ti-direction-alt",
                        "ti-user",
                        "ti-link",
                        "ti-unlink",
                        "ti-trash",
                        "ti-target",
                        "ti-tag",
                        "ti-desktop",
                        "ti-tablet",
                        "ti-mobile",
                        "ti-email",
                        "ti-star",
                        "ti-spray",
                        "ti-signal",
                        "ti-shopping-cart",
                        "ti-shopping-cart-full",
                        "ti-settings",
                        "ti-search",
                        "ti-zoom-in",
                        "ti-zoom-out",
                        "ti-cut",
                        "ti-ruler",
                        "ti-ruler-alt-2",
                        "ti-ruler-pencil",
                        "ti-ruler-alt",
                        "ti-bookmark",
                        "ti-bookmark-alt",
                        "ti-reload",
                        "ti-plus",
                        "ti-minus",
                        "ti-close",
                        "ti-pin",
                        "ti-pencil",
                        "ti-pencil-alt",
                        "ti-paint-roller",
                        "ti-paint-bucket",
                        "ti-na",
                        "ti-medall",
                        "ti-medall-alt",
                        "ti-marker",
                        "ti-marker-alt",
                        "ti-lock",
                        "ti-unlock",
                        "ti-location-arrow",
                        "ti-layout",
                        "ti-layers",
                        "ti-layers-alt",
                        "ti-key",
                        "ti-image",
                        "ti-heart",
                        "ti-heart-broken",
                        "ti-hand-stop",
                        "ti-hand-open",
                        "ti-hand-drag",
                        "ti-flag",
                        "ti-flag-alt",
                        "ti-flag-alt-2",
                        "ti-eye",
                        "ti-import",
                        "ti-export",
                        "ti-cup",
                        "ti-crown",
                        "ti-comments",
                        "ti-comment",
                        "ti-comment-alt",
                        "ti-thought",
                        "ti-clip",
                        "ti-check",
                        "ti-check-box",
                        "ti-camera",
                        "ti-announcement",
                        "ti-brush",
                        "ti-brush-alt",
                        "ti-palette",
                        "ti-briefcase",
                        "ti-bolt",
                        "ti-bolt-alt",
                        "ti-blackboard",
                        "ti-bag",
                        "ti-world",
                        "ti-wheelchair",
                        "ti-car",
                        "ti-truck",
                        "ti-timer",
                        "ti-ticket",
                        "ti-thumb-up",
                        "ti-thumb-down",
                        "ti-stats-up",
                        "ti-stats-down",
                        "ti-shine",
                        "ti-shift-right",
                        "ti-shift-left",
                        "ti-shift-right-alt",
                        "ti-shift-left-alt",
                        "ti-shield",
                        "ti-notepad",
                        "ti-server",
                        "ti-pulse",
                        "ti-printer",
                        "ti-power-off",
                        "ti-plug",
                        "ti-pie-chart",
                        "ti-panel",
                        "ti-package",
                        "ti-music",
                        "ti-music-alt",
                        "ti-mouse",
                        "ti-mouse-alt",
                        "ti-money",
                        "ti-microphone",
                        "ti-menu",
                        "ti-menu-alt",
                        "ti-map",
                        "ti-map-alt",
                        "ti-location-pin",
                        "ti-light-bulb",
                        "ti-info",
                        "ti-infinite",
                        "ti-id-badge",
                        "ti-hummer",
                        "ti-home",
                        "ti-help",
                        "ti-headphone",
                        "ti-harddrives",
                        "ti-harddrive",
                        "ti-gift",
                        "ti-game",
                        "ti-filter",
                        "ti-files",
                        "ti-file",
                        "ti-zip",
                        "ti-folder",
                        "ti-envelope",
                        "ti-dashboard",
                        "ti-cloud",
                        "ti-cloud-up",
                        "ti-cloud-down",
                        "ti-clipboard",
                        "ti-calendar",
                        "ti-book",
                        "ti-bell",
                        "ti-basketball",
                        "ti-bar-chart",
                        "ti-bar-chart-alt",
                        "ti-archive",
                        "ti-anchor",
                        "ti-alert",
                        "ti-alarm-clock",
                        "ti-agenda",
                        "ti-write",
                        "ti-wallet",
                        "ti-video-clapper",
                        "ti-video-camera",
                        "ti-vector",
                        "ti-support",
                        "ti-stamp",
                        "ti-slice",
                        "ti-shortcode",
                        "ti-receipt",
                        "ti-pin2",
                        "ti-pin-alt",
                        "ti-pencil-alt2",
                        "ti-eraser",
                        "ti-more",
                        "ti-more-alt",
                        "ti-microphone-alt",
                        "ti-magnet",
                        "ti-line-double",
                        "ti-line-dotted",
                        "ti-line-dashed",
                        "ti-ink-pen",
                        "ti-info-alt",
                        "ti-help-alt",
                        "ti-headphone-alt",
                        "ti-gallery",
                        "ti-face-smile",
                        "ti-face-sad",
                        "ti-credit-card",
                        "ti-comments-smiley",
                        "ti-time",
                        "ti-share",
                        "ti-share-alt",
                        "ti-rocket",
                        "ti-new-window",
                        "ti-rss",
                        "ti-rss-alt"
                    ]
                },
                {
                    "title": "TI | Control Icons",
                    "icons": [
                        "ti-control-stop",
                        "ti-control-shuffle",
                        "ti-control-play",
                        "ti-control-pause",
                        "ti-control-forward",
                        "ti-control-backward",
                        "ti-volume",
                        "ti-control-skip-forward",
                        "ti-control-skip-backward",
                        "ti-control-record",
                        "ti-control-eject"
                    ]
                },
                {
                    "title": "TI | Text Editor",
                    "icons": [
                        "ti-paragraph",
                        "ti-uppercase",
                        "ti-underline",
                        "ti-text",
                        "ti-Italic",
                        "ti-smallcap",
                        "ti-list",
                        "ti-list-ol",
                        "ti-align-right",
                        "ti-align-left",
                        "ti-align-justify",
                        "ti-align-center",
                        "ti-quote-right",
                        "ti-quote-left"
                    ]
                },
                {
                    "title": "TI | Layout Icons",
                    "icons": [
                        "ti-layout-width-full",
                        "ti-layout-width-default",
                        "ti-layout-width-default-alt",
                        "ti-layout-tab",
                        "ti-layout-tab-window",
                        "ti-layout-tab-v",
                        "ti-layout-tab-min",
                        "ti-layout-slider",
                        "ti-layout-slider-alt",
                        "ti-layout-sidebar-right",
                        "ti-layout-sidebar-none",
                        "ti-layout-sidebar-left",
                        "ti-layout-placeholder",
                        "ti-layout-menu",
                        "ti-layout-menu-v",
                        "ti-layout-menu-separated",
                        "ti-layout-menu-full",
                        "ti-layout-media-right",
                        "ti-layout-media-right-alt",
                        "ti-layout-media-overlay",
                        "ti-layout-media-overlay-alt",
                        "ti-layout-media-overlay-alt-2",
                        "ti-layout-media-left",
                        "ti-layout-media-left-alt",
                        "ti-layout-media-center",
                        "ti-layout-media-center-alt",
                        "ti-layout-list-thumb",
                        "ti-layout-list-thumb-alt",
                        "ti-layout-list-post",
                        "ti-layout-list-large-image",
                        "ti-layout-line-solid",
                        "ti-layout-grid4",
                        "ti-layout-grid3",
                        "ti-layout-grid2",
                        "ti-layout-grid2-thumb",
                        "ti-layout-cta-right",
                        "ti-layout-cta-left",
                        "ti-layout-cta-center",
                        "ti-layout-cta-btn-right",
                        "ti-layout-cta-btn-left",
                        "ti-layout-column4",
                        "ti-layout-column3",
                        "ti-layout-column2",
                        "ti-layout-accordion-separated",
                        "ti-layout-accordion-merged",
                        "ti-layout-accordion-list",
                        "ti-widgetized",
                        "ti-widget",
                        "ti-widget-alt",
                        "ti-view-list",
                        "ti-view-list-alt",
                        "ti-view-grid",
                        "ti-upload",
                        "ti-download",
                        "ti-loop",
                        "ti-layout-sidebar-2",
                        "ti-layout-grid4-alt",
                        "ti-layout-grid3-alt",
                        "ti-layout-grid2-alt",
                        "ti-layout-column4-alt",
                        "ti-layout-column3-alt",
                        "ti-layout-column2-alt"
                    ]
                },
                {
                    "title": "Brand Icons",
                    "icons": [
                        "ti-flickr",
                        "ti-flickr-alt",
                        "ti-instagram",
                        "ti-google",
                        "ti-github",
                        "ti-facebook",
                        "ti-dropbox",
                        "ti-dropbox-alt",
                        "ti-dribbble",
                        "ti-apple",
                        "ti-android",
                        "ti-yahoo",
                        "ti-trello",
                        "ti-stack-overflow",
                        "ti-soundcloud",
                        "ti-sharethis",
                        "ti-sharethis-alt",
                        "ti-reddit",
                        "ti-microsoft",
                        "ti-microsoft-alt",
                        "ti-linux",
                        "ti-jsfiddle",
                        "ti-joomla",
                        "ti-html5",
                        "ti-css3",
                        "ti-drupal",
                        "ti-wordpress",
                        "ti-tumblr",
                        "ti-tumblr-alt",
                        "ti-skype",
                        "ti-youtube",
                        "ti-vimeo",
                        "ti-vimeo-alt",
                        "ti-twitter",
                        "ti-twitter-alt",
                        "ti-linkedin",
                        "ti-pinterest",
                        "ti-pinterest-alt",
                        "ti-themify-logo",
                        "ti-themify-favicon",
                        "ti-themify-favicon-alt"
                    ]
                },

                {
                    "svgs": [
                        {
                            "name": "Brassiere.svg",
                            "url": "/assets/icons/duotone/Clothes/Brassiere.svg"
                        },
                        {
                            "name": "Briefcase.svg",
                            "url": "/assets/icons/duotone/Clothes/Briefcase.svg"
                        },
                        {
                            "name": "Cap.svg",
                            "url": "/assets/icons/duotone/Clothes/Cap.svg"
                        },
                        {
                            "name": "Crown.svg",
                            "url": "/assets/icons/duotone/Clothes/Crown.svg"
                        }, {"name": "Dress.svg", "url": "/assets/icons/duotone/Clothes/Dress.svg"}, {
                            "name": "Hanger.svg",
                            "url": "/assets/icons/duotone/Clothes/Hanger.svg"
                        }, {"name": "Hat.svg", "url": "/assets/icons/duotone/Clothes/Hat.svg"}, {
                            "name": "Panties.svg",
                            "url": "/assets/icons/duotone/Clothes/Panties.svg"
                        }, {"name": "Shirt.svg", "url": "/assets/icons/duotone/Clothes/Shirt.svg"}, {
                            "name": "Shoes.svg",
                            "url": "/assets/icons/duotone/Clothes/Shoes.svg"
                        }, {
                            "name": "Shorts.svg",
                            "url": "/assets/icons/duotone/Clothes/Shorts.svg"
                        }, {
                            "name": "Sneakers.svg",
                            "url": "/assets/icons/duotone/Clothes/Sneakers.svg"
                        }, {
                            "name": "Socks.svg",
                            "url": "/assets/icons/duotone/Clothes/Socks.svg"
                        }, {
                            "name": "Sun-glasses.svg",
                            "url": "/assets/icons/duotone/Clothes/Sun-glasses.svg"
                        }, {"name": "T-Shirt.svg", "url": "/assets/icons/duotone/Clothes/T-Shirt.svg"}, {
                            "name": "Tie.svg",
                            "url": "/assets/icons/duotone/Clothes/Tie.svg"
                        }], "title": "SVG Duotone Clothes"
                }, {
                    "svgs": [{
                        "name": "Backspace.svg",
                        "url": "/assets/icons/duotone/Code/Backspace.svg"
                    }, {"name": "CMD.svg", "url": "/assets/icons/duotone/Code/CMD.svg"}, {
                        "name": "Code.svg",
                        "url": "/assets/icons/duotone/Code/Code.svg"
                    }, {"name": "Commit.svg", "url": "/assets/icons/duotone/Code/Commit.svg"}, {
                        "name": "Compiling.svg",
                        "url": "/assets/icons/duotone/Code/Compiling.svg"
                    }, {
                        "name": "Control.svg",
                        "url": "/assets/icons/duotone/Code/Control.svg"
                    }, {
                        "name": "Done-circle.svg",
                        "url": "/assets/icons/duotone/Code/Done-circle.svg"
                    }, {
                        "name": "Error-circle.svg",
                        "url": "/assets/icons/duotone/Code/Error-circle.svg"
                    }, {"name": "Git1.svg", "url": "/assets/icons/duotone/Code/Git1.svg"}, {
                        "name": "Git2.svg",
                        "url": "/assets/icons/duotone/Code/Git2.svg"
                    }, {"name": "Git3.svg", "url": "/assets/icons/duotone/Code/Git3.svg"}, {
                        "name": "Git4.svg",
                        "url": "/assets/icons/duotone/Code/Git4.svg"
                    }, {
                        "name": "Github.svg",
                        "url": "/assets/icons/duotone/Code/Github.svg"
                    }, {
                        "name": "Info-circle.svg",
                        "url": "/assets/icons/duotone/Code/Info-circle.svg"
                    }, {
                        "name": "Left-circle.svg",
                        "url": "/assets/icons/duotone/Code/Left-circle.svg"
                    }, {
                        "name": "Loading.svg",
                        "url": "/assets/icons/duotone/Code/Loading.svg"
                    }, {
                        "name": "Lock-circle.svg",
                        "url": "/assets/icons/duotone/Code/Lock-circle.svg"
                    }, {
                        "name": "Lock-overturning.svg",
                        "url": "/assets/icons/duotone/Code/Lock-overturning.svg"
                    }, {"name": "Minus.svg", "url": "/assets/icons/duotone/Code/Minus.svg"}, {
                        "name": "Option.svg",
                        "url": "/assets/icons/duotone/Code/Option.svg"
                    }, {"name": "Plus.svg", "url": "/assets/icons/duotone/Code/Plus.svg"}, {
                        "name": "Puzzle.svg",
                        "url": "/assets/icons/duotone/Code/Puzzle.svg"
                    }, {
                        "name": "Question-circle.svg",
                        "url": "/assets/icons/duotone/Code/Question-circle.svg"
                    }, {
                        "name": "Right-circle.svg",
                        "url": "/assets/icons/duotone/Code/Right-circle.svg"
                    }, {
                        "name": "Settings4.svg",
                        "url": "/assets/icons/duotone/Code/Settings4.svg"
                    }, {"name": "Shift.svg", "url": "/assets/icons/duotone/Code/Shift.svg"}, {
                        "name": "Spy.svg",
                        "url": "/assets/icons/duotone/Code/Spy.svg"
                    }, {"name": "Stop.svg", "url": "/assets/icons/duotone/Code/Stop.svg"}, {
                        "name": "Terminal.svg",
                        "url": "/assets/icons/duotone/Code/Terminal.svg"
                    }, {
                        "name": "Thunder-circle.svg",
                        "url": "/assets/icons/duotone/Code/Thunder-circle.svg"
                    }, {
                        "name": "Time-schedule.svg",
                        "url": "/assets/icons/duotone/Code/Time-schedule.svg"
                    }, {
                        "name": "Warning-1-circle.svg",
                        "url": "/assets/icons/duotone/Code/Warning-1-circle.svg"
                    }, {"name": "Warning-2.svg", "url": "/assets/icons/duotone/Code/Warning-2.svg"}],
                    "title": "SVG Duotone Code"
                }, {
                    "svgs": [{
                        "name": "Active-call.svg",
                        "url": "/assets/icons/duotone/Communication/Active-call.svg"
                    }, {
                        "name": "Add-user.svg",
                        "url": "/assets/icons/duotone/Communication/Add-user.svg"
                    }, {
                        "name": "Address-card.svg",
                        "url": "/assets/icons/duotone/Communication/Address-card.svg"
                    }, {
                        "name": "Adress-book1.svg",
                        "url": "/assets/icons/duotone/Communication/Adress-book1.svg"
                    }, {
                        "name": "Adress-book2.svg",
                        "url": "/assets/icons/duotone/Communication/Adress-book2.svg"
                    }, {
                        "name": "Archive.svg",
                        "url": "/assets/icons/duotone/Communication/Archive.svg"
                    }, {
                        "name": "Call-1.svg",
                        "url": "/assets/icons/duotone/Communication/Call-1.svg"
                    }, {
                        "name": "Call.svg",
                        "url": "/assets/icons/duotone/Communication/Call.svg"
                    }, {
                        "name": "Chat-check.svg",
                        "url": "/assets/icons/duotone/Communication/Chat-check.svg"
                    }, {
                        "name": "Chat-error.svg",
                        "url": "/assets/icons/duotone/Communication/Chat-error.svg"
                    }, {
                        "name": "Chat-locked.svg",
                        "url": "/assets/icons/duotone/Communication/Chat-locked.svg"
                    }, {
                        "name": "Chat-smile.svg",
                        "url": "/assets/icons/duotone/Communication/Chat-smile.svg"
                    }, {
                        "name": "Chat.svg",
                        "url": "/assets/icons/duotone/Communication/Chat.svg"
                    }, {
                        "name": "Chat1.svg",
                        "url": "/assets/icons/duotone/Communication/Chat1.svg"
                    }, {
                        "name": "Chat2.svg",
                        "url": "/assets/icons/duotone/Communication/Chat2.svg"
                    }, {
                        "name": "Chat4.svg",
                        "url": "/assets/icons/duotone/Communication/Chat4.svg"
                    }, {
                        "name": "Chat5.svg",
                        "url": "/assets/icons/duotone/Communication/Chat5.svg"
                    }, {
                        "name": "Chat6.svg",
                        "url": "/assets/icons/duotone/Communication/Chat6.svg"
                    }, {
                        "name": "Clipboard-check.svg",
                        "url": "/assets/icons/duotone/Communication/Clipboard-check.svg"
                    }, {
                        "name": "Clipboard-list.svg",
                        "url": "/assets/icons/duotone/Communication/Clipboard-list.svg"
                    }, {
                        "name": "Contact1.svg",
                        "url": "/assets/icons/duotone/Communication/Contact1.svg"
                    }, {
                        "name": "Delete-user.svg",
                        "url": "/assets/icons/duotone/Communication/Delete-user.svg"
                    }, {
                        "name": "Dial-numbers.svg",
                        "url": "/assets/icons/duotone/Communication/Dial-numbers.svg"
                    }, {
                        "name": "Flag.svg",
                        "url": "/assets/icons/duotone/Communication/Flag.svg"
                    }, {
                        "name": "Forward.svg",
                        "url": "/assets/icons/duotone/Communication/Forward.svg"
                    }, {
                        "name": "Group-chat.svg",
                        "url": "/assets/icons/duotone/Communication/Group-chat.svg"
                    }, {
                        "name": "Group.svg",
                        "url": "/assets/icons/duotone/Communication/Group.svg"
                    }, {
                        "name": "Incoming-box.svg",
                        "url": "/assets/icons/duotone/Communication/Incoming-box.svg"
                    }, {
                        "name": "Incoming-call.svg",
                        "url": "/assets/icons/duotone/Communication/Incoming-call.svg"
                    }, {
                        "name": "Incoming-mail.svg",
                        "url": "/assets/icons/duotone/Communication/Incoming-mail.svg"
                    }, {
                        "name": "Mail-at.svg",
                        "url": "/assets/icons/duotone/Communication/Mail-at.svg"
                    }, {
                        "name": "Mail-attachment.svg",
                        "url": "/assets/icons/duotone/Communication/Mail-attachment.svg"
                    }, {
                        "name": "Mail-box.svg",
                        "url": "/assets/icons/duotone/Communication/Mail-box.svg"
                    }, {
                        "name": "Mail-error.svg",
                        "url": "/assets/icons/duotone/Communication/Mail-error.svg"
                    }, {
                        "name": "Mail-heart.svg",
                        "url": "/assets/icons/duotone/Communication/Mail-heart.svg"
                    }, {
                        "name": "Mail-locked.svg",
                        "url": "/assets/icons/duotone/Communication/Mail-locked.svg"
                    }, {
                        "name": "Mail-notification.svg",
                        "url": "/assets/icons/duotone/Communication/Mail-notification.svg"
                    }, {
                        "name": "Mail-opened.svg",
                        "url": "/assets/icons/duotone/Communication/Mail-opened.svg"
                    }, {
                        "name": "Mail-unocked.svg",
                        "url": "/assets/icons/duotone/Communication/Mail-unocked.svg"
                    }, {
                        "name": "Mail.svg",
                        "url": "/assets/icons/duotone/Communication/Mail.svg"
                    }, {
                        "name": "Missed-call.svg",
                        "url": "/assets/icons/duotone/Communication/Missed-call.svg"
                    }, {
                        "name": "More.svg",
                        "url": "/assets/icons/duotone/Communication/More.svg"
                    }, {
                        "name": "Outgoing-box.svg",
                        "url": "/assets/icons/duotone/Communication/Outgoing-box.svg"
                    }, {
                        "name": "Outgoing-call.svg",
                        "url": "/assets/icons/duotone/Communication/Outgoing-call.svg"
                    }, {
                        "name": "Outgoing-mail.svg",
                        "url": "/assets/icons/duotone/Communication/Outgoing-mail.svg"
                    }, {
                        "name": "RSS.svg",
                        "url": "/assets/icons/duotone/Communication/RSS.svg"
                    }, {
                        "name": "Readed-mail.svg",
                        "url": "/assets/icons/duotone/Communication/Readed-mail.svg"
                    }, {
                        "name": "Reply-all.svg",
                        "url": "/assets/icons/duotone/Communication/Reply-all.svg"
                    }, {
                        "name": "Reply.svg",
                        "url": "/assets/icons/duotone/Communication/Reply.svg"
                    }, {
                        "name": "Right.svg",
                        "url": "/assets/icons/duotone/Communication/Right.svg"
                    }, {
                        "name": "Safe-chat.svg",
                        "url": "/assets/icons/duotone/Communication/Safe-chat.svg"
                    }, {
                        "name": "Send.svg",
                        "url": "/assets/icons/duotone/Communication/Send.svg"
                    }, {
                        "name": "Sending mail.svg",
                        "url": "/assets/icons/duotone/Communication/Sending mail.svg"
                    }, {
                        "name": "Sending.svg",
                        "url": "/assets/icons/duotone/Communication/Sending.svg"
                    }, {
                        "name": "Share.svg",
                        "url": "/assets/icons/duotone/Communication/Share.svg"
                    }, {
                        "name": "Shield-thunder.svg",
                        "url": "/assets/icons/duotone/Communication/Shield-thunder.svg"
                    }, {
                        "name": "Shield-user.svg",
                        "url": "/assets/icons/duotone/Communication/Shield-user.svg"
                    }, {
                        "name": "Snoozed-mail.svg",
                        "url": "/assets/icons/duotone/Communication/Snoozed-mail.svg"
                    }, {
                        "name": "Spam.svg",
                        "url": "/assets/icons/duotone/Communication/Spam.svg"
                    }, {
                        "name": "Thumbtack.svg",
                        "url": "/assets/icons/duotone/Communication/Thumbtack.svg"
                    }, {
                        "name": "Urgent-mail.svg",
                        "url": "/assets/icons/duotone/Communication/Urgent-mail.svg"
                    }, {"name": "Write.svg", "url": "/assets/icons/duotone/Communication/Write.svg"}],
                    "title": "SVG Duotone Communication"
                }, {
                    "svgs": [{
                        "name": "Baking-glove.svg",
                        "url": "/assets/icons/duotone/Cooking/Baking-glove.svg"
                    }, {"name": "Bowl.svg", "url": "/assets/icons/duotone/Cooking/Bowl.svg"}, {
                        "name": "Chef.svg",
                        "url": "/assets/icons/duotone/Cooking/Chef.svg"
                    }, {
                        "name": "Cooking-book.svg",
                        "url": "/assets/icons/duotone/Cooking/Cooking-book.svg"
                    }, {
                        "name": "Cooking-pot.svg",
                        "url": "/assets/icons/duotone/Cooking/Cooking-pot.svg"
                    }, {
                        "name": "Cutting board.svg",
                        "url": "/assets/icons/duotone/Cooking/Cutting board.svg"
                    }, {"name": "Dinner.svg", "url": "/assets/icons/duotone/Cooking/Dinner.svg"}, {
                        "name": "Dish.svg",
                        "url": "/assets/icons/duotone/Cooking/Dish.svg"
                    }, {
                        "name": "Dishes.svg",
                        "url": "/assets/icons/duotone/Cooking/Dishes.svg"
                    }, {
                        "name": "Fork-spoon-knife.svg",
                        "url": "/assets/icons/duotone/Cooking/Fork-spoon-knife.svg"
                    }, {
                        "name": "Fork-spoon.svg",
                        "url": "/assets/icons/duotone/Cooking/Fork-spoon.svg"
                    }, {"name": "Fork.svg", "url": "/assets/icons/duotone/Cooking/Fork.svg"}, {
                        "name": "Frying-pan.svg",
                        "url": "/assets/icons/duotone/Cooking/Frying-pan.svg"
                    }, {
                        "name": "Grater.svg",
                        "url": "/assets/icons/duotone/Cooking/Grater.svg"
                    }, {
                        "name": "Kitchen-scale.svg",
                        "url": "/assets/icons/duotone/Cooking/Kitchen-scale.svg"
                    }, {"name": "Knife1.svg", "url": "/assets/icons/duotone/Cooking/Knife1.svg"}, {
                        "name": "Knife2.svg",
                        "url": "/assets/icons/duotone/Cooking/Knife2.svg"
                    }, {
                        "name": "KnifeAndFork1.svg",
                        "url": "/assets/icons/duotone/Cooking/KnifeAndFork1.svg"
                    }, {
                        "name": "KnifeAndFork2.svg",
                        "url": "/assets/icons/duotone/Cooking/KnifeAndFork2.svg"
                    }, {
                        "name": "Ladle.svg",
                        "url": "/assets/icons/duotone/Cooking/Ladle.svg"
                    }, {
                        "name": "Rolling-pin.svg",
                        "url": "/assets/icons/duotone/Cooking/Rolling-pin.svg"
                    }, {
                        "name": "Saucepan.svg",
                        "url": "/assets/icons/duotone/Cooking/Saucepan.svg"
                    }, {"name": "Shovel.svg", "url": "/assets/icons/duotone/Cooking/Shovel.svg"}, {
                        "name": "Sieve.svg",
                        "url": "/assets/icons/duotone/Cooking/Sieve.svg"
                    }, {"name": "Spoon.svg", "url": "/assets/icons/duotone/Cooking/Spoon.svg"}],
                    "title": "SVG Duotone Cooking"
                }, {
                    "svgs": [{
                        "name": "Adjust.svg",
                        "url": "/assets/icons/duotone/Design/Adjust.svg"
                    }, {
                        "name": "Anchor-center-down.svg",
                        "url": "/assets/icons/duotone/Design/Anchor-center-down.svg"
                    }, {
                        "name": "Anchor-center-up.svg",
                        "url": "/assets/icons/duotone/Design/Anchor-center-up.svg"
                    }, {
                        "name": "Anchor-center.svg",
                        "url": "/assets/icons/duotone/Design/Anchor-center.svg"
                    }, {
                        "name": "Anchor-left-down.svg",
                        "url": "/assets/icons/duotone/Design/Anchor-left-down.svg"
                    }, {
                        "name": "Anchor-left-up.svg",
                        "url": "/assets/icons/duotone/Design/Anchor-left-up.svg"
                    }, {
                        "name": "Anchor-left.svg",
                        "url": "/assets/icons/duotone/Design/Anchor-left.svg"
                    }, {
                        "name": "Anchor-right-down.svg",
                        "url": "/assets/icons/duotone/Design/Anchor-right-down.svg"
                    }, {
                        "name": "Anchor-right-up.svg",
                        "url": "/assets/icons/duotone/Design/Anchor-right-up.svg"
                    }, {
                        "name": "Anchor-right.svg",
                        "url": "/assets/icons/duotone/Design/Anchor-right.svg"
                    }, {
                        "name": "Arrows.svg",
                        "url": "/assets/icons/duotone/Design/Arrows.svg"
                    }, {
                        "name": "Bezier-curve.svg",
                        "url": "/assets/icons/duotone/Design/Bezier-curve.svg"
                    }, {"name": "Border.svg", "url": "/assets/icons/duotone/Design/Border.svg"}, {
                        "name": "Brush.svg",
                        "url": "/assets/icons/duotone/Design/Brush.svg"
                    }, {"name": "Bucket.svg", "url": "/assets/icons/duotone/Design/Bucket.svg"}, {
                        "name": "Cap-1.svg",
                        "url": "/assets/icons/duotone/Design/Cap-1.svg"
                    }, {"name": "Cap-2.svg", "url": "/assets/icons/duotone/Design/Cap-2.svg"}, {
                        "name": "Cap-3.svg",
                        "url": "/assets/icons/duotone/Design/Cap-3.svg"
                    }, {
                        "name": "Circle.svg",
                        "url": "/assets/icons/duotone/Design/Circle.svg"
                    }, {
                        "name": "Color-profile.svg",
                        "url": "/assets/icons/duotone/Design/Color-profile.svg"
                    }, {"name": "Color.svg", "url": "/assets/icons/duotone/Design/Color.svg"}, {
                        "name": "Component.svg",
                        "url": "/assets/icons/duotone/Design/Component.svg"
                    }, {"name": "Crop.svg", "url": "/assets/icons/duotone/Design/Crop.svg"}, {
                        "name": "Difference.svg",
                        "url": "/assets/icons/duotone/Design/Difference.svg"
                    }, {"name": "Edit.svg", "url": "/assets/icons/duotone/Design/Edit.svg"}, {
                        "name": "Eraser.svg",
                        "url": "/assets/icons/duotone/Design/Eraser.svg"
                    }, {
                        "name": "Flatten.svg",
                        "url": "/assets/icons/duotone/Design/Flatten.svg"
                    }, {
                        "name": "Flip-horizontal.svg",
                        "url": "/assets/icons/duotone/Design/Flip-horizontal.svg"
                    }, {
                        "name": "Flip-vertical.svg",
                        "url": "/assets/icons/duotone/Design/Flip-vertical.svg"
                    }, {
                        "name": "Horizontal.svg",
                        "url": "/assets/icons/duotone/Design/Horizontal.svg"
                    }, {
                        "name": "Image.svg",
                        "url": "/assets/icons/duotone/Design/Image.svg"
                    }, {
                        "name": "Interselect.svg",
                        "url": "/assets/icons/duotone/Design/Interselect.svg"
                    }, {"name": "Join-1.svg", "url": "/assets/icons/duotone/Design/Join-1.svg"}, {
                        "name": "Join-2.svg",
                        "url": "/assets/icons/duotone/Design/Join-2.svg"
                    }, {"name": "Join-3.svg", "url": "/assets/icons/duotone/Design/Join-3.svg"}, {
                        "name": "Layers.svg",
                        "url": "/assets/icons/duotone/Design/Layers.svg"
                    }, {"name": "Line.svg", "url": "/assets/icons/duotone/Design/Line.svg"}, {
                        "name": "Magic.svg",
                        "url": "/assets/icons/duotone/Design/Magic.svg"
                    }, {"name": "Mask.svg", "url": "/assets/icons/duotone/Design/Mask.svg"}, {
                        "name": "Patch.svg",
                        "url": "/assets/icons/duotone/Design/Patch.svg"
                    }, {
                        "name": "Pen-tool-vector.svg",
                        "url": "/assets/icons/duotone/Design/Pen-tool-vector.svg"
                    }, {
                        "name": "PenAndRuller.svg",
                        "url": "/assets/icons/duotone/Design/PenAndRuller.svg"
                    }, {"name": "Pencil.svg", "url": "/assets/icons/duotone/Design/Pencil.svg"}, {
                        "name": "Picker.svg",
                        "url": "/assets/icons/duotone/Design/Picker.svg"
                    }, {"name": "Pixels.svg", "url": "/assets/icons/duotone/Design/Pixels.svg"}, {
                        "name": "Polygon.svg",
                        "url": "/assets/icons/duotone/Design/Polygon.svg"
                    }, {
                        "name": "Position.svg",
                        "url": "/assets/icons/duotone/Design/Position.svg"
                    }, {
                        "name": "Rectangle.svg",
                        "url": "/assets/icons/duotone/Design/Rectangle.svg"
                    }, {
                        "name": "Saturation.svg",
                        "url": "/assets/icons/duotone/Design/Saturation.svg"
                    }, {"name": "Select.svg", "url": "/assets/icons/duotone/Design/Select.svg"}, {
                        "name": "Sketch.svg",
                        "url": "/assets/icons/duotone/Design/Sketch.svg"
                    }, {"name": "Stamp.svg", "url": "/assets/icons/duotone/Design/Stamp.svg"}, {
                        "name": "Substract.svg",
                        "url": "/assets/icons/duotone/Design/Substract.svg"
                    }, {
                        "name": "Target.svg",
                        "url": "/assets/icons/duotone/Design/Target.svg"
                    }, {
                        "name": "Triangle.svg",
                        "url": "/assets/icons/duotone/Design/Triangle.svg"
                    }, {"name": "Union.svg", "url": "/assets/icons/duotone/Design/Union.svg"}, {
                        "name": "Verified.svg",
                        "url": "/assets/icons/duotone/Design/Verified.svg"
                    }, {
                        "name": "Vertical.svg",
                        "url": "/assets/icons/duotone/Design/Vertical.svg"
                    }, {
                        "name": "ZoomMinus.svg",
                        "url": "/assets/icons/duotone/Design/ZoomMinus.svg"
                    }, {"name": "ZoomPlus.svg", "url": "/assets/icons/duotone/Design/ZoomPlus.svg"}],
                    "title": "SVG Duotone Design"
                }, {
                    "svgs": [{
                        "name": "Airpods.svg",
                        "url": "/assets/icons/duotone/Devices/Airpods.svg"
                    }, {
                        "name": "Android.svg",
                        "url": "/assets/icons/duotone/Devices/Android.svg"
                    }, {
                        "name": "Apple-Watch.svg",
                        "url": "/assets/icons/duotone/Devices/Apple-Watch.svg"
                    }, {
                        "name": "Battery-charging.svg",
                        "url": "/assets/icons/duotone/Devices/Battery-charging.svg"
                    }, {
                        "name": "Battery-empty.svg",
                        "url": "/assets/icons/duotone/Devices/Battery-empty.svg"
                    }, {
                        "name": "Battery-full.svg",
                        "url": "/assets/icons/duotone/Devices/Battery-full.svg"
                    }, {
                        "name": "Battery-half.svg",
                        "url": "/assets/icons/duotone/Devices/Battery-half.svg"
                    }, {
                        "name": "Bluetooth.svg",
                        "url": "/assets/icons/duotone/Devices/Bluetooth.svg"
                    }, {"name": "CPU1.svg", "url": "/assets/icons/duotone/Devices/CPU1.svg"}, {
                        "name": "CPU2.svg",
                        "url": "/assets/icons/duotone/Devices/CPU2.svg"
                    }, {
                        "name": "Camera.svg",
                        "url": "/assets/icons/duotone/Devices/Camera.svg"
                    }, {
                        "name": "Cardboard-vr.svg",
                        "url": "/assets/icons/duotone/Devices/Cardboard-vr.svg"
                    }, {
                        "name": "Cassete.svg",
                        "url": "/assets/icons/duotone/Devices/Cassete.svg"
                    }, {
                        "name": "Diagnostics.svg",
                        "url": "/assets/icons/duotone/Devices/Diagnostics.svg"
                    }, {
                        "name": "Display1.svg",
                        "url": "/assets/icons/duotone/Devices/Display1.svg"
                    }, {
                        "name": "Display2.svg",
                        "url": "/assets/icons/duotone/Devices/Display2.svg"
                    }, {
                        "name": "Display3.svg",
                        "url": "/assets/icons/duotone/Devices/Display3.svg"
                    }, {
                        "name": "Gameboy.svg",
                        "url": "/assets/icons/duotone/Devices/Gameboy.svg"
                    }, {
                        "name": "Gamepad1.svg",
                        "url": "/assets/icons/duotone/Devices/Gamepad1.svg"
                    }, {
                        "name": "Gamepad2.svg",
                        "url": "/assets/icons/duotone/Devices/Gamepad2.svg"
                    }, {
                        "name": "Generator.svg",
                        "url": "/assets/icons/duotone/Devices/Generator.svg"
                    }, {
                        "name": "Hard-drive.svg",
                        "url": "/assets/icons/duotone/Devices/Hard-drive.svg"
                    }, {
                        "name": "Headphones.svg",
                        "url": "/assets/icons/duotone/Devices/Headphones.svg"
                    }, {
                        "name": "Homepod.svg",
                        "url": "/assets/icons/duotone/Devices/Homepod.svg"
                    }, {
                        "name": "Keyboard.svg",
                        "url": "/assets/icons/duotone/Devices/Keyboard.svg"
                    }, {"name": "LTE1.svg", "url": "/assets/icons/duotone/Devices/LTE1.svg"}, {
                        "name": "LTE2.svg",
                        "url": "/assets/icons/duotone/Devices/LTE2.svg"
                    }, {
                        "name": "Laptop-macbook.svg",
                        "url": "/assets/icons/duotone/Devices/Laptop-macbook.svg"
                    }, {"name": "Laptop.svg", "url": "/assets/icons/duotone/Devices/Laptop.svg"}, {
                        "name": "Mic.svg",
                        "url": "/assets/icons/duotone/Devices/Mic.svg"
                    }, {"name": "Midi.svg", "url": "/assets/icons/duotone/Devices/Midi.svg"}, {
                        "name": "Mouse.svg",
                        "url": "/assets/icons/duotone/Devices/Mouse.svg"
                    }, {"name": "Phone.svg", "url": "/assets/icons/duotone/Devices/Phone.svg"}, {
                        "name": "Printer.svg",
                        "url": "/assets/icons/duotone/Devices/Printer.svg"
                    }, {"name": "Radio.svg", "url": "/assets/icons/duotone/Devices/Radio.svg"}, {
                        "name": "Router1.svg",
                        "url": "/assets/icons/duotone/Devices/Router1.svg"
                    }, {
                        "name": "Router2.svg",
                        "url": "/assets/icons/duotone/Devices/Router2.svg"
                    }, {
                        "name": "SD-card.svg",
                        "url": "/assets/icons/duotone/Devices/SD-card.svg"
                    }, {
                        "name": "Server.svg",
                        "url": "/assets/icons/duotone/Devices/Server.svg"
                    }, {"name": "Speaker.svg", "url": "/assets/icons/duotone/Devices/Speaker.svg"}, {
                        "name": "TV1.svg",
                        "url": "/assets/icons/duotone/Devices/TV1.svg"
                    }, {"name": "TV2.svg", "url": "/assets/icons/duotone/Devices/TV2.svg"}, {
                        "name": "Tablet.svg",
                        "url": "/assets/icons/duotone/Devices/Tablet.svg"
                    }, {"name": "USB.svg", "url": "/assets/icons/duotone/Devices/USB.svg"}, {
                        "name": "Usb-storage.svg",
                        "url": "/assets/icons/duotone/Devices/Usb-storage.svg"
                    }, {
                        "name": "Video-camera.svg",
                        "url": "/assets/icons/duotone/Devices/Video-camera.svg"
                    }, {"name": "Watch1.svg", "url": "/assets/icons/duotone/Devices/Watch1.svg"}, {
                        "name": "Watch2.svg",
                        "url": "/assets/icons/duotone/Devices/Watch2.svg"
                    }, {"name": "Wi-fi.svg", "url": "/assets/icons/duotone/Devices/Wi-fi.svg"}, {
                        "name": "iMac.svg",
                        "url": "/assets/icons/duotone/Devices/iMac.svg"
                    }, {
                        "name": "iPhone-X.svg",
                        "url": "/assets/icons/duotone/Devices/iPhone-X.svg"
                    }, {
                        "name": "iPhone-back.svg",
                        "url": "/assets/icons/duotone/Devices/iPhone-back.svg"
                    }, {"name": "iPhone-x-back.svg", "url": "/assets/icons/duotone/Devices/iPhone-x-back.svg"}],
                    "title": "SVG Duotone Devices"
                }, {
                    "svgs": [{
                        "name": "Air-conditioning.svg",
                        "url": "/assets/icons/duotone/Electric/Air-conditioning.svg"
                    }, {"name": "Blender.svg", "url": "/assets/icons/duotone/Electric/Blender.svg"}, {
                        "name": "Fan.svg",
                        "url": "/assets/icons/duotone/Electric/Fan.svg"
                    }, {
                        "name": "Fridge.svg",
                        "url": "/assets/icons/duotone/Electric/Fridge.svg"
                    }, {
                        "name": "Gas-stove.svg",
                        "url": "/assets/icons/duotone/Electric/Gas-stove.svg"
                    }, {
                        "name": "Highvoltage.svg",
                        "url": "/assets/icons/duotone/Electric/Highvoltage.svg"
                    }, {"name": "Iron.svg", "url": "/assets/icons/duotone/Electric/Iron.svg"}, {
                        "name": "Kettle.svg",
                        "url": "/assets/icons/duotone/Electric/Kettle.svg"
                    }, {"name": "Mixer.svg", "url": "/assets/icons/duotone/Electric/Mixer.svg"}, {
                        "name": "Outlet.svg",
                        "url": "/assets/icons/duotone/Electric/Outlet.svg"
                    }, {
                        "name": "Range-hood.svg",
                        "url": "/assets/icons/duotone/Electric/Range-hood.svg"
                    }, {
                        "name": "Shutdown.svg",
                        "url": "/assets/icons/duotone/Electric/Shutdown.svg"
                    }, {
                        "name": "Socket-eu.svg",
                        "url": "/assets/icons/duotone/Electric/Socket-eu.svg"
                    }, {
                        "name": "Socket-us.svg",
                        "url": "/assets/icons/duotone/Electric/Socket-us.svg"
                    }, {
                        "name": "Washer.svg",
                        "url": "/assets/icons/duotone/Electric/Washer.svg"
                    }, {"name": "air-dryer.svg", "url": "/assets/icons/duotone/Electric/air-dryer.svg"}],
                    "title": "SVG Duotone Electric"
                }, {
                    "svgs": [{
                        "name": "Cloud-download.svg",
                        "url": "/assets/icons/duotone/Files/Cloud-download.svg"
                    }, {
                        "name": "Cloud-upload.svg",
                        "url": "/assets/icons/duotone/Files/Cloud-upload.svg"
                    }, {
                        "name": "Compilation.svg",
                        "url": "/assets/icons/duotone/Files/Compilation.svg"
                    }, {
                        "name": "Compiled-file.svg",
                        "url": "/assets/icons/duotone/Files/Compiled-file.svg"
                    }, {
                        "name": "Deleted-file.svg",
                        "url": "/assets/icons/duotone/Files/Deleted-file.svg"
                    }, {
                        "name": "Deleted-folder.svg",
                        "url": "/assets/icons/duotone/Files/Deleted-folder.svg"
                    }, {
                        "name": "Download.svg",
                        "url": "/assets/icons/duotone/Files/Download.svg"
                    }, {
                        "name": "DownloadedFile.svg",
                        "url": "/assets/icons/duotone/Files/DownloadedFile.svg"
                    }, {
                        "name": "Downloads-folder.svg",
                        "url": "/assets/icons/duotone/Files/Downloads-folder.svg"
                    }, {
                        "name": "Export.svg",
                        "url": "/assets/icons/duotone/Files/Export.svg"
                    }, {
                        "name": "File-Minus.svg",
                        "url": "/assets/icons/duotone/Files/File-Minus.svg"
                    }, {
                        "name": "File-Plus.svg",
                        "url": "/assets/icons/duotone/Files/File-Plus.svg"
                    }, {
                        "name": "File-cloud.svg",
                        "url": "/assets/icons/duotone/Files/File-cloud.svg"
                    }, {
                        "name": "File-done.svg",
                        "url": "/assets/icons/duotone/Files/File-done.svg"
                    }, {"name": "File.svg", "url": "/assets/icons/duotone/Files/File.svg"}, {
                        "name": "Folder-check.svg",
                        "url": "/assets/icons/duotone/Files/Folder-check.svg"
                    }, {
                        "name": "Folder-cloud.svg",
                        "url": "/assets/icons/duotone/Files/Folder-cloud.svg"
                    }, {
                        "name": "Folder-error.svg",
                        "url": "/assets/icons/duotone/Files/Folder-error.svg"
                    }, {
                        "name": "Folder-heart.svg",
                        "url": "/assets/icons/duotone/Files/Folder-heart.svg"
                    }, {
                        "name": "Folder-minus.svg",
                        "url": "/assets/icons/duotone/Files/Folder-minus.svg"
                    }, {
                        "name": "Folder-plus.svg",
                        "url": "/assets/icons/duotone/Files/Folder-plus.svg"
                    }, {
                        "name": "Folder-solid.svg",
                        "url": "/assets/icons/duotone/Files/Folder-solid.svg"
                    }, {
                        "name": "Folder-star.svg",
                        "url": "/assets/icons/duotone/Files/Folder-star.svg"
                    }, {
                        "name": "Folder-thunder.svg",
                        "url": "/assets/icons/duotone/Files/Folder-thunder.svg"
                    }, {
                        "name": "Folder.svg",
                        "url": "/assets/icons/duotone/Files/Folder.svg"
                    }, {
                        "name": "Group-folders.svg",
                        "url": "/assets/icons/duotone/Files/Group-folders.svg"
                    }, {
                        "name": "Import.svg",
                        "url": "/assets/icons/duotone/Files/Import.svg"
                    }, {
                        "name": "Locked-folder.svg",
                        "url": "/assets/icons/duotone/Files/Locked-folder.svg"
                    }, {
                        "name": "Media-folder.svg",
                        "url": "/assets/icons/duotone/Files/Media-folder.svg"
                    }, {"name": "Media.svg", "url": "/assets/icons/duotone/Files/Media.svg"}, {
                        "name": "Music.svg",
                        "url": "/assets/icons/duotone/Files/Music.svg"
                    }, {
                        "name": "Pictures1.svg",
                        "url": "/assets/icons/duotone/Files/Pictures1.svg"
                    }, {
                        "name": "Pictures2.svg",
                        "url": "/assets/icons/duotone/Files/Pictures2.svg"
                    }, {
                        "name": "Protected-file.svg",
                        "url": "/assets/icons/duotone/Files/Protected-file.svg"
                    }, {
                        "name": "Selected-file.svg",
                        "url": "/assets/icons/duotone/Files/Selected-file.svg"
                    }, {
                        "name": "Upload-folder.svg",
                        "url": "/assets/icons/duotone/Files/Upload-folder.svg"
                    }, {
                        "name": "Upload.svg",
                        "url": "/assets/icons/duotone/Files/Upload.svg"
                    }, {
                        "name": "Uploaded-file.svg",
                        "url": "/assets/icons/duotone/Files/Uploaded-file.svg"
                    }, {"name": "User-folder.svg", "url": "/assets/icons/duotone/Files/User-folder.svg"}],
                    "title": "SVG Duotone Files"
                }, {
                    "svgs": [{"name": "Beer.svg", "url": "/assets/icons/duotone/Food/Beer.svg"}, {
                        "name": "Bottle1.svg",
                        "url": "/assets/icons/duotone/Food/Bottle1.svg"
                    }, {"name": "Bottle2.svg", "url": "/assets/icons/duotone/Food/Bottle2.svg"}, {
                        "name": "Bread.svg",
                        "url": "/assets/icons/duotone/Food/Bread.svg"
                    }, {"name": "Bucket.svg", "url": "/assets/icons/duotone/Food/Bucket.svg"}, {
                        "name": "Burger.svg",
                        "url": "/assets/icons/duotone/Food/Burger.svg"
                    }, {"name": "Cake.svg", "url": "/assets/icons/duotone/Food/Cake.svg"}, {
                        "name": "Carrot.svg",
                        "url": "/assets/icons/duotone/Food/Carrot.svg"
                    }, {"name": "Cheese.svg", "url": "/assets/icons/duotone/Food/Cheese.svg"}, {
                        "name": "Chicken.svg",
                        "url": "/assets/icons/duotone/Food/Chicken.svg"
                    }, {"name": "Coffee1.svg", "url": "/assets/icons/duotone/Food/Coffee1.svg"}, {
                        "name": "Coffee2.svg",
                        "url": "/assets/icons/duotone/Food/Coffee2.svg"
                    }, {"name": "Cookie.svg", "url": "/assets/icons/duotone/Food/Cookie.svg"}, {
                        "name": "Dinner.svg",
                        "url": "/assets/icons/duotone/Food/Dinner.svg"
                    }, {"name": "Fish.svg", "url": "/assets/icons/duotone/Food/Fish.svg"}, {
                        "name": "French Bread.svg",
                        "url": "/assets/icons/duotone/Food/French Bread.svg"
                    }, {
                        "name": "Glass-martini.svg",
                        "url": "/assets/icons/duotone/Food/Glass-martini.svg"
                    }, {
                        "name": "Ice-cream1.svg",
                        "url": "/assets/icons/duotone/Food/Ice-cream1.svg"
                    }, {
                        "name": "Ice-cream2.svg",
                        "url": "/assets/icons/duotone/Food/Ice-cream2.svg"
                    }, {
                        "name": "Miso-soup.svg",
                        "url": "/assets/icons/duotone/Food/Miso-soup.svg"
                    }, {"name": "Orange.svg", "url": "/assets/icons/duotone/Food/Orange.svg"}, {
                        "name": "Pizza.svg",
                        "url": "/assets/icons/duotone/Food/Pizza.svg"
                    }, {"name": "Sushi.svg", "url": "/assets/icons/duotone/Food/Sushi.svg"}, {
                        "name": "Two-bottles.svg",
                        "url": "/assets/icons/duotone/Food/Two-bottles.svg"
                    }, {"name": "Wine.svg", "url": "/assets/icons/duotone/Food/Wine.svg"}], "title": "SVG Duotone Food"
                }, {
                    "svgs": [{
                        "name": "Attachment1.svg",
                        "url": "/assets/icons/duotone/General/Attachment1.svg"
                    }, {
                        "name": "Attachment2.svg",
                        "url": "/assets/icons/duotone/General/Attachment2.svg"
                    }, {"name": "Bank.svg", "url": "/assets/icons/duotone/General/Bank.svg"}, {
                        "name": "Binocular.svg",
                        "url": "/assets/icons/duotone/General/Binocular.svg"
                    }, {
                        "name": "Bookmark.svg",
                        "url": "/assets/icons/duotone/General/Bookmark.svg"
                    }, {"name": "Clip.svg", "url": "/assets/icons/duotone/General/Clip.svg"}, {
                        "name": "Clipboard.svg",
                        "url": "/assets/icons/duotone/General/Clipboard.svg"
                    }, {"name": "Copy.svg", "url": "/assets/icons/duotone/General/Copy.svg"}, {
                        "name": "Cursor.svg",
                        "url": "/assets/icons/duotone/General/Cursor.svg"
                    }, {
                        "name": "Dislike.svg",
                        "url": "/assets/icons/duotone/General/Dislike.svg"
                    }, {
                        "name": "Duplicate.svg",
                        "url": "/assets/icons/duotone/General/Duplicate.svg"
                    }, {
                        "name": "Edit.svg",
                        "url": "/assets/icons/duotone/General/Edit.svg"
                    }, {
                        "name": "Expand-arrows.svg",
                        "url": "/assets/icons/duotone/General/Expand-arrows.svg"
                    }, {"name": "Fire.svg", "url": "/assets/icons/duotone/General/Fire.svg"}, {
                        "name": "Folder.svg",
                        "url": "/assets/icons/duotone/General/Folder.svg"
                    }, {
                        "name": "Half-heart.svg",
                        "url": "/assets/icons/duotone/General/Half-heart.svg"
                    }, {
                        "name": "Half-star.svg",
                        "url": "/assets/icons/duotone/General/Half-star.svg"
                    }, {"name": "Heart.svg", "url": "/assets/icons/duotone/General/Heart.svg"}, {
                        "name": "Hidden.svg",
                        "url": "/assets/icons/duotone/General/Hidden.svg"
                    }, {"name": "Like.svg", "url": "/assets/icons/duotone/General/Like.svg"}, {
                        "name": "Lock.svg",
                        "url": "/assets/icons/duotone/General/Lock.svg"
                    }, {
                        "name": "Notification2.svg",
                        "url": "/assets/icons/duotone/General/Notification2.svg"
                    }, {
                        "name": "Notifications1.svg",
                        "url": "/assets/icons/duotone/General/Notifications1.svg"
                    }, {"name": "Other1.svg", "url": "/assets/icons/duotone/General/Other1.svg"}, {
                        "name": "Other2.svg",
                        "url": "/assets/icons/duotone/General/Other2.svg"
                    }, {"name": "Sad.svg", "url": "/assets/icons/duotone/General/Sad.svg"}, {
                        "name": "Save.svg",
                        "url": "/assets/icons/duotone/General/Save.svg"
                    }, {"name": "Scale.svg", "url": "/assets/icons/duotone/General/Scale.svg"}, {
                        "name": "Scissors.svg",
                        "url": "/assets/icons/duotone/General/Scissors.svg"
                    }, {
                        "name": "Search.svg",
                        "url": "/assets/icons/duotone/General/Search.svg"
                    }, {
                        "name": "Settings-1.svg",
                        "url": "/assets/icons/duotone/General/Settings-1.svg"
                    }, {
                        "name": "Settings-2.svg",
                        "url": "/assets/icons/duotone/General/Settings-2.svg"
                    }, {
                        "name": "Settings-3.svg",
                        "url": "/assets/icons/duotone/General/Settings-3.svg"
                    }, {
                        "name": "Shield-check.svg",
                        "url": "/assets/icons/duotone/General/Shield-check.svg"
                    }, {
                        "name": "Shield-disabled.svg",
                        "url": "/assets/icons/duotone/General/Shield-disabled.svg"
                    }, {
                        "name": "Shield-protected.svg",
                        "url": "/assets/icons/duotone/General/Shield-protected.svg"
                    }, {"name": "Size.svg", "url": "/assets/icons/duotone/General/Size.svg"}, {
                        "name": "Smile.svg",
                        "url": "/assets/icons/duotone/General/Smile.svg"
                    }, {
                        "name": "Star.svg",
                        "url": "/assets/icons/duotone/General/Star.svg"
                    }, {
                        "name": "Thunder-move.svg",
                        "url": "/assets/icons/duotone/General/Thunder-move.svg"
                    }, {
                        "name": "Thunder.svg",
                        "url": "/assets/icons/duotone/General/Thunder.svg"
                    }, {"name": "Trash.svg", "url": "/assets/icons/duotone/General/Trash.svg"}, {
                        "name": "Unlock.svg",
                        "url": "/assets/icons/duotone/General/Unlock.svg"
                    }, {"name": "Update.svg", "url": "/assets/icons/duotone/General/Update.svg"}, {
                        "name": "User.svg",
                        "url": "/assets/icons/duotone/General/User.svg"
                    }, {"name": "Visible.svg", "url": "/assets/icons/duotone/General/Visible.svg"}],
                    "title": "SVG Duotone General"
                }, {
                    "svgs": [{
                        "name": "Air-ballon.svg",
                        "url": "/assets/icons/duotone/Home/Air-ballon.svg"
                    }, {
                        "name": "Alarm-clock.svg",
                        "url": "/assets/icons/duotone/Home/Alarm-clock.svg"
                    }, {
                        "name": "Armchair.svg",
                        "url": "/assets/icons/duotone/Home/Armchair.svg"
                    }, {
                        "name": "Bag-chair.svg",
                        "url": "/assets/icons/duotone/Home/Bag-chair.svg"
                    }, {"name": "Bath.svg", "url": "/assets/icons/duotone/Home/Bath.svg"}, {
                        "name": "Bed.svg",
                        "url": "/assets/icons/duotone/Home/Bed.svg"
                    }, {
                        "name": "Book-open.svg",
                        "url": "/assets/icons/duotone/Home/Book-open.svg"
                    }, {"name": "Book.svg", "url": "/assets/icons/duotone/Home/Book.svg"}, {
                        "name": "Box.svg",
                        "url": "/assets/icons/duotone/Home/Box.svg"
                    }, {"name": "Broom.svg", "url": "/assets/icons/duotone/Home/Broom.svg"}, {
                        "name": "Building.svg",
                        "url": "/assets/icons/duotone/Home/Building.svg"
                    }, {"name": "Bulb1.svg", "url": "/assets/icons/duotone/Home/Bulb1.svg"}, {
                        "name": "Bulb2.svg",
                        "url": "/assets/icons/duotone/Home/Bulb2.svg"
                    }, {"name": "Chair1.svg", "url": "/assets/icons/duotone/Home/Chair1.svg"}, {
                        "name": "Chair2.svg",
                        "url": "/assets/icons/duotone/Home/Chair2.svg"
                    }, {"name": "Clock.svg", "url": "/assets/icons/duotone/Home/Clock.svg"}, {
                        "name": "Commode1.svg",
                        "url": "/assets/icons/duotone/Home/Commode1.svg"
                    }, {"name": "Commode2.svg", "url": "/assets/icons/duotone/Home/Commode2.svg"}, {
                        "name": "Couch.svg",
                        "url": "/assets/icons/duotone/Home/Couch.svg"
                    }, {
                        "name": "Cupboard.svg",
                        "url": "/assets/icons/duotone/Home/Cupboard.svg"
                    }, {"name": "Curtains.svg", "url": "/assets/icons/duotone/Home/Curtains.svg"}, {
                        "name": "Deer.svg",
                        "url": "/assets/icons/duotone/Home/Deer.svg"
                    }, {
                        "name": "Door-open.svg",
                        "url": "/assets/icons/duotone/Home/Door-open.svg"
                    }, {"name": "Earth.svg", "url": "/assets/icons/duotone/Home/Earth.svg"}, {
                        "name": "Fireplace.svg",
                        "url": "/assets/icons/duotone/Home/Fireplace.svg"
                    }, {
                        "name": "Flashlight.svg",
                        "url": "/assets/icons/duotone/Home/Flashlight.svg"
                    }, {"name": "Flower1.svg", "url": "/assets/icons/duotone/Home/Flower1.svg"}, {
                        "name": "Flower2.svg",
                        "url": "/assets/icons/duotone/Home/Flower2.svg"
                    }, {"name": "Flower3.svg", "url": "/assets/icons/duotone/Home/Flower3.svg"}, {
                        "name": "Globe.svg",
                        "url": "/assets/icons/duotone/Home/Globe.svg"
                    }, {
                        "name": "Home-heart.svg",
                        "url": "/assets/icons/duotone/Home/Home-heart.svg"
                    }, {"name": "Home.svg", "url": "/assets/icons/duotone/Home/Home.svg"}, {
                        "name": "Home2.svg",
                        "url": "/assets/icons/duotone/Home/Home2.svg"
                    }, {"name": "Key.svg", "url": "/assets/icons/duotone/Home/Key.svg"}, {
                        "name": "Ladder.svg",
                        "url": "/assets/icons/duotone/Home/Ladder.svg"
                    }, {"name": "Lamp1.svg", "url": "/assets/icons/duotone/Home/Lamp1.svg"}, {
                        "name": "Lamp2.svg",
                        "url": "/assets/icons/duotone/Home/Lamp2.svg"
                    }, {"name": "Library.svg", "url": "/assets/icons/duotone/Home/Library.svg"}, {
                        "name": "Mailbox.svg",
                        "url": "/assets/icons/duotone/Home/Mailbox.svg"
                    }, {"name": "Mirror.svg", "url": "/assets/icons/duotone/Home/Mirror.svg"}, {
                        "name": "Picture.svg",
                        "url": "/assets/icons/duotone/Home/Picture.svg"
                    }, {"name": "Ruller.svg", "url": "/assets/icons/duotone/Home/Ruller.svg"}, {
                        "name": "Stairs.svg",
                        "url": "/assets/icons/duotone/Home/Stairs.svg"
                    }, {"name": "Timer.svg", "url": "/assets/icons/duotone/Home/Timer.svg"}, {
                        "name": "Toilet.svg",
                        "url": "/assets/icons/duotone/Home/Toilet.svg"
                    }, {"name": "Towel.svg", "url": "/assets/icons/duotone/Home/Towel.svg"}, {
                        "name": "Trash.svg",
                        "url": "/assets/icons/duotone/Home/Trash.svg"
                    }, {
                        "name": "Water-mixer.svg",
                        "url": "/assets/icons/duotone/Home/Water-mixer.svg"
                    }, {"name": "Weight1.svg", "url": "/assets/icons/duotone/Home/Weight1.svg"}, {
                        "name": "Weight2.svg",
                        "url": "/assets/icons/duotone/Home/Weight2.svg"
                    }, {
                        "name": "Wood-horse.svg",
                        "url": "/assets/icons/duotone/Home/Wood-horse.svg"
                    }, {"name": "Wood1.svg", "url": "/assets/icons/duotone/Home/Wood1.svg"}, {
                        "name": "Wood2.svg",
                        "url": "/assets/icons/duotone/Home/Wood2.svg"
                    }], "title": "SVG Duotone Home"
                }, {
                    "svgs": [{
                        "name": "Bank.svg",
                        "url": "/assets/icons/duotone/Interface/Bank.svg"
                    }, {
                        "name": "Briefcase.svg",
                        "url": "/assets/icons/duotone/Interface/Briefcase.svg"
                    }, {
                        "name": "Calendar.svg",
                        "url": "/assets/icons/duotone/Interface/Calendar.svg"
                    }, {
                        "name": "Close-Square.svg",
                        "url": "/assets/icons/duotone/Interface/Close-Square.svg"
                    }, {"name": "Cog.svg", "url": "/assets/icons/duotone/Interface/Cog.svg"}, {
                        "name": "Comment.svg",
                        "url": "/assets/icons/duotone/Interface/Comment.svg"
                    }, {
                        "name": "Doughnut.svg",
                        "url": "/assets/icons/duotone/Interface/Doughnut.svg"
                    }, {"name": "Edit.svg", "url": "/assets/icons/duotone/Interface/Edit.svg"}, {
                        "name": "Envelope.svg",
                        "url": "/assets/icons/duotone/Interface/Envelope.svg"
                    }, {
                        "name": "File-Plus.svg",
                        "url": "/assets/icons/duotone/Interface/File-Plus.svg"
                    }, {
                        "name": "File-Search.svg",
                        "url": "/assets/icons/duotone/Interface/File-Search.svg"
                    }, {
                        "name": "File-Upload.svg",
                        "url": "/assets/icons/duotone/Interface/File-Upload.svg"
                    }, {"name": "File.svg", "url": "/assets/icons/duotone/Interface/File.svg"}, {
                        "name": "Folder.svg",
                        "url": "/assets/icons/duotone/Interface/Folder.svg"
                    }, {
                        "name": "Grid-Horizontal.svg",
                        "url": "/assets/icons/duotone/Interface/Grid-Horizontal.svg"
                    }, {
                        "name": "Grid-Vetical.svg",
                        "url": "/assets/icons/duotone/Interface/Grid-Vetical.svg"
                    }, {"name": "Grid.svg", "url": "/assets/icons/duotone/Interface/Grid.svg"}, {
                        "name": "Image.svg",
                        "url": "/assets/icons/duotone/Interface/Image.svg"
                    }, {
                        "name": "Insert.svg",
                        "url": "/assets/icons/duotone/Interface/Insert.svg"
                    }, {
                        "name": "Line-03-Down.svg",
                        "url": "/assets/icons/duotone/Interface/Line-03-Down.svg"
                    }, {
                        "name": "Line-03-Up.svg",
                        "url": "/assets/icons/duotone/Interface/Line-03-Up.svg"
                    }, {
                        "name": "Lock.svg",
                        "url": "/assets/icons/duotone/Interface/Lock.svg"
                    }, {
                        "name": "Map-Marker.svg",
                        "url": "/assets/icons/duotone/Interface/Map-Marker.svg"
                    }, {
                        "name": "Minus-Square.svg",
                        "url": "/assets/icons/duotone/Interface/Minus-Square.svg"
                    }, {
                        "name": "Monitor.svg",
                        "url": "/assets/icons/duotone/Interface/Monitor.svg"
                    }, {
                        "name": "Options-Square.svg",
                        "url": "/assets/icons/duotone/Interface/Options-Square.svg"
                    }, {"name": "Phone.svg", "url": "/assets/icons/duotone/Interface/Phone.svg"}, {
                        "name": "Pie-04.svg",
                        "url": "/assets/icons/duotone/Interface/Pie-04.svg"
                    }, {
                        "name": "Plus-Square.svg",
                        "url": "/assets/icons/duotone/Interface/Plus-Square.svg"
                    }, {
                        "name": "Scatter-Up.svg",
                        "url": "/assets/icons/duotone/Interface/Scatter-Up.svg"
                    }, {
                        "name": "Settings-02.svg",
                        "url": "/assets/icons/duotone/Interface/Settings-02.svg"
                    }, {
                        "name": "Sign-Out.svg",
                        "url": "/assets/icons/duotone/Interface/Sign-Out.svg"
                    }, {
                        "name": "Stacked-Area-Down.svg",
                        "url": "/assets/icons/duotone/Interface/Stacked-Area-Down.svg"
                    }, {"name": "User.svg", "url": "/assets/icons/duotone/Interface/User.svg"}],
                    "title": "SVG Duotone Interface"
                }, {
                    "svgs": [{
                        "name": "Layout-3d.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-3d.svg"
                    }, {
                        "name": "Layout-4-blocks-2.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-4-blocks-2.svg"
                    }, {
                        "name": "Layout-4-blocks.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-4-blocks.svg"
                    }, {
                        "name": "Layout-arrange.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-arrange.svg"
                    }, {
                        "name": "Layout-grid.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-grid.svg"
                    }, {
                        "name": "Layout-horizontal.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-horizontal.svg"
                    }, {
                        "name": "Layout-left-panel-1.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-left-panel-1.svg"
                    }, {
                        "name": "Layout-left-panel-2.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-left-panel-2.svg"
                    }, {
                        "name": "Layout-octagon.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-octagon.svg"
                    }, {
                        "name": "Layout-polygon.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-polygon.svg"
                    }, {
                        "name": "Layout-right-panel-1.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-right-panel-1.svg"
                    }, {
                        "name": "Layout-right-panel-2.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-right-panel-2.svg"
                    }, {
                        "name": "Layout-top-panel-1.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-top-panel-1.svg"
                    }, {
                        "name": "Layout-top-panel-2.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-top-panel-2.svg"
                    }, {
                        "name": "Layout-top-panel-3.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-top-panel-3.svg"
                    }, {
                        "name": "Layout-top-panel-4.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-top-panel-4.svg"
                    }, {
                        "name": "Layout-top-panel-5.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-top-panel-5.svg"
                    }, {
                        "name": "Layout-top-panel-6.svg",
                        "url": "/assets/icons/duotone/Layout/Layout-top-panel-6.svg"
                    }, {"name": "Layout-vertical.svg", "url": "/assets/icons/duotone/Layout/Layout-vertical.svg"}],
                    "title": "SVG Duotone Layout"
                }, {
                    "svgs": [{
                        "name": "Compass.svg",
                        "url": "/assets/icons/duotone/Map/Compass.svg"
                    }, {
                        "name": "Direction1.svg",
                        "url": "/assets/icons/duotone/Map/Direction1.svg"
                    }, {
                        "name": "Direction2.svg",
                        "url": "/assets/icons/duotone/Map/Direction2.svg"
                    }, {
                        "name": "Location-arrow.svg",
                        "url": "/assets/icons/duotone/Map/Location-arrow.svg"
                    }, {"name": "Marker1.svg", "url": "/assets/icons/duotone/Map/Marker1.svg"}, {
                        "name": "Marker2.svg",
                        "url": "/assets/icons/duotone/Map/Marker2.svg"
                    }, {"name": "Position.svg", "url": "/assets/icons/duotone/Map/Position.svg"}],
                    "title": "SVG Duotone Map"
                }, {
                    "svgs": [{
                        "name": "Add-music.svg",
                        "url": "/assets/icons/duotone/Media/Add-music.svg"
                    }, {
                        "name": "AirPlay.svg",
                        "url": "/assets/icons/duotone/Media/AirPlay.svg"
                    }, {
                        "name": "Airplay-video.svg",
                        "url": "/assets/icons/duotone/Media/Airplay-video.svg"
                    }, {"name": "Back.svg", "url": "/assets/icons/duotone/Media/Back.svg"}, {
                        "name": "Backward.svg",
                        "url": "/assets/icons/duotone/Media/Backward.svg"
                    }, {"name": "CD.svg", "url": "/assets/icons/duotone/Media/CD.svg"}, {
                        "name": "DVD.svg",
                        "url": "/assets/icons/duotone/Media/DVD.svg"
                    }, {"name": "Eject.svg", "url": "/assets/icons/duotone/Media/Eject.svg"}, {
                        "name": "Equalizer.svg",
                        "url": "/assets/icons/duotone/Media/Equalizer.svg"
                    }, {
                        "name": "Forward.svg",
                        "url": "/assets/icons/duotone/Media/Forward.svg"
                    }, {
                        "name": "Media-library1.svg",
                        "url": "/assets/icons/duotone/Media/Media-library1.svg"
                    }, {
                        "name": "Media-library2.svg",
                        "url": "/assets/icons/duotone/Media/Media-library2.svg"
                    }, {
                        "name": "Media-library3.svg",
                        "url": "/assets/icons/duotone/Media/Media-library3.svg"
                    }, {
                        "name": "Movie-Lane2.svg",
                        "url": "/assets/icons/duotone/Media/Movie-Lane2.svg"
                    }, {
                        "name": "Movie-lane1.svg",
                        "url": "/assets/icons/duotone/Media/Movie-lane1.svg"
                    }, {
                        "name": "Music-cloud.svg",
                        "url": "/assets/icons/duotone/Media/Music-cloud.svg"
                    }, {
                        "name": "Music-note.svg",
                        "url": "/assets/icons/duotone/Media/Music-note.svg"
                    }, {"name": "Music.svg", "url": "/assets/icons/duotone/Media/Music.svg"}, {
                        "name": "Mute.svg",
                        "url": "/assets/icons/duotone/Media/Mute.svg"
                    }, {"name": "Next.svg", "url": "/assets/icons/duotone/Media/Next.svg"}, {
                        "name": "Pause.svg",
                        "url": "/assets/icons/duotone/Media/Pause.svg"
                    }, {"name": "Play.svg", "url": "/assets/icons/duotone/Media/Play.svg"}, {
                        "name": "Playlist1.svg",
                        "url": "/assets/icons/duotone/Media/Playlist1.svg"
                    }, {
                        "name": "Playlist2.svg",
                        "url": "/assets/icons/duotone/Media/Playlist2.svg"
                    }, {"name": "Rec.svg", "url": "/assets/icons/duotone/Media/Rec.svg"}, {
                        "name": "Repeat-one.svg",
                        "url": "/assets/icons/duotone/Media/Repeat-one.svg"
                    }, {"name": "Repeat.svg", "url": "/assets/icons/duotone/Media/Repeat.svg"}, {
                        "name": "Shuffle.svg",
                        "url": "/assets/icons/duotone/Media/Shuffle.svg"
                    }, {
                        "name": "Volume-Down.svg",
                        "url": "/assets/icons/duotone/Media/Volume-Down.svg"
                    }, {
                        "name": "Volume-Up.svg",
                        "url": "/assets/icons/duotone/Media/Volume-Up.svg"
                    }, {
                        "name": "Volume-full.svg",
                        "url": "/assets/icons/duotone/Media/Volume-full.svg"
                    }, {
                        "name": "Volume-half.svg",
                        "url": "/assets/icons/duotone/Media/Volume-half.svg"
                    }, {"name": "Vynil.svg", "url": "/assets/icons/duotone/Media/Vynil.svg"}, {
                        "name": "Youtube.svg",
                        "url": "/assets/icons/duotone/Media/Youtube.svg"
                    }], "title": "SVG Duotone Media"
                }, {
                    "svgs": [{
                        "name": "Angle-double-down.svg",
                        "url": "/assets/icons/duotone/Navigation/Angle-double-down.svg"
                    }, {
                        "name": "Angle-double-left.svg",
                        "url": "/assets/icons/duotone/Navigation/Angle-double-left.svg"
                    }, {
                        "name": "Angle-double-right.svg",
                        "url": "/assets/icons/duotone/Navigation/Angle-double-right.svg"
                    }, {
                        "name": "Angle-double-up.svg",
                        "url": "/assets/icons/duotone/Navigation/Angle-double-up.svg"
                    }, {
                        "name": "Angle-down.svg",
                        "url": "/assets/icons/duotone/Navigation/Angle-down.svg"
                    }, {
                        "name": "Angle-left.svg",
                        "url": "/assets/icons/duotone/Navigation/Angle-left.svg"
                    }, {
                        "name": "Angle-right.svg",
                        "url": "/assets/icons/duotone/Navigation/Angle-right.svg"
                    }, {
                        "name": "Angle-up.svg",
                        "url": "/assets/icons/duotone/Navigation/Angle-up.svg"
                    }, {
                        "name": "Arrow-down.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-down.svg"
                    }, {
                        "name": "Arrow-from-bottom.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-from-bottom.svg"
                    }, {
                        "name": "Arrow-from-left.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-from-left.svg"
                    }, {
                        "name": "Arrow-from-right.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-from-right.svg"
                    }, {
                        "name": "Arrow-from-top.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-from-top.svg"
                    }, {
                        "name": "Arrow-left.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-left.svg"
                    }, {
                        "name": "Arrow-right.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-right.svg"
                    }, {
                        "name": "Arrow-to-bottom.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-to-bottom.svg"
                    }, {
                        "name": "Arrow-to-left.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-to-left.svg"
                    }, {
                        "name": "Arrow-to-right.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-to-right.svg"
                    }, {
                        "name": "Arrow-to-up.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-to-up.svg"
                    }, {
                        "name": "Arrow-up.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrow-up.svg"
                    }, {
                        "name": "Arrows-h.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrows-h.svg"
                    }, {
                        "name": "Arrows-v.svg",
                        "url": "/assets/icons/duotone/Navigation/Arrows-v.svg"
                    }, {"name": "Check.svg", "url": "/assets/icons/duotone/Navigation/Check.svg"}, {
                        "name": "Close.svg",
                        "url": "/assets/icons/duotone/Navigation/Close.svg"
                    }, {
                        "name": "Double-check.svg",
                        "url": "/assets/icons/duotone/Navigation/Double-check.svg"
                    }, {
                        "name": "Down-2.svg",
                        "url": "/assets/icons/duotone/Navigation/Down-2.svg"
                    }, {
                        "name": "Down-left.svg",
                        "url": "/assets/icons/duotone/Navigation/Down-left.svg"
                    }, {
                        "name": "Down-right.svg",
                        "url": "/assets/icons/duotone/Navigation/Down-right.svg"
                    }, {
                        "name": "Exchange.svg",
                        "url": "/assets/icons/duotone/Navigation/Exchange.svg"
                    }, {
                        "name": "Left-2.svg",
                        "url": "/assets/icons/duotone/Navigation/Left-2.svg"
                    }, {
                        "name": "Left-3.svg",
                        "url": "/assets/icons/duotone/Navigation/Left-3.svg"
                    }, {"name": "Minus.svg", "url": "/assets/icons/duotone/Navigation/Minus.svg"}, {
                        "name": "Plus.svg",
                        "url": "/assets/icons/duotone/Navigation/Plus.svg"
                    }, {
                        "name": "Right 3.svg",
                        "url": "/assets/icons/duotone/Navigation/Right 3.svg"
                    }, {
                        "name": "Right-2.svg",
                        "url": "/assets/icons/duotone/Navigation/Right-2.svg"
                    }, {
                        "name": "Route.svg",
                        "url": "/assets/icons/duotone/Navigation/Route.svg"
                    }, {
                        "name": "Sign-in.svg",
                        "url": "/assets/icons/duotone/Navigation/Sign-in.svg"
                    }, {
                        "name": "Sign-out.svg",
                        "url": "/assets/icons/duotone/Navigation/Sign-out.svg"
                    }, {"name": "Up-2.svg", "url": "/assets/icons/duotone/Navigation/Up-2.svg"}, {
                        "name": "Up-down.svg",
                        "url": "/assets/icons/duotone/Navigation/Up-down.svg"
                    }, {
                        "name": "Up-left.svg",
                        "url": "/assets/icons/duotone/Navigation/Up-left.svg"
                    }, {
                        "name": "Up-right.svg",
                        "url": "/assets/icons/duotone/Navigation/Up-right.svg"
                    }, {"name": "Waiting.svg", "url": "/assets/icons/duotone/Navigation/Waiting.svg"}],
                    "title": "SVG Duotone Navigation"
                }, {
                    "svgs": [{"name": "ATM.svg", "url": "/assets/icons/duotone/Shopping/ATM.svg"}, {
                        "name": "Bag1.svg",
                        "url": "/assets/icons/duotone/Shopping/Bag1.svg"
                    }, {
                        "name": "Bag2.svg",
                        "url": "/assets/icons/duotone/Shopping/Bag2.svg"
                    }, {
                        "name": "Barcode-read.svg",
                        "url": "/assets/icons/duotone/Shopping/Barcode-read.svg"
                    }, {
                        "name": "Barcode-scan.svg",
                        "url": "/assets/icons/duotone/Shopping/Barcode-scan.svg"
                    }, {
                        "name": "Barcode.svg",
                        "url": "/assets/icons/duotone/Shopping/Barcode.svg"
                    }, {
                        "name": "Bitcoin.svg",
                        "url": "/assets/icons/duotone/Shopping/Bitcoin.svg"
                    }, {"name": "Box1.svg", "url": "/assets/icons/duotone/Shopping/Box1.svg"}, {
                        "name": "Box2.svg",
                        "url": "/assets/icons/duotone/Shopping/Box2.svg"
                    }, {
                        "name": "Box3.svg",
                        "url": "/assets/icons/duotone/Shopping/Box3.svg"
                    }, {
                        "name": "Calculator.svg",
                        "url": "/assets/icons/duotone/Shopping/Calculator.svg"
                    }, {"name": "Cart1.svg", "url": "/assets/icons/duotone/Shopping/Cart1.svg"}, {
                        "name": "Cart2.svg",
                        "url": "/assets/icons/duotone/Shopping/Cart2.svg"
                    }, {"name": "Cart3.svg", "url": "/assets/icons/duotone/Shopping/Cart3.svg"}, {
                        "name": "Cart4.svg",
                        "url": "/assets/icons/duotone/Shopping/Cart4.svg"
                    }, {"name": "Cart5.svg", "url": "/assets/icons/duotone/Shopping/Cart5.svg"}, {
                        "name": "Cart6.svg",
                        "url": "/assets/icons/duotone/Shopping/Cart6.svg"
                    }, {
                        "name": "Chart-bar1.svg",
                        "url": "/assets/icons/duotone/Shopping/Chart-bar1.svg"
                    }, {
                        "name": "Chart-bar2.svg",
                        "url": "/assets/icons/duotone/Shopping/Chart-bar2.svg"
                    }, {
                        "name": "Chart-bar3.svg",
                        "url": "/assets/icons/duotone/Shopping/Chart-bar3.svg"
                    }, {
                        "name": "Chart-line1.svg",
                        "url": "/assets/icons/duotone/Shopping/Chart-line1.svg"
                    }, {
                        "name": "Chart-line2.svg",
                        "url": "/assets/icons/duotone/Shopping/Chart-line2.svg"
                    }, {
                        "name": "Chart-pie.svg",
                        "url": "/assets/icons/duotone/Shopping/Chart-pie.svg"
                    }, {
                        "name": "Chart.svg",
                        "url": "/assets/icons/duotone/Shopping/Chart.svg"
                    }, {
                        "name": "Credit-card.svg",
                        "url": "/assets/icons/duotone/Shopping/Credit-card.svg"
                    }, {"name": "Dollar.svg", "url": "/assets/icons/duotone/Shopping/Dollar.svg"}, {
                        "name": "Euro.svg",
                        "url": "/assets/icons/duotone/Shopping/Euro.svg"
                    }, {"name": "Gift.svg", "url": "/assets/icons/duotone/Shopping/Gift.svg"}, {
                        "name": "Loader.svg",
                        "url": "/assets/icons/duotone/Shopping/Loader.svg"
                    }, {"name": "MC.svg", "url": "/assets/icons/duotone/Shopping/MC.svg"}, {
                        "name": "Money.svg",
                        "url": "/assets/icons/duotone/Shopping/Money.svg"
                    }, {"name": "Pound.svg", "url": "/assets/icons/duotone/Shopping/Pound.svg"}, {
                        "name": "Price1.svg",
                        "url": "/assets/icons/duotone/Shopping/Price1.svg"
                    }, {
                        "name": "Price2.svg",
                        "url": "/assets/icons/duotone/Shopping/Price2.svg"
                    }, {"name": "Rouble.svg", "url": "/assets/icons/duotone/Shopping/Rouble.svg"}, {
                        "name": "Safe.svg",
                        "url": "/assets/icons/duotone/Shopping/Safe.svg"
                    }, {"name": "Sale1.svg", "url": "/assets/icons/duotone/Shopping/Sale1.svg"}, {
                        "name": "Sale2.svg",
                        "url": "/assets/icons/duotone/Shopping/Sale2.svg"
                    }, {
                        "name": "Settings.svg",
                        "url": "/assets/icons/duotone/Shopping/Settings.svg"
                    }, {"name": "Sort1.svg", "url": "/assets/icons/duotone/Shopping/Sort1.svg"}, {
                        "name": "Sort2.svg",
                        "url": "/assets/icons/duotone/Shopping/Sort2.svg"
                    }, {"name": "Sort3.svg", "url": "/assets/icons/duotone/Shopping/Sort3.svg"}, {
                        "name": "Ticket.svg",
                        "url": "/assets/icons/duotone/Shopping/Ticket.svg"
                    }, {
                        "name": "Wallet.svg",
                        "url": "/assets/icons/duotone/Shopping/Wallet.svg"
                    }, {
                        "name": "Wallet2.svg",
                        "url": "/assets/icons/duotone/Shopping/Wallet2.svg"
                    }, {"name": "Wallet3.svg", "url": "/assets/icons/duotone/Shopping/Wallet3.svg"}],
                    "title": "SVG Duotone Shopping"
                }, {
                    "svgs": [{
                        "name": "Align-auto.svg",
                        "url": "/assets/icons/duotone/Text/Align-auto.svg"
                    }, {
                        "name": "Align-center.svg",
                        "url": "/assets/icons/duotone/Text/Align-center.svg"
                    }, {
                        "name": "Align-justify.svg",
                        "url": "/assets/icons/duotone/Text/Align-justify.svg"
                    }, {
                        "name": "Align-left.svg",
                        "url": "/assets/icons/duotone/Text/Align-left.svg"
                    }, {
                        "name": "Align-right.svg",
                        "url": "/assets/icons/duotone/Text/Align-right.svg"
                    }, {"name": "Article.svg", "url": "/assets/icons/duotone/Text/Article.svg"}, {
                        "name": "Bold.svg",
                        "url": "/assets/icons/duotone/Text/Bold.svg"
                    }, {
                        "name": "Bullet-list.svg",
                        "url": "/assets/icons/duotone/Text/Bullet-list.svg"
                    }, {"name": "Code.svg", "url": "/assets/icons/duotone/Text/Code.svg"}, {
                        "name": "Dots.svg",
                        "url": "/assets/icons/duotone/Text/Dots.svg"
                    }, {
                        "name": "Edit-text.svg",
                        "url": "/assets/icons/duotone/Text/Edit-text.svg"
                    }, {"name": "Filter.svg", "url": "/assets/icons/duotone/Text/Filter.svg"}, {
                        "name": "Font.svg",
                        "url": "/assets/icons/duotone/Text/Font.svg"
                    }, {"name": "H1.svg", "url": "/assets/icons/duotone/Text/H1.svg"}, {
                        "name": "H2.svg",
                        "url": "/assets/icons/duotone/Text/H2.svg"
                    }, {"name": "Itallic.svg", "url": "/assets/icons/duotone/Text/Itallic.svg"}, {
                        "name": "Menu.svg",
                        "url": "/assets/icons/duotone/Text/Menu.svg"
                    }, {
                        "name": "Paragraph.svg",
                        "url": "/assets/icons/duotone/Text/Paragraph.svg"
                    }, {"name": "Quote1.svg", "url": "/assets/icons/duotone/Text/Quote1.svg"}, {
                        "name": "Quote2.svg",
                        "url": "/assets/icons/duotone/Text/Quote2.svg"
                    }, {"name": "Redo.svg", "url": "/assets/icons/duotone/Text/Redo.svg"}, {
                        "name": "Strikethrough.svg",
                        "url": "/assets/icons/duotone/Text/Strikethrough.svg"
                    }, {
                        "name": "Text-height.svg",
                        "url": "/assets/icons/duotone/Text/Text-height.svg"
                    }, {
                        "name": "Text-width.svg",
                        "url": "/assets/icons/duotone/Text/Text-width.svg"
                    }, {"name": "Text.svg", "url": "/assets/icons/duotone/Text/Text.svg"}, {
                        "name": "Toggle-Left.svg",
                        "url": "/assets/icons/duotone/Text/Toggle-Left.svg"
                    }, {
                        "name": "Toggle-Right.svg",
                        "url": "/assets/icons/duotone/Text/Toggle-Right.svg"
                    }, {"name": "Toggle.svg", "url": "/assets/icons/duotone/Text/Toggle.svg"}, {
                        "name": "Underline.svg",
                        "url": "/assets/icons/duotone/Text/Underline.svg"
                    }, {"name": "Undo.svg", "url": "/assets/icons/duotone/Text/Undo.svg"}], "title": "SVG Duotone Text"
                }, {
                    "svgs": [{
                        "name": "Angle Grinder.svg",
                        "url": "/assets/icons/duotone/Tools/Angle Grinder.svg"
                    }, {"name": "Axe.svg", "url": "/assets/icons/duotone/Tools/Axe.svg"}, {
                        "name": "Brush.svg",
                        "url": "/assets/icons/duotone/Tools/Brush.svg"
                    }, {"name": "Compass.svg", "url": "/assets/icons/duotone/Tools/Compass.svg"}, {
                        "name": "Hummer.svg",
                        "url": "/assets/icons/duotone/Tools/Hummer.svg"
                    }, {
                        "name": "Hummer2.svg",
                        "url": "/assets/icons/duotone/Tools/Hummer2.svg"
                    }, {
                        "name": "Pantone.svg",
                        "url": "/assets/icons/duotone/Tools/Pantone.svg"
                    }, {
                        "name": "Road-Cone.svg",
                        "url": "/assets/icons/duotone/Tools/Road-Cone.svg"
                    }, {"name": "Roller.svg", "url": "/assets/icons/duotone/Tools/Roller.svg"}, {
                        "name": "Roulette.svg",
                        "url": "/assets/icons/duotone/Tools/Roulette.svg"
                    }, {
                        "name": "Screwdriver.svg",
                        "url": "/assets/icons/duotone/Tools/Screwdriver.svg"
                    }, {"name": "Shovel.svg", "url": "/assets/icons/duotone/Tools/Shovel.svg"}, {
                        "name": "Spatula.svg",
                        "url": "/assets/icons/duotone/Tools/Spatula.svg"
                    }, {
                        "name": "Swiss-knife.svg",
                        "url": "/assets/icons/duotone/Tools/Swiss-knife.svg"
                    }, {"name": "Tools.svg", "url": "/assets/icons/duotone/Tools/Tools.svg"}],
                    "title": "SVG Duotone Tools"
                }, {
                    "svgs": [{
                        "name": "Celcium.svg",
                        "url": "/assets/icons/duotone/Weather/Celcium.svg"
                    }, {
                        "name": "Cloud-fog.svg",
                        "url": "/assets/icons/duotone/Weather/Cloud-fog.svg"
                    }, {
                        "name": "Cloud-sun.svg",
                        "url": "/assets/icons/duotone/Weather/Cloud-sun.svg"
                    }, {
                        "name": "Cloud-wind.svg",
                        "url": "/assets/icons/duotone/Weather/Cloud-wind.svg"
                    }, {"name": "Cloud1.svg", "url": "/assets/icons/duotone/Weather/Cloud1.svg"}, {
                        "name": "Cloud2.svg",
                        "url": "/assets/icons/duotone/Weather/Cloud2.svg"
                    }, {
                        "name": "Cloudy-night.svg",
                        "url": "/assets/icons/duotone/Weather/Cloudy-night.svg"
                    }, {
                        "name": "Cloudy.svg",
                        "url": "/assets/icons/duotone/Weather/Cloudy.svg"
                    }, {
                        "name": "Day-rain.svg",
                        "url": "/assets/icons/duotone/Weather/Day-rain.svg"
                    }, {
                        "name": "Fahrenheit.svg",
                        "url": "/assets/icons/duotone/Weather/Fahrenheit.svg"
                    }, {"name": "Fog.svg", "url": "/assets/icons/duotone/Weather/Fog.svg"}, {
                        "name": "Moon.svg",
                        "url": "/assets/icons/duotone/Weather/Moon.svg"
                    }, {
                        "name": "Night-fog.svg",
                        "url": "/assets/icons/duotone/Weather/Night-fog.svg"
                    }, {
                        "name": "Night-rain.svg",
                        "url": "/assets/icons/duotone/Weather/Night-rain.svg"
                    }, {"name": "Rain1.svg", "url": "/assets/icons/duotone/Weather/Rain1.svg"}, {
                        "name": "Rain2.svg",
                        "url": "/assets/icons/duotone/Weather/Rain2.svg"
                    }, {"name": "Rain5.svg", "url": "/assets/icons/duotone/Weather/Rain5.svg"}, {
                        "name": "Rainbow.svg",
                        "url": "/assets/icons/duotone/Weather/Rainbow.svg"
                    }, {"name": "Snow.svg", "url": "/assets/icons/duotone/Weather/Snow.svg"}, {
                        "name": "Snow1.svg",
                        "url": "/assets/icons/duotone/Weather/Snow1.svg"
                    }, {"name": "Snow2.svg", "url": "/assets/icons/duotone/Weather/Snow2.svg"}, {
                        "name": "Snow3.svg",
                        "url": "/assets/icons/duotone/Weather/Snow3.svg"
                    }, {"name": "Storm.svg", "url": "/assets/icons/duotone/Weather/Storm.svg"}, {
                        "name": "Sun-fog.svg",
                        "url": "/assets/icons/duotone/Weather/Sun-fog.svg"
                    }, {"name": "Sun.svg", "url": "/assets/icons/duotone/Weather/Sun.svg"}, {
                        "name": "Suset1.svg",
                        "url": "/assets/icons/duotone/Weather/Suset1.svg"
                    }, {
                        "name": "Suset2.svg",
                        "url": "/assets/icons/duotone/Weather/Suset2.svg"
                    }, {
                        "name": "Temperature-empty.svg",
                        "url": "/assets/icons/duotone/Weather/Temperature-empty.svg"
                    }, {
                        "name": "Temperature-full.svg",
                        "url": "/assets/icons/duotone/Weather/Temperature-full.svg"
                    }, {
                        "name": "Temperature-half.svg",
                        "url": "/assets/icons/duotone/Weather/Temperature-half.svg"
                    }, {
                        "name": "Thunder-night.svg",
                        "url": "/assets/icons/duotone/Weather/Thunder-night.svg"
                    }, {
                        "name": "Thunder.svg",
                        "url": "/assets/icons/duotone/Weather/Thunder.svg"
                    }, {
                        "name": "Umbrella.svg",
                        "url": "/assets/icons/duotone/Weather/Umbrella.svg"
                    }, {"name": "Wind.svg", "url": "/assets/icons/duotone/Weather/Wind.svg"}],
                    "title": "SVG Duotone Weather"
                },
                {
                    "svgs": [{
                        "name": "abs001.svg",
                        "url": "/assets/icons/duotune/abstract/abs001.svg"
                    }, {
                        "name": "abs002.svg",
                        "url": "/assets/icons/duotune/abstract/abs002.svg"
                    }, {
                        "name": "abs003.svg",
                        "url": "/assets/icons/duotune/abstract/abs003.svg"
                    }, {
                        "name": "abs004.svg",
                        "url": "/assets/icons/duotune/abstract/abs004.svg"
                    }, {
                        "name": "abs005.svg",
                        "url": "/assets/icons/duotune/abstract/abs005.svg"
                    }, {
                        "name": "abs006.svg",
                        "url": "/assets/icons/duotune/abstract/abs006.svg"
                    }, {
                        "name": "abs007.svg",
                        "url": "/assets/icons/duotune/abstract/abs007.svg"
                    }, {
                        "name": "abs008.svg",
                        "url": "/assets/icons/duotune/abstract/abs008.svg"
                    }, {
                        "name": "abs009.svg",
                        "url": "/assets/icons/duotune/abstract/abs009.svg"
                    }, {
                        "name": "abs010.svg",
                        "url": "/assets/icons/duotune/abstract/abs010.svg"
                    }, {
                        "name": "abs011.svg",
                        "url": "/assets/icons/duotune/abstract/abs011.svg"
                    }, {
                        "name": "abs012.svg",
                        "url": "/assets/icons/duotune/abstract/abs012.svg"
                    }, {
                        "name": "abs013.svg",
                        "url": "/assets/icons/duotune/abstract/abs013.svg"
                    }, {
                        "name": "abs014.svg",
                        "url": "/assets/icons/duotune/abstract/abs014.svg"
                    }, {
                        "name": "abs015.svg",
                        "url": "/assets/icons/duotune/abstract/abs015.svg"
                    }, {
                        "name": "abs016.svg",
                        "url": "/assets/icons/duotune/abstract/abs016.svg"
                    }, {
                        "name": "abs017.svg",
                        "url": "/assets/icons/duotune/abstract/abs017.svg"
                    }, {
                        "name": "abs018.svg",
                        "url": "/assets/icons/duotune/abstract/abs018.svg"
                    }, {
                        "name": "abs019.svg",
                        "url": "/assets/icons/duotune/abstract/abs019.svg"
                    }, {
                        "name": "abs020.svg",
                        "url": "/assets/icons/duotune/abstract/abs020.svg"
                    }, {
                        "name": "abs021.svg",
                        "url": "/assets/icons/duotune/abstract/abs021.svg"
                    }, {
                        "name": "abs022.svg",
                        "url": "/assets/icons/duotune/abstract/abs022.svg"
                    }, {
                        "name": "abs023.svg",
                        "url": "/assets/icons/duotune/abstract/abs023.svg"
                    }, {
                        "name": "abs024.svg",
                        "url": "/assets/icons/duotune/abstract/abs024.svg"
                    }, {
                        "name": "abs025.svg",
                        "url": "/assets/icons/duotune/abstract/abs025.svg"
                    }, {
                        "name": "abs026.svg",
                        "url": "/assets/icons/duotune/abstract/abs026.svg"
                    }, {
                        "name": "abs027.svg",
                        "url": "/assets/icons/duotune/abstract/abs027.svg"
                    }, {
                        "name": "abs028.svg",
                        "url": "/assets/icons/duotune/abstract/abs028.svg"
                    }, {
                        "name": "abs029.svg",
                        "url": "/assets/icons/duotune/abstract/abs029.svg"
                    }, {
                        "name": "abs030.svg",
                        "url": "/assets/icons/duotune/abstract/abs030.svg"
                    }, {
                        "name": "abs031.svg",
                        "url": "/assets/icons/duotune/abstract/abs031.svg"
                    }, {
                        "name": "abs032.svg",
                        "url": "/assets/icons/duotune/abstract/abs032.svg"
                    }, {
                        "name": "abs033.svg",
                        "url": "/assets/icons/duotune/abstract/abs033.svg"
                    }, {
                        "name": "abs034.svg",
                        "url": "/assets/icons/duotune/abstract/abs034.svg"
                    }, {
                        "name": "abs035.svg",
                        "url": "/assets/icons/duotune/abstract/abs035.svg"
                    }, {
                        "name": "abs036.svg",
                        "url": "/assets/icons/duotune/abstract/abs036.svg"
                    }, {
                        "name": "abs037.svg",
                        "url": "/assets/icons/duotune/abstract/abs037.svg"
                    }, {
                        "name": "abs038.svg",
                        "url": "/assets/icons/duotune/abstract/abs038.svg"
                    }, {
                        "name": "abs039.svg",
                        "url": "/assets/icons/duotune/abstract/abs039.svg"
                    }, {
                        "name": "abs040.svg",
                        "url": "/assets/icons/duotune/abstract/abs040.svg"
                    }, {
                        "name": "abs041.svg",
                        "url": "/assets/icons/duotune/abstract/abs041.svg"
                    }, {
                        "name": "abs042.svg",
                        "url": "/assets/icons/duotune/abstract/abs042.svg"
                    }, {
                        "name": "abs043.svg",
                        "url": "/assets/icons/duotune/abstract/abs043.svg"
                    }, {
                        "name": "abs044.svg",
                        "url": "/assets/icons/duotune/abstract/abs044.svg"
                    }, {
                        "name": "abs045.svg",
                        "url": "/assets/icons/duotune/abstract/abs045.svg"
                    }, {
                        "name": "abs046.svg",
                        "url": "/assets/icons/duotune/abstract/abs046.svg"
                    }, {
                        "name": "abs047.svg",
                        "url": "/assets/icons/duotune/abstract/abs047.svg"
                    }, {
                        "name": "abs048.svg",
                        "url": "/assets/icons/duotune/abstract/abs048.svg"
                    }, {
                        "name": "abs049.svg",
                        "url": "/assets/icons/duotune/abstract/abs049.svg"
                    }, {
                        "name": "abs050.svg",
                        "url": "/assets/icons/duotune/abstract/abs050.svg"
                    }, {
                        "name": "abs051.svg",
                        "url": "/assets/icons/duotune/abstract/abs051.svg"
                    }, {"name": "abs052.svg", "url": "/assets/icons/duotune/abstract/abs052.svg"}],
                    "title": "SVG Duotune abstract"
                }, {
                    "svgs": [{
                        "name": "arr001.svg",
                        "url": "/assets/icons/duotune/arrows/arr001.svg"
                    }, {"name": "arr002.svg", "url": "/assets/icons/duotune/arrows/arr002.svg"}, {
                        "name": "arr003.svg",
                        "url": "/assets/icons/duotune/arrows/arr003.svg"
                    }, {"name": "arr004.svg", "url": "/assets/icons/duotune/arrows/arr004.svg"}, {
                        "name": "arr005.svg",
                        "url": "/assets/icons/duotune/arrows/arr005.svg"
                    }, {"name": "arr006.svg", "url": "/assets/icons/duotune/arrows/arr006.svg"}, {
                        "name": "arr007.svg",
                        "url": "/assets/icons/duotune/arrows/arr007.svg"
                    }, {"name": "arr008.svg", "url": "/assets/icons/duotune/arrows/arr008.svg"}, {
                        "name": "arr009.svg",
                        "url": "/assets/icons/duotune/arrows/arr009.svg"
                    }, {"name": "arr010.svg", "url": "/assets/icons/duotune/arrows/arr010.svg"}, {
                        "name": "arr011.svg",
                        "url": "/assets/icons/duotune/arrows/arr011.svg"
                    }, {"name": "arr012.svg", "url": "/assets/icons/duotune/arrows/arr012.svg"}, {
                        "name": "arr013.svg",
                        "url": "/assets/icons/duotune/arrows/arr013.svg"
                    }, {"name": "arr014.svg", "url": "/assets/icons/duotune/arrows/arr014.svg"}, {
                        "name": "arr015.svg",
                        "url": "/assets/icons/duotune/arrows/arr015.svg"
                    }, {"name": "arr016.svg", "url": "/assets/icons/duotune/arrows/arr016.svg"}, {
                        "name": "arr017.svg",
                        "url": "/assets/icons/duotune/arrows/arr017.svg"
                    }, {"name": "arr018.svg", "url": "/assets/icons/duotune/arrows/arr018.svg"}, {
                        "name": "arr019.svg",
                        "url": "/assets/icons/duotune/arrows/arr019.svg"
                    }, {"name": "arr020.svg", "url": "/assets/icons/duotune/arrows/arr020.svg"}, {
                        "name": "arr021.svg",
                        "url": "/assets/icons/duotune/arrows/arr021.svg"
                    }, {"name": "arr022.svg", "url": "/assets/icons/duotune/arrows/arr022.svg"}, {
                        "name": "arr023.svg",
                        "url": "/assets/icons/duotune/arrows/arr023.svg"
                    }, {"name": "arr024.svg", "url": "/assets/icons/duotune/arrows/arr024.svg"}, {
                        "name": "arr025.svg",
                        "url": "/assets/icons/duotune/arrows/arr025.svg"
                    }, {"name": "arr026.svg", "url": "/assets/icons/duotune/arrows/arr026.svg"}, {
                        "name": "arr027.svg",
                        "url": "/assets/icons/duotune/arrows/arr027.svg"
                    }, {"name": "arr028.svg", "url": "/assets/icons/duotune/arrows/arr028.svg"}, {
                        "name": "arr029.svg",
                        "url": "/assets/icons/duotune/arrows/arr029.svg"
                    }, {"name": "arr030.svg", "url": "/assets/icons/duotune/arrows/arr030.svg"}, {
                        "name": "arr031.svg",
                        "url": "/assets/icons/duotune/arrows/arr031.svg"
                    }, {"name": "arr032.svg", "url": "/assets/icons/duotune/arrows/arr032.svg"}, {
                        "name": "arr033.svg",
                        "url": "/assets/icons/duotune/arrows/arr033.svg"
                    }, {"name": "arr034.svg", "url": "/assets/icons/duotune/arrows/arr034.svg"}, {
                        "name": "arr035.svg",
                        "url": "/assets/icons/duotune/arrows/arr035.svg"
                    }, {"name": "arr036.svg", "url": "/assets/icons/duotune/arrows/arr036.svg"}, {
                        "name": "arr037.svg",
                        "url": "/assets/icons/duotune/arrows/arr037.svg"
                    }, {"name": "arr038.svg", "url": "/assets/icons/duotune/arrows/arr038.svg"}, {
                        "name": "arr039.svg",
                        "url": "/assets/icons/duotune/arrows/arr039.svg"
                    }, {"name": "arr040.svg", "url": "/assets/icons/duotune/arrows/arr040.svg"}, {
                        "name": "arr041.svg",
                        "url": "/assets/icons/duotune/arrows/arr041.svg"
                    }, {"name": "arr042.svg", "url": "/assets/icons/duotune/arrows/arr042.svg"}, {
                        "name": "arr043.svg",
                        "url": "/assets/icons/duotune/arrows/arr043.svg"
                    }, {"name": "arr044.svg", "url": "/assets/icons/duotune/arrows/arr044.svg"}, {
                        "name": "arr045.svg",
                        "url": "/assets/icons/duotune/arrows/arr045.svg"
                    }, {"name": "arr046.svg", "url": "/assets/icons/duotune/arrows/arr046.svg"}, {
                        "name": "arr047.svg",
                        "url": "/assets/icons/duotune/arrows/arr047.svg"
                    }, {"name": "arr048.svg", "url": "/assets/icons/duotune/arrows/arr048.svg"}, {
                        "name": "arr049.svg",
                        "url": "/assets/icons/duotune/arrows/arr049.svg"
                    }, {"name": "arr050.svg", "url": "/assets/icons/duotune/arrows/arr050.svg"}, {
                        "name": "arr051.svg",
                        "url": "/assets/icons/duotune/arrows/arr051.svg"
                    }, {"name": "arr052.svg", "url": "/assets/icons/duotune/arrows/arr052.svg"}, {
                        "name": "arr053.svg",
                        "url": "/assets/icons/duotune/arrows/arr053.svg"
                    }, {"name": "arr054.svg", "url": "/assets/icons/duotune/arrows/arr054.svg"}, {
                        "name": "arr055.svg",
                        "url": "/assets/icons/duotune/arrows/arr055.svg"
                    }, {"name": "arr056.svg", "url": "/assets/icons/duotune/arrows/arr056.svg"}, {
                        "name": "arr057.svg",
                        "url": "/assets/icons/duotune/arrows/arr057.svg"
                    }, {"name": "arr058.svg", "url": "/assets/icons/duotune/arrows/arr058.svg"}, {
                        "name": "arr059.svg",
                        "url": "/assets/icons/duotune/arrows/arr059.svg"
                    }, {"name": "arr060.svg", "url": "/assets/icons/duotune/arrows/arr060.svg"}, {
                        "name": "arr061.svg",
                        "url": "/assets/icons/duotune/arrows/arr061.svg"
                    }, {"name": "arr062.svg", "url": "/assets/icons/duotune/arrows/arr062.svg"}, {
                        "name": "arr063.svg",
                        "url": "/assets/icons/duotune/arrows/arr063.svg"
                    }, {"name": "arr064.svg", "url": "/assets/icons/duotune/arrows/arr064.svg"}, {
                        "name": "arr065.svg",
                        "url": "/assets/icons/duotune/arrows/arr065.svg"
                    }, {"name": "arr066.svg", "url": "/assets/icons/duotune/arrows/arr066.svg"}, {
                        "name": "arr067.svg",
                        "url": "/assets/icons/duotune/arrows/arr067.svg"
                    }, {"name": "arr068.svg", "url": "/assets/icons/duotune/arrows/arr068.svg"}, {
                        "name": "arr069.svg",
                        "url": "/assets/icons/duotune/arrows/arr069.svg"
                    }, {"name": "arr070.svg", "url": "/assets/icons/duotune/arrows/arr070.svg"}, {
                        "name": "arr071.svg",
                        "url": "/assets/icons/duotune/arrows/arr071.svg"
                    }, {"name": "arr072.svg", "url": "/assets/icons/duotune/arrows/arr072.svg"}, {
                        "name": "arr073.svg",
                        "url": "/assets/icons/duotune/arrows/arr073.svg"
                    }, {"name": "arr074.svg", "url": "/assets/icons/duotune/arrows/arr074.svg"}, {
                        "name": "arr075.svg",
                        "url": "/assets/icons/duotune/arrows/arr075.svg"
                    }, {"name": "arr076.svg", "url": "/assets/icons/duotune/arrows/arr076.svg"}, {
                        "name": "arr077.svg",
                        "url": "/assets/icons/duotune/arrows/arr077.svg"
                    }, {"name": "arr078.svg", "url": "/assets/icons/duotune/arrows/arr078.svg"}, {
                        "name": "arr079.svg",
                        "url": "/assets/icons/duotune/arrows/arr079.svg"
                    }, {"name": "arr080.svg", "url": "/assets/icons/duotune/arrows/arr080.svg"}, {
                        "name": "arr081.svg",
                        "url": "/assets/icons/duotune/arrows/arr081.svg"
                    }, {"name": "arr082.svg", "url": "/assets/icons/duotune/arrows/arr082.svg"}, {
                        "name": "arr084.svg",
                        "url": "/assets/icons/duotune/arrows/arr084.svg"
                    }, {"name": "arr085.svg", "url": "/assets/icons/duotune/arrows/arr085.svg"}, {
                        "name": "arr086.svg",
                        "url": "/assets/icons/duotune/arrows/arr086.svg"
                    }, {"name": "arr087.svg", "url": "/assets/icons/duotune/arrows/arr087.svg"}, {
                        "name": "arr088.svg",
                        "url": "/assets/icons/duotune/arrows/arr088.svg"
                    }, {"name": "arr089.svg", "url": "/assets/icons/duotune/arrows/arr089.svg"}, {
                        "name": "arr090.svg",
                        "url": "/assets/icons/duotune/arrows/arr090.svg"
                    }, {"name": "arr091.svg", "url": "/assets/icons/duotune/arrows/arr091.svg"}, {
                        "name": "arr092.svg",
                        "url": "/assets/icons/duotune/arrows/arr092.svg"
                    }], "title": "SVG Duotune arrows"
                }, {
                    "svgs": [{
                        "name": "art001.svg",
                        "url": "/assets/icons/duotune/art/art001.svg"
                    }, {"name": "art002.svg", "url": "/assets/icons/duotune/art/art002.svg"}, {
                        "name": "art003.svg",
                        "url": "/assets/icons/duotune/art/art003.svg"
                    }, {"name": "art004.svg", "url": "/assets/icons/duotune/art/art004.svg"}, {
                        "name": "art005.svg",
                        "url": "/assets/icons/duotune/art/art005.svg"
                    }, {"name": "art006.svg", "url": "/assets/icons/duotune/art/art006.svg"}, {
                        "name": "art007.svg",
                        "url": "/assets/icons/duotune/art/art007.svg"
                    }, {"name": "art008.svg", "url": "/assets/icons/duotune/art/art008.svg"}, {
                        "name": "art009.svg",
                        "url": "/assets/icons/duotune/art/art009.svg"
                    }, {"name": "art010.svg", "url": "/assets/icons/duotune/art/art010.svg"}],
                    "title": "SVG Duotune art"
                }, {
                    "svgs": [{
                        "name": "cod001.svg",
                        "url": "/assets/icons/duotune/coding/cod001.svg"
                    }, {"name": "cod002.svg", "url": "/assets/icons/duotune/coding/cod002.svg"}, {
                        "name": "cod003.svg",
                        "url": "/assets/icons/duotune/coding/cod003.svg"
                    }, {"name": "cod004.svg", "url": "/assets/icons/duotune/coding/cod004.svg"}, {
                        "name": "cod005.svg",
                        "url": "/assets/icons/duotune/coding/cod005.svg"
                    }, {"name": "cod006.svg", "url": "/assets/icons/duotune/coding/cod006.svg"}, {
                        "name": "cod007.svg",
                        "url": "/assets/icons/duotune/coding/cod007.svg"
                    }, {"name": "cod008.svg", "url": "/assets/icons/duotune/coding/cod008.svg"}, {
                        "name": "cod009.svg",
                        "url": "/assets/icons/duotune/coding/cod009.svg"
                    }, {"name": "cod010.svg", "url": "/assets/icons/duotune/coding/cod010.svg"}],
                    "title": "SVG Duotune coding"
                }, {
                    "svgs": [{
                        "name": "com001.svg",
                        "url": "/assets/icons/duotune/communication/com001.svg"
                    }, {
                        "name": "com002.svg",
                        "url": "/assets/icons/duotune/communication/com002.svg"
                    }, {
                        "name": "com003.svg",
                        "url": "/assets/icons/duotune/communication/com003.svg"
                    }, {
                        "name": "com004.svg",
                        "url": "/assets/icons/duotune/communication/com004.svg"
                    }, {
                        "name": "com005.svg",
                        "url": "/assets/icons/duotune/communication/com005.svg"
                    }, {
                        "name": "com006.svg",
                        "url": "/assets/icons/duotune/communication/com006.svg"
                    }, {
                        "name": "com007.svg",
                        "url": "/assets/icons/duotune/communication/com007.svg"
                    }, {
                        "name": "com008.svg",
                        "url": "/assets/icons/duotune/communication/com008.svg"
                    }, {
                        "name": "com009.svg",
                        "url": "/assets/icons/duotune/communication/com009.svg"
                    }, {
                        "name": "com010.svg",
                        "url": "/assets/icons/duotune/communication/com010.svg"
                    }, {
                        "name": "com011.svg",
                        "url": "/assets/icons/duotune/communication/com011.svg"
                    }, {
                        "name": "com012.svg",
                        "url": "/assets/icons/duotune/communication/com012.svg"
                    }, {
                        "name": "com013.svg",
                        "url": "/assets/icons/duotune/communication/com013.svg"
                    }, {"name": "com014.svg", "url": "/assets/icons/duotune/communication/com014.svg"}],
                    "title": "SVG Duotune communication"
                }, {
                    "svgs": [{
                        "name": "ecm001.svg",
                        "url": "/assets/icons/duotune/ecommerce/ecm001.svg"
                    }, {
                        "name": "ecm002.svg",
                        "url": "/assets/icons/duotune/ecommerce/ecm002.svg"
                    }, {
                        "name": "ecm003.svg",
                        "url": "/assets/icons/duotune/ecommerce/ecm003.svg"
                    }, {
                        "name": "ecm004.svg",
                        "url": "/assets/icons/duotune/ecommerce/ecm004.svg"
                    }, {
                        "name": "ecm005.svg",
                        "url": "/assets/icons/duotune/ecommerce/ecm005.svg"
                    }, {
                        "name": "ecm006.svg",
                        "url": "/assets/icons/duotune/ecommerce/ecm006.svg"
                    }, {
                        "name": "ecm007.svg",
                        "url": "/assets/icons/duotune/ecommerce/ecm007.svg"
                    }, {
                        "name": "ecm008.svg",
                        "url": "/assets/icons/duotune/ecommerce/ecm008.svg"
                    }, {
                        "name": "ecm009.svg",
                        "url": "/assets/icons/duotune/ecommerce/ecm009.svg"
                    }, {
                        "name": "ecm010.svg",
                        "url": "/assets/icons/duotune/ecommerce/ecm010.svg"
                    }, {"name": "ecm011.svg", "url": "/assets/icons/duotune/ecommerce/ecm011.svg"}],
                    "title": "SVG Duotune ecommerce"
                }, {
                    "svgs": [{
                        "name": "elc001.svg",
                        "url": "/assets/icons/duotune/electronics/elc001.svg"
                    }, {
                        "name": "elc002.svg",
                        "url": "/assets/icons/duotune/electronics/elc002.svg"
                    }, {
                        "name": "elc003.svg",
                        "url": "/assets/icons/duotune/electronics/elc003.svg"
                    }, {
                        "name": "elc004.svg",
                        "url": "/assets/icons/duotune/electronics/elc004.svg"
                    }, {
                        "name": "elc005.svg",
                        "url": "/assets/icons/duotune/electronics/elc005.svg"
                    }, {
                        "name": "elc006.svg",
                        "url": "/assets/icons/duotune/electronics/elc006.svg"
                    }, {
                        "name": "elc007.svg",
                        "url": "/assets/icons/duotune/electronics/elc007.svg"
                    }, {
                        "name": "elc008.svg",
                        "url": "/assets/icons/duotune/electronics/elc008.svg"
                    }, {
                        "name": "elc009.svg",
                        "url": "/assets/icons/duotune/electronics/elc009.svg"
                    }, {"name": "elc010.svg", "url": "/assets/icons/duotune/electronics/elc010.svg"}],
                    "title": "SVG Duotune electronics"
                }, {
                    "svgs": [{
                        "name": "fil001.svg",
                        "url": "/assets/icons/duotune/files/fil001.svg"
                    }, {"name": "fil002.svg", "url": "/assets/icons/duotune/files/fil002.svg"}, {
                        "name": "fil003.svg",
                        "url": "/assets/icons/duotune/files/fil003.svg"
                    }, {"name": "fil004.svg", "url": "/assets/icons/duotune/files/fil004.svg"}, {
                        "name": "fil005.svg",
                        "url": "/assets/icons/duotune/files/fil005.svg"
                    }, {"name": "fil006.svg", "url": "/assets/icons/duotune/files/fil006.svg"}, {
                        "name": "fil007.svg",
                        "url": "/assets/icons/duotune/files/fil007.svg"
                    }, {"name": "fil008.svg", "url": "/assets/icons/duotune/files/fil008.svg"}, {
                        "name": "fil009.svg",
                        "url": "/assets/icons/duotune/files/fil009.svg"
                    }, {"name": "fil010.svg", "url": "/assets/icons/duotune/files/fil010.svg"}, {
                        "name": "fil011.svg",
                        "url": "/assets/icons/duotune/files/fil011.svg"
                    }, {"name": "fil012.svg", "url": "/assets/icons/duotune/files/fil012.svg"}, {
                        "name": "fil013.svg",
                        "url": "/assets/icons/duotune/files/fil013.svg"
                    }, {"name": "fil014.svg", "url": "/assets/icons/duotune/files/fil014.svg"}, {
                        "name": "fil015.svg",
                        "url": "/assets/icons/duotune/files/fil015.svg"
                    }, {"name": "fil016.svg", "url": "/assets/icons/duotune/files/fil016.svg"}, {
                        "name": "fil017.svg",
                        "url": "/assets/icons/duotune/files/fil017.svg"
                    }, {"name": "fil018.svg", "url": "/assets/icons/duotune/files/fil018.svg"}, {
                        "name": "fil019.svg",
                        "url": "/assets/icons/duotune/files/fil019.svg"
                    }, {"name": "fil020.svg", "url": "/assets/icons/duotune/files/fil020.svg"}, {
                        "name": "fil021.svg",
                        "url": "/assets/icons/duotune/files/fil021.svg"
                    }, {"name": "fil022.svg", "url": "/assets/icons/duotune/files/fil022.svg"}, {
                        "name": "fil023.svg",
                        "url": "/assets/icons/duotune/files/fil023.svg"
                    }, {"name": "fil024.svg", "url": "/assets/icons/duotune/files/fil024.svg"}, {
                        "name": "fil025.svg",
                        "url": "/assets/icons/duotune/files/fil025.svg"
                    }], "title": "SVG Duotune files"
                }, {
                    "svgs": [{
                        "name": "fin001.svg",
                        "url": "/assets/icons/duotune/finance/fin001.svg"
                    }, {"name": "fin002.svg", "url": "/assets/icons/duotune/finance/fin002.svg"}, {
                        "name": "fin003.svg",
                        "url": "/assets/icons/duotune/finance/fin003.svg"
                    }, {"name": "fin004.svg", "url": "/assets/icons/duotune/finance/fin004.svg"}, {
                        "name": "fin005.svg",
                        "url": "/assets/icons/duotune/finance/fin005.svg"
                    }, {"name": "fin006.svg", "url": "/assets/icons/duotune/finance/fin006.svg"}, {
                        "name": "fin007.svg",
                        "url": "/assets/icons/duotune/finance/fin007.svg"
                    }, {"name": "fin008.svg", "url": "/assets/icons/duotune/finance/fin008.svg"}, {
                        "name": "fin009.svg",
                        "url": "/assets/icons/duotune/finance/fin009.svg"
                    }, {"name": "fin010.svg", "url": "/assets/icons/duotune/finance/fin010.svg"}],
                    "title": "SVG Duotune finance"
                }, {
                    "svgs": [{
                        "name": "gen001.svg",
                        "url": "/assets/icons/duotune/general/gen001.svg"
                    }, {"name": "gen002.svg", "url": "/assets/icons/duotune/general/gen002.svg"}, {
                        "name": "gen003.svg",
                        "url": "/assets/icons/duotune/general/gen003.svg"
                    }, {"name": "gen004.svg", "url": "/assets/icons/duotune/general/gen004.svg"}, {
                        "name": "gen005.svg",
                        "url": "/assets/icons/duotune/general/gen005.svg"
                    }, {"name": "gen006.svg", "url": "/assets/icons/duotune/general/gen006.svg"}, {
                        "name": "gen007.svg",
                        "url": "/assets/icons/duotune/general/gen007.svg"
                    }, {"name": "gen008.svg", "url": "/assets/icons/duotune/general/gen008.svg"}, {
                        "name": "gen009.svg",
                        "url": "/assets/icons/duotune/general/gen009.svg"
                    }, {"name": "gen010.svg", "url": "/assets/icons/duotune/general/gen010.svg"}, {
                        "name": "gen011.svg",
                        "url": "/assets/icons/duotune/general/gen011.svg"
                    }, {"name": "gen012.svg", "url": "/assets/icons/duotune/general/gen012.svg"}, {
                        "name": "gen013.svg",
                        "url": "/assets/icons/duotune/general/gen013.svg"
                    }, {"name": "gen014.svg", "url": "/assets/icons/duotune/general/gen014.svg"}, {
                        "name": "gen015.svg",
                        "url": "/assets/icons/duotune/general/gen015.svg"
                    }, {"name": "gen016.svg", "url": "/assets/icons/duotune/general/gen016.svg"}, {
                        "name": "gen017.svg",
                        "url": "/assets/icons/duotune/general/gen017.svg"
                    }, {"name": "gen018.svg", "url": "/assets/icons/duotune/general/gen018.svg"}, {
                        "name": "gen019.svg",
                        "url": "/assets/icons/duotune/general/gen019.svg"
                    }, {"name": "gen020.svg", "url": "/assets/icons/duotune/general/gen020.svg"}, {
                        "name": "gen021.svg",
                        "url": "/assets/icons/duotune/general/gen021.svg"
                    }, {"name": "gen022.svg", "url": "/assets/icons/duotune/general/gen022.svg"}, {
                        "name": "gen023.svg",
                        "url": "/assets/icons/duotune/general/gen023.svg"
                    }, {"name": "gen024.svg", "url": "/assets/icons/duotune/general/gen024.svg"}, {
                        "name": "gen025.svg",
                        "url": "/assets/icons/duotune/general/gen025.svg"
                    }, {"name": "gen026.svg", "url": "/assets/icons/duotune/general/gen026.svg"}, {
                        "name": "gen027.svg",
                        "url": "/assets/icons/duotune/general/gen027.svg"
                    }, {"name": "gen028.svg", "url": "/assets/icons/duotune/general/gen028.svg"}, {
                        "name": "gen029.svg",
                        "url": "/assets/icons/duotune/general/gen029.svg"
                    }, {"name": "gen030.svg", "url": "/assets/icons/duotune/general/gen030.svg"}, {
                        "name": "gen031.svg",
                        "url": "/assets/icons/duotune/general/gen031.svg"
                    }, {"name": "gen032.svg", "url": "/assets/icons/duotune/general/gen032.svg"}, {
                        "name": "gen033.svg",
                        "url": "/assets/icons/duotune/general/gen033.svg"
                    }, {"name": "gen034.svg", "url": "/assets/icons/duotune/general/gen034.svg"}, {
                        "name": "gen035.svg",
                        "url": "/assets/icons/duotune/general/gen035.svg"
                    }, {"name": "gen036.svg", "url": "/assets/icons/duotune/general/gen036.svg"}, {
                        "name": "gen037.svg",
                        "url": "/assets/icons/duotune/general/gen037.svg"
                    }, {"name": "gen038.svg", "url": "/assets/icons/duotune/general/gen038.svg"}, {
                        "name": "gen039.svg",
                        "url": "/assets/icons/duotune/general/gen039.svg"
                    }, {"name": "gen040.svg", "url": "/assets/icons/duotune/general/gen040.svg"}, {
                        "name": "gen041.svg",
                        "url": "/assets/icons/duotune/general/gen041.svg"
                    }, {"name": "gen042.svg", "url": "/assets/icons/duotune/general/gen042.svg"}, {
                        "name": "gen043.svg",
                        "url": "/assets/icons/duotune/general/gen043.svg"
                    }, {"name": "gen044.svg", "url": "/assets/icons/duotune/general/gen044.svg"}, {
                        "name": "gen045.svg",
                        "url": "/assets/icons/duotune/general/gen045.svg"
                    }, {"name": "gen046.svg", "url": "/assets/icons/duotune/general/gen046.svg"}, {
                        "name": "gen047.svg",
                        "url": "/assets/icons/duotune/general/gen047.svg"
                    }, {"name": "gen048.svg", "url": "/assets/icons/duotune/general/gen048.svg"}, {
                        "name": "gen049.svg",
                        "url": "/assets/icons/duotune/general/gen049.svg"
                    }, {"name": "gen050.svg", "url": "/assets/icons/duotune/general/gen050.svg"}, {
                        "name": "gen051.svg",
                        "url": "/assets/icons/duotune/general/gen051.svg"
                    }, {"name": "gen052.svg", "url": "/assets/icons/duotune/general/gen052.svg"}, {
                        "name": "gen053.svg",
                        "url": "/assets/icons/duotune/general/gen053.svg"
                    }, {"name": "gen054.svg", "url": "/assets/icons/duotune/general/gen054.svg"}, {
                        "name": "gen055.svg",
                        "url": "/assets/icons/duotune/general/gen055.svg"
                    }, {"name": "gen056.svg", "url": "/assets/icons/duotune/general/gen056.svg"}, {
                        "name": "gen057.svg",
                        "url": "/assets/icons/duotune/general/gen057.svg"
                    }, {"name": "gen058.svg", "url": "/assets/icons/duotune/general/gen058.svg"}, {
                        "name": "gen059.svg",
                        "url": "/assets/icons/duotune/general/gen059.svg"
                    }, {"name": "gen060.svg", "url": "/assets/icons/duotune/general/gen060.svg"}, {
                        "name": "gen061.svg",
                        "url": "/assets/icons/duotune/general/gen061.svg"
                    }], "title": "SVG Duotune general"
                }, {
                    "svgs": [{
                        "name": "gra001.svg",
                        "url": "/assets/icons/duotune/graphs/gra001.svg"
                    }, {"name": "gra002.svg", "url": "/assets/icons/duotune/graphs/gra002.svg"}, {
                        "name": "gra003.svg",
                        "url": "/assets/icons/duotune/graphs/gra003.svg"
                    }, {"name": "gra004.svg", "url": "/assets/icons/duotune/graphs/gra004.svg"}, {
                        "name": "gra005.svg",
                        "url": "/assets/icons/duotune/graphs/gra005.svg"
                    }, {"name": "gra006.svg", "url": "/assets/icons/duotune/graphs/gra006.svg"}, {
                        "name": "gra007.svg",
                        "url": "/assets/icons/duotune/graphs/gra007.svg"
                    }, {"name": "gra008.svg", "url": "/assets/icons/duotune/graphs/gra008.svg"}, {
                        "name": "gra009.svg",
                        "url": "/assets/icons/duotune/graphs/gra009.svg"
                    }, {"name": "gra010.svg", "url": "/assets/icons/duotune/graphs/gra010.svg"}, {
                        "name": "gra011.svg",
                        "url": "/assets/icons/duotune/graphs/gra011.svg"
                    }, {"name": "gra012.svg", "url": "/assets/icons/duotune/graphs/gra012.svg"}],
                    "title": "SVG Duotune graphs"
                }, {
                    "svgs": [{
                        "name": "lay001.svg",
                        "url": "/assets/icons/duotune/layouts/lay001.svg"
                    }, {"name": "lay002.svg", "url": "/assets/icons/duotune/layouts/lay002.svg"}, {
                        "name": "lay003.svg",
                        "url": "/assets/icons/duotune/layouts/lay003.svg"
                    }, {"name": "lay004.svg", "url": "/assets/icons/duotune/layouts/lay004.svg"}, {
                        "name": "lay005.svg",
                        "url": "/assets/icons/duotune/layouts/lay005.svg"
                    }, {"name": "lay006.svg", "url": "/assets/icons/duotune/layouts/lay006.svg"}, {
                        "name": "lay007.svg",
                        "url": "/assets/icons/duotune/layouts/lay007.svg"
                    }, {"name": "lay008.svg", "url": "/assets/icons/duotune/layouts/lay008.svg"}, {
                        "name": "lay009.svg",
                        "url": "/assets/icons/duotune/layouts/lay009.svg"
                    }, {"name": "lay010.svg", "url": "/assets/icons/duotune/layouts/lay010.svg"}],
                    "title": "SVG Duotune layouts"
                }, {
                    "svgs": [{
                        "name": "map001.svg",
                        "url": "/assets/icons/duotune/maps/map001.svg"
                    }, {"name": "map002.svg", "url": "/assets/icons/duotune/maps/map002.svg"}, {
                        "name": "map003.svg",
                        "url": "/assets/icons/duotune/maps/map003.svg"
                    }, {"name": "map004.svg", "url": "/assets/icons/duotune/maps/map004.svg"}, {
                        "name": "map005.svg",
                        "url": "/assets/icons/duotune/maps/map005.svg"
                    }, {"name": "map006.svg", "url": "/assets/icons/duotune/maps/map006.svg"}, {
                        "name": "map007.svg",
                        "url": "/assets/icons/duotune/maps/map007.svg"
                    }, {"name": "map008.svg", "url": "/assets/icons/duotune/maps/map008.svg"}, {
                        "name": "map009.svg",
                        "url": "/assets/icons/duotune/maps/map009.svg"
                    }, {"name": "map010.svg", "url": "/assets/icons/duotune/maps/map010.svg"}],
                    "title": "SVG Duotune maps"
                }, {
                    "svgs": [{
                        "name": "med001.svg",
                        "url": "/assets/icons/duotune/medicine/med001.svg"
                    }, {
                        "name": "med002.svg",
                        "url": "/assets/icons/duotune/medicine/med002.svg"
                    }, {
                        "name": "med003.svg",
                        "url": "/assets/icons/duotune/medicine/med003.svg"
                    }, {
                        "name": "med004.svg",
                        "url": "/assets/icons/duotune/medicine/med004.svg"
                    }, {
                        "name": "med005.svg",
                        "url": "/assets/icons/duotune/medicine/med005.svg"
                    }, {
                        "name": "med006.svg",
                        "url": "/assets/icons/duotune/medicine/med006.svg"
                    }, {
                        "name": "med007.svg",
                        "url": "/assets/icons/duotune/medicine/med007.svg"
                    }, {
                        "name": "med008.svg",
                        "url": "/assets/icons/duotune/medicine/med008.svg"
                    }, {
                        "name": "med009.svg",
                        "url": "/assets/icons/duotune/medicine/med009.svg"
                    }, {"name": "med010.svg", "url": "/assets/icons/duotune/medicine/med010.svg"}],
                    "title": "SVG Duotune medicine"
                }, {
                    "svgs": [{
                        "name": "soc001.svg",
                        "url": "/assets/icons/duotune/social/soc001.svg"
                    }, {"name": "soc002.svg", "url": "/assets/icons/duotune/social/soc002.svg"}, {
                        "name": "soc003.svg",
                        "url": "/assets/icons/duotune/social/soc003.svg"
                    }, {"name": "soc004.svg", "url": "/assets/icons/duotune/social/soc004.svg"}, {
                        "name": "soc005.svg",
                        "url": "/assets/icons/duotune/social/soc005.svg"
                    }, {"name": "soc006.svg", "url": "/assets/icons/duotune/social/soc006.svg"}, {
                        "name": "soc007.svg",
                        "url": "/assets/icons/duotune/social/soc007.svg"
                    }, {"name": "soc008.svg", "url": "/assets/icons/duotune/social/soc008.svg"}, {
                        "name": "soc009.svg",
                        "url": "/assets/icons/duotune/social/soc009.svg"
                    }, {"name": "soc010.svg", "url": "/assets/icons/duotune/social/soc010.svg"}],
                    "title": "SVG Duotune social"
                }, {
                    "svgs": [{
                        "name": "teh001.svg",
                        "url": "/assets/icons/duotune/technology/teh001.svg"
                    }, {
                        "name": "teh002.svg",
                        "url": "/assets/icons/duotune/technology/teh002.svg"
                    }, {
                        "name": "teh003.svg",
                        "url": "/assets/icons/duotune/technology/teh003.svg"
                    }, {
                        "name": "teh004.svg",
                        "url": "/assets/icons/duotune/technology/teh004.svg"
                    }, {
                        "name": "teh005.svg",
                        "url": "/assets/icons/duotune/technology/teh005.svg"
                    }, {
                        "name": "teh006.svg",
                        "url": "/assets/icons/duotune/technology/teh006.svg"
                    }, {
                        "name": "teh007.svg",
                        "url": "/assets/icons/duotune/technology/teh007.svg"
                    }, {
                        "name": "teh008.svg",
                        "url": "/assets/icons/duotune/technology/teh008.svg"
                    }, {
                        "name": "teh009.svg",
                        "url": "/assets/icons/duotune/technology/teh009.svg"
                    }, {"name": "teh010.svg", "url": "/assets/icons/duotune/technology/teh010.svg"}],
                    "title": "SVG Duotune technology"
                }, {
                    "svgs": [{
                        "name": "txt001.svg",
                        "url": "/assets/icons/duotune/text/txt001.svg"
                    }, {"name": "txt002.svg", "url": "/assets/icons/duotune/text/txt002.svg"}, {
                        "name": "txt003.svg",
                        "url": "/assets/icons/duotune/text/txt003.svg"
                    }, {"name": "txt004.svg", "url": "/assets/icons/duotune/text/txt004.svg"}, {
                        "name": "txt005.svg",
                        "url": "/assets/icons/duotune/text/txt005.svg"
                    }, {"name": "txt006.svg", "url": "/assets/icons/duotune/text/txt006.svg"}, {
                        "name": "txt007.svg",
                        "url": "/assets/icons/duotune/text/txt007.svg"
                    }, {"name": "txt008.svg", "url": "/assets/icons/duotune/text/txt008.svg"}, {
                        "name": "txt009.svg",
                        "url": "/assets/icons/duotune/text/txt009.svg"
                    }, {"name": "txt010.svg", "url": "/assets/icons/duotune/text/txt010.svg"}],
                    "title": "SVG Duotune text"
                }
            ],
        }
    },
    methods: {
        setIcon(icon, svg) {
            this.$emit("setIcon", icon, svg, false);
        },

        setIconClass(e) {
            this.$emit("setIcon", e.target.value, false, true);
        }
    },
    computed: {
        lang() {
            const labels = ['search'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },

        filteredIcons() {
            let iconGroup = [];
            if (this.iconSearch !== null && this.iconSearch != "") {
                this.iconData.forEach(group => {
                    if (group.hasOwnProperty("icons")) {
                        let icons = group.icons.filter(icon => icon.toLowerCase().includes(this.iconSearch.toLowerCase()));
                        if (icons.length >= 1) {
                            iconGroup.push({
                                title: group.title,
                                icons: icons
                            })
                        }
                    } else {
                        let svgs = group.svgs.filter(icon => icon.url.toLowerCase().includes(this.iconSearch.toLowerCase()));
                        if (svgs.length >= 1) {
                            iconGroup.push({
                                title: group.title,
                                svgs: svgs
                            })
                        }
                    }

                });
            } else {
                return this.iconData
            }
            return iconGroup;
        },
    }
}
</script>

<style scoped>

</style>
