<template>
    <subheader>
        <div slot="left">
            <h3 class="title">
                {{ title }}
            </h3>
        </div>
        <div slot="right">
            <ul>
                <li>
                    <Badge dot>
                        <a href="#" class="demo-badge">
                            <Icon type="ios-bell-outline"></Icon>
                        </a>
                    </Badge>
                </li>

                <li>
                    <Poptip placement="bottom-end">
                        <a href="javascript:void(0)">
                            <Icon type="ios-keypad"></Icon>
                        </a>
                        <div class="header-apps" slot="content">
                            <Tabs value="apps" size="small">
                                <TabPane :label="lang.applications" name="apps">
                                    <Row>
                                        <Col span="8">
                                        <a href="/logistic">
                                            <img src="/images/apps/github.png" alt="">
                                            <span>CMS</span>
                                        </a>
                                        </Col>
                                        <Col span="8">
                                        <a href="/logistic">
                                            <img src="/images/apps/slack.png" alt="">
                                            <span>HR</span>
                                        </a>
                                        </Col>
                                        <Col span="8">
                                        <a href="/logistic">
                                            <img src="/images/apps/bitbucket.png" alt="">
                                            <span>CRM</span>
                                        </a>
                                        </Col>

                                        <Col span="8">
                                        <a href="/logistic">
                                            <img src="/images/apps/dribbble.png" alt="">
                                            <span>{{lang.logistics}}</span>
                                        </a>
                                        </Col>
                                        <Col span="8">
                                        <a href="/logistic">
                                            <img src="/images/apps/mail_chimp.png" alt="">
                                            <span>{{ lang.letter }}</span>
                                        </a>
                                        </Col>
                                        <Col span="8">
                                        <a href="/logistic">
                                            <img src="/images/apps/dropbox.png" alt="">
                                            <span>{{ lang.fileDirectory }}</span>
                                        </a>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane :label="lang.additions" name="plugins">
                                    <Row>
                                        <Col span="8">
                                        <a href="/lambda/puzzle">
                                            <img src="/images/apps/github.png" alt="">
                                            <span>{{ lang.ui_builder }}</span>
                                        </a>
                                        </Col>
                                        <Col span="8">
                                        <a href="/logistic">
                                            <img src="/images/apps/mail_chimp.png" alt="">
                                            <span>{{ lang._form }}</span>
                                        </a>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Poptip>
                </li>

                <li class="avatar-item">
                    <Poptip placement="bottom-end">
                        <a href="javascript:void(0)" class="avatar">
                            <img src="/assets/lambda/images/avatar.png" alt="avatar" class="avatar">
                        </a>
                        <div class="header-profile" slot="content">
                            <div class="header-profile-info">
                                <h3>{{lang.admin}}</h3>
                                <small>{{lang.systemAdministrator}}</small>
                            </div>
                            <ul>
                                <li>
                                    <a href="#">
                                        <Icon type="ios-color-filter-outline"></Icon>
                                        <span>{{lang.personalInformation}}</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <Icon type="ios-gear-outline"></Icon>
                                        <span>{{ lang.settings }}</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <Icon type="ios-locked-outline"></Icon>
                                        <span>{{lang.logOut}}</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </Poptip>
                </li>
            </ul>
        </div>
    </subheader>
</template>
<script>
    import {loadLanguageAsync} from "../locale/index";

    export default {
        props: ["title"],
        methods: {
            beforeMount() {
                if (this.selectedLang != "mn") {
                    loadLanguageAsync(this.selectedLang);
                }
            },
            switchLanguage(val) {
                this.selectedLang = val;
                loadLanguageAsync(val);
            },
        },
        computed: {
            lang() {
                const labels = ['applications', 'additions', 'logistics', 'letter', 'fileDirectory', 'admin', 'systemAdministrator', 'personalInformation','settings', 'logOut', 'ui_builder', '_form'];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('components.' + labels[i]);
                    return obj;
                }, {});
            },
        }
    };
</script>

