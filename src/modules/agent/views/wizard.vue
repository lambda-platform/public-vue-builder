<template>
    <div id="wizard">
        <div class="wizard-title">
            <span class="wizard-title-main">{{ lang.confirm_registration_information }}</span>
            <div class="wizard-title-step">{{ lang.step }}
                <span>{{current+1}}</span>
            </div>
        </div>
        <Form :model="profile" label-position="top">
            <section class="wizard">
                <div class="info-form" v-if="current < 3">
                    <Form :model="profile" ref="refName0" :rules="rulePersonal" label-position="top">
                        <div v-show="current == 0">
                            <div class="sub-heading">
                                <div class="sub-heading-content">
                                    <div class="sub-heading-content-left">
                                        <i class="mdi mdi-face mdi-18px"></i>
                                        <h4>{{ _components.personalInformation }}</h4>
                                    </div>
                                    <div class="sub-heading-content-right">
                                        <span>{{ lang.hello }}</span>
                                        <h4>{{ user.login}}</h4>
                                    </div>
                                </div>
                                <div class="sub-heading-border">
                                    <span class="border-line-personal"></span>
                                </div>
                            </div>
                            <div class="info-step-main">
                                <FormItem :label="lang.your_name" prop="first_name">
                                    <Row :gutter="16">
                                        <Col span="12">
                                        <Input type="text" v-model="profile.first_name"></Input>
                                        </Col>
                                        <Col span="12">
                                        <span class="user-info-text">{{ lang.name_desc }}</span>
                                        </Col>
                                    </Row>
                                </FormItem>
                                <FormItem :label="lang.your_last_name" prop="last_name">
                                    <Row :gutter="16">
                                        <Col span="12">
                                        <Input type="text" v-model="profile.last_name"></Input>
                                        </Col>
                                        <Col span="12">
                                        <span class="user-info-text">{{ lang.last_name_desc }}</span>
                                        </Col>
                                    </Row>
                                </FormItem>
                                <Row :gutter="16" class="birthday-gender">
                                    <Col span="12">
                                    <FormItem :label="lang.your_birthday" prop="birthday" class="birthday">
                                        <DatePicker type="date" :placeholder="lang.your_birthday" style="width: 100%" @on-change="birthday"></DatePicker>
                                    </FormItem>
                                    </Col>
                                    <Col span="12">
                                    <FormItem :label="lang.your_gender" prop="gender" style="margin-left: 10px" class="gender">
                                        <Select v-model="profile.gender">
                                            <Option value="m">{{ lang.man }}</Option>
                                            <Option value="f">{{ lang.women }}</Option>
                                        </Select>
                                    </FormItem>
                                    </Col>
                                </Row>
                                <FormItem :label="lang._register" prop="register_number" class="register_number">
                                    <Row :gutter="16">
                                        <Col span="12">
                                        <Input type="text" v-model="profile.register_number"></Input>
                                        </Col>
                                        <Col span="12">
                                        <span class="user-info-text">{{ lang.register_desc }} <br>
                                            <strong>{{ lang.example }}: ЧЖ78052418.</strong>
                                        </span>
                                        </Col>
                                        <!--<div class="ivu-form-item-error-tip" v-if="error.register_number">{{ error.register_number.detail }}</div>-->
                                        <!--<div v-else></div>-->
                                    </Row>
                                </FormItem>
                            </div>
                        </div>
                    </Form>
                    <Form :model="profile" ref="refName1" :rules="ruleContact" label-position="top">
                        <div v-show="current == 1">
                            <div class="sub-heading">
                                <div class="sub-heading-content">
                                    <div class="sub-heading-content-left">
                                        <i class="mdi mdi-contact-mail mdi-18px"></i>
                                        <h4>{{ lang.contact_information }}</h4>
                                    </div>
                                    <div class="sub-heading-content-right">
                                        <span>{{ lang.hello }}</span>
                                        <h4>{{ user.login}}</h4>
                                    </div>
                                </div>
                                <div class="sub-heading-border">
                                    <span class="border-line-contact"></span>
                                </div>
                            </div>
                            <div class="info-step-main">
                                <FormItem :label="lang.your_email_address" prop="email">
                                    <Row :gutter="16">
                                        <Col span="12">
                                        <Input type="email" v-model="profile.email"></Input>
                                        </Col>
                                        <Col span="12">
                                        <span class="user-info-text">{{ lang.email_desc }}</span>
                                        </Col>
                                        <!--<div class="ivu-form-item-error-tip" v-if="error.email">{{ error.email.detail }}</div>-->
                                        <!--<div v-else></div>-->
                                    </Row>
                                </FormItem>
                                <FormItem :label="lang.your_phone_number" prop="phone">
                                    <Row :gutter="16">
                                        <Col span="12">
                                        <Input type="text" v-model="profile.phone"></Input>
                                        </Col>
                                        <Col span="12">
                                        <span class="user-info-text">{{ lang.phone_desc }}
                                            <strong>{{ lang.example }}: 99118877</strong>
                                        </span>
                                        </Col>
                                    </Row>
                                </FormItem>
                                <FormItem :label="lang.profile_image" prop="avatar">
                                    <Row :gutter="16">
                                        <Col span="12">
                                        <Upload action="/agent/users/upload" :on-success="success" :format="['jpg','jpeg','png','JPG','PNG','GIF','JPEG','gif']" :max-size="1024">
                                            <Button icon="ios-cloud-upload-outline" class="upload-avatar">{{lang.profile_image_uploud}}</Button>
                                        </Upload>
                                        </Col>
                                        <Col span="12">
                                        <span class="user-info-text">{{ lang.profile_desc }}</span>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </div>
                        </div>
                    </Form>
                    <Form :model="profile" ref="refName2" :rules="rulePassword" label-position="top">
                        <div v-show="current == 2">
                            <div class="sub-heading">
                                <div class="sub-heading-content">
                                    <div class="sub-heading-content-left">
                                        <i class="mdi mdi-key-variant mdi-18px"></i>
                                        <h4>{{ _components.changePassword }}</h4>
                                    </div>
                                    <div class="sub-heading-content-right">
                                        <span>{{ lang.hello }}</span>
                                        <h4>{{ user.login}}</h4>
                                    </div>
                                </div>
                                <div class="sub-heading-border">
                                    <span class="border-line-password"></span>
                                </div>
                            </div>
                            <div class="info-step-main">
                                <FormItem :label="lang.your_new_password" prop="password">
                                    <Row :gutter="16">
                                        <Col span="12">
                                        <Input type="password" v-model="profile.password">
                                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                        </Input>
                                        </Col>
                                        <Col span="12">
                                        <span class="user-info-text">{{ lang.password_desc }}</span>
                                        </Col>
                                    </Row>
                                </FormItem>
                                <FormItem :label="lang.rep_your_new_password" prop="passwordCheck">
                                    <Row :gutter="16">
                                        <Col span="12">
                                        <Input type="password" v-model="profile.passwordCheck">
                                            <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                        </Input>
                                        </Col>
                                        <Col span="12">
                                        <span class="user-info-text">{{ lang.password_desc }}</span>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </div>
                        </div>
                    </Form>
                    <div class="step-buttons">
                        <a :class="prevDisabled ? 'disabled' : ''" @click="prev()" id="prev">
                            <i class="mdi mdi-chevron-left mdi-18px"></i>{{ lang._prev }}</a>
                        <a :class="nextDisabled ? 'disabled' : ''" @click="next()" id="next">{{ lang._next }}
                            <i class="mdi mdi-chevron-right mdi-18px"></i>
                        </a>
                    </div>
                </div>
                <div class="info-step" v-if="current < 3">
                    <div class="info-step-top">
                        <Steps :current="current">
                            <Step></Step>
                            <Step></Step>
                            <Step></Step>
                        </Steps>
                    </div>
                    <div class="info-step-content" v-if="current == 0">
                        <i class="mdi mdi-face"></i>
                        <p>{{ _components.personalInformation }}</p>
                        <span>{{ lang.enter_personal_information }}</span>
                    </div>
                    <div class="info-step-content" v-if="current == 1">
                        <i class="mdi mdi-contact-mail"></i>
                        <p>{{ lang.contact_information }}</p>
                        <span>{{ lang.enter_contact_information }}</span>
                    </div>
                    <div class="info-step-content" v-if="current == 2">
                        <i class="mdi mdi-account-key"></i>
                        <p>{{ _components.changePassword }}</p>
                        <span>{{ lang.please_change_your_password }}</span>
                    </div>
                    <div class="info-step-bottom">
                        <p>
                            <i class="mdi mdi-help-circle-outline mdi-18px"></i>
                            {{ lang.please_contact_system_administor }}
                        </p>
                        <!--<a href="mailto:support@bitsoft.mn">support@bitsoft.mn</a>-->
                    </div>
                </div>
                <div class="summary" v-if="current == 3">
                    <a href="javascript:void(0)" @click="prev" class="back">
                        <Icon type="ios-arrow-back"></Icon>
                        <span>{{ lang.back }}</span>
                    </a>
                    <div class="summary-content">
                        <div class="summary-content-title">{{ lang.entered_information }}
                            <p>{{ lang.information_alert }}</p>
                        </div>
                        <div class="user-avatar">
                            <template v-if="profile != null && profile.avatar != null && profile.avatar != ''">
                                <img :src="profile.avatar" alt="" width="80" class="user-avatar-img">
                            </template>
                            <template v-else>
                                <img src="/assets/lambda/images/avatar.png" alt="" width="80" class="user-avatar-img">
                            </template>
                        </div>
                        <div class="user-content">
                            <ul class="user-content-list-left">
                                <li>
                                    <div class="user-content-list-icon">
                                        <i class="mdi mdi-account mdi-24px"></i>
                                    </div>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{ lang.your_name }}</span>
                                        <span class="user-content-list-data">
                                            <template v-if="isValid(profile.first_name)">{{ profile.first_name}}</template>
                                            <template v-else>
                                                <span class="user-no-data-list">{{ lang.no_information }}</span>
                                            </template>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="user-content-list-icon">
                                        <i class="mdi mdi-contacts mdi-24px"></i>
                                    </div>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{ lang.your_birthday }}</span>
                                        <span class="user-content-list-data">
                                            <template v-if="isValid(profile.birthday)">{{ profile.birthday}}</template>
                                            <template v-else>
                                                <span class="user-no-data-list">{{ lang.no_information }}</span>
                                            </template>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="user-content-list-icon">
                                        <i class="mdi mdi-gender-male-female mdi-24px"></i>
                                    </div>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{ lang.your_gender }}</span>
                                        <span class="user-content-list-data">
                                            <template v-if="isValid(profile.gender) && profile.gender === 'm'">{{ lang.man }}</template>
                                            <template v-else-if="isValid(profile.gender) && profile.gender === 'f'">{{ lang.women }}</template>
                                            <template v-else="!isValid(profile.gender)">
                                                <span class="user-no-data-list">{{ lang.no_information }}</span>
                                            </template>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="user-content-list-icon">
                                        <i class="mdi mdi-email-outline mdi-24px"></i>
                                    </div>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{ lang.your_email_address }}</span>
                                        <span class="user-content-list-data">
                                            <template v-if="isValid(profile.email)">{{ profile.email}}</template>
                                            <template v-else>
                                                <span class="user-no-data-list">{{ lang.no_information }}</span>
                                            </template>
                                        </span>
                                    </div>
                                </li>
                            </ul>
                            <ul class="user-content-list-right">
                                <li>
                                    <div class="user-content-list-icon">
                                        <i class="mdi mdi-account mdi-24px"></i>
                                    </div>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{ lang.your_last_name }}</span>
                                        <span class="user-content-list-data">
                                            <template v-if="isValid(profile.last_name)">{{profile.last_name}}</template>
                                            <template v-else>
                                                <span class="user-no-data-list">{{ lang.no_information }}</span>
                                            </template>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="user-content-list-icon">
                                        <i class="mdi mdi-account-card-details mdi-24px"></i>
                                    </div>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{ lang._register }}</span>
                                        <span class="user-content-list-data">
                                            <template v-if="isValid(profile.register_number)">{{ profile.register_number}}</template>
                                            <template v-else>
                                                <span class="user-no-data-list">{{ lang.no_information }}</span>
                                            </template>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="user-content-list-icon">
                                        <i class="mdi mdi-cellphone-iphone mdi-24px"></i>
                                    </div>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{ lang.your_phone_number }}</span>
                                        <span class="user-content-list-data">
                                            <template v-if="isValid(profile.phone)">{{ profile.phone}}</template>
                                            <template v-else>
                                                <span class="user-no-data-list">{{ lang.no_information }}</span>
                                            </template>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div class="user-content-list-icon">
                                        <i class="mdi mdi-calendar-plus mdi-24px"></i>
                                    </div>
                                    <div class="user-content-list-content">
                                        <span class="user-content-list-heading">{{ lang.date_you_added_system }}</span>
                                        <span class="user-content-list-data">{{ setMoment(user.created_at) }}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <Button type="success" shape="circle" @click="submit()" class="profile-submit">{{lang.send_registration}}</Button>
                    </div>
                </div>
            </section>
        </Form>
        <div class="footer">
            <span>© {{ new Date().getFullYear() }} </span>
            <span v-html="getCopyright()"></span>
            <!--<span> - Системийг хөгжүүлсэн: </span>-->
            <!--<a href="http://www.bitsoft.mn" target="_blank">-->
                <!--<strong> Битсофт ХХК</strong>-->
            <!--</a>-->
        </div>
    </div>
</template>
<script>
import moment from "moment";
export default {
    name: "wizard",
    data() {
        const validateRegisterNumber = (rule, value, callback) => {
            var whiteSpace = /\s/g;
            var digit = /[^\u0400-\u04ff0-9]/g;
            if (whiteSpace.test(value)) {
                callback(new Error("Хоосон зай орсон байна"));
            } else if (digit.test(value)) {
                callback(new Error("Монгол үсэг болон тоон утга ашиглана уу"));
            } else {
                callback();
            }
        };
        const validatePhone = (rule, value, callback) => {
            var whiteSpace = /\s/g;
            var digit = /[^0-9]/g;
            if (digit.test(value)) {
                callback(new Error("Тоон утга бичнэ үү"));
            } else if (whiteSpace.test(value)) {
                callback(new Error("Хоосон зай орсон байна"));
            } else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            var whiteSpace = /\s/g;
            if (value === "") {
                callback(new Error("Та нууц үгээ бичнэ үү"));
            } else if (whiteSpace.test(value)) {
                callback(new Error("Хоосон зай орсон байна"));
            } else {
                if (this.profile.passwordCheck !== "") {
                    this.$refs.refName2.validateField("passwordCheck");
                }
                callback();
            }
        };
        const validatePasswordCheck = (rule, value, callback) => {
            var whiteSpace = /\s/g;
            if (value === "") {
                callback(new Error("Та нууц үгээ давтан бичнэ үү"));
            } else if (whiteSpace.test(value)) {
                callback(new Error("Хоосон зай орсон байна"));
            } else if (value !== this.profile.password) {
                callback(
                    new Error(
                        "Таны бичсэн нууц үг ижил биш байна. Хоёулаа ижил байх ёстой."
                    )
                );
            } else {
                callback();
            }
        };
        return {
            refName: "refName0",
            user: {},
            current: 0,
            prevDisabled: true,
            nextDisabled: false,
            profile: {
                first_name: null,
                last_name: null,
                birthday: null,
                gender: null,
                register_number: null,
                avatar: null,
                email: null,
                phone: null,
                password: null,
                passwordCheck: null
            },
            rulePersonal: {
                first_name: [
                    {
                        required: true,
                        message: "Та нэрээ бичнэ үү",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        message:
                            "Таны нэр хамгийн багадаа 2 үсгээс багагүй байх ёстой!",
                        trigger: "blur"
                    },
                    {
                        max: 75,
                        message:
                            "Таны нэр хамгийн ихдээ 75 үсгээс ихгүй байх ёстой!",
                        trigger: "blur"
                    }
                ],
                last_name: [
                    {
                        required: true,
                        message: "Та овгоо бичнэ үү aaa",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        message:
                            "Таны овог хамгийн багадаа 2 үсгээс багагүй байх ёстой!",
                        trigger: "blur"
                    },
                    {
                        max: 75,
                        message:
                            "Таны овог хамгийн ихдээ 75 үсгээс ихгүй байх ёстой!",
                        trigger: "blur"
                    }
                ],
                birthday: [
                    {
                        required: true,
                        message: "Төрсөн огноогоо сонгоно уу",
                        trigger: "change"
                    }
                ],
                gender: [
                    {
                        required: true,
                        message: "Хүйсээ сонгоно уу",
                        trigger: "change"
                    }
                ],
                register_number: [
                    {
                        required: true,
                        message: "Регистерийн дугаараа оруулна уу",
                        trigger: "blur"
                    },
                    {
                        max: 10,
                        min: 10,
                        message:
                            "10 тэмдэгтээс бүрдсэн утга оруулна уу. Жишээ нь: ЧЖ78052418",
                        trigger: "blur"
                    },
                    { validator: validateRegisterNumber, trigger: "blur" }
                ]
            },
            ruleContact: {
                email: [
                    {
                        required: true,
                        message: "Та e-mail хаягаа бичнэ үү",
                        trigger: "blur"
                    },
                    {
                        type: "email",
                        message: "Та зөв e-mail хаяг бичнэ үү",
                        trigger: "blur"
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: "Та утасны дугаараа бичнэ үү",
                        trigger: "blur"
                    },
                    { validator: validatePhone, trigger: "blur" },
                    {
                        min: 8,
                        max: 8,
                        message: "Гар утасны дугаар 8 оронтой байх ёстой!",
                        trigger: "blur"
                    }
                ]
            },
            rulePassword: {
                password: [
                    {
                        required: true,
                        message: "Та нууц үгээ бичнэ үү.",
                        trigger: "blur"
                    },
                    {
                        min: 8,
                        message:
                            "Нууц үг хамгийн багадаа 8 тэмдэгтээс багагүй байна!",
                        trigger: "blur"
                    },
                    {
                        max: 60,
                        message:
                            "Нууц үг хамгийн ихдээ 60 тэмдэгтээс ихгүй байна!",
                        trigger: "blur"
                    },
                    { validator: validatePassword, trigger: "blur" }
                ],
                passwordCheck: [
                    {
                        required: true,
                        message: "Та нууц үгээ давтан бичнэ үү.",
                        trigger: "blur"
                    },
                    {
                        min: 8,
                        message:
                            "Нууц үг хамгийн багадаа 8 тэмдэгтээс багагүй байна!",
                        trigger: "blur"
                    },
                    {
                        max: 60,
                        message:
                            "Нууц үг хамгийн ихдээ 60 тэмдэгтээс ихгүй байна!",
                        trigger: "blur"
                    },
                    { validator: validatePasswordCheck, trigger: "blur" }
                ]
            }
        };
    },
    created() {
        this.user = window.init.user;


    },
    computed: {
        lang() {
            const labels = [
                'confirm_registration_information',
                'step',
                'hello',
                'your_name',
                'your_last_name',
                'name_desc',
                'last_name_desc',
                'your_birthday',
                'your_gender',
                'women',
                'man',
                '_register',
                'register_desc',
                'example',
                'contact_information',
                'your_email_address',
                'email_desc',
                'your_phone_number',
                'phone_desc',
                'profile_image',
                'profile_desc',
                'your_new_password',
                'password_desc',
                'rep_your_new_password',
                '_prev',
                '_next',
                'enter_personal_information',
                'enter_contact_information',
                'please_change_your_password',
                'please_contact_system_administor',
                'back',
                'entered_information',
                'information_alert',
                'no_information',
                'date_you_added_system',
                'send_registration',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('agent_wizard.' + labels[i]);
                return obj;
            }, {});
        },
        _components() {
            const labels = [
                'personalInformation',
                'changePassword',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('components.' + labels[i]);
                return obj;
            }, {});
        },
    },
    methods: {
        getCopyright() {

            return window.config ? window.config.copyright : ``;
        },
        next() {
            this.$refs[this.refName].validate(valid => {
                if (valid) {
                    this.prevDisabled = false;
                    if (this.current > 2) {
                        this.nextDisabled = true;
                    } else {
                        this.current += 1;
                        this.refName = "refName" + this.current;
                        if (this.current > 2) {
                            this.nextDisabled = true;
                        }
                    }
                }
            });
        },
        prev() {
            this.nextDisabled = false;
            if (this.current == 0) {
                this.prevDisabled = true;
            } else {
                this.current -= 1;
                this.refName = "refName" + this.current;
                if (this.current == 0) {
                    this.prevDisabled = true;
                }
            }
        },
        birthday(value) {
            this.profile.birthday = moment(value).format("YYYY-MM-DD");
        },
        success(val) {
            this.profile.avatar = val;
        },
        isValid(val) {
            return typeof undefined !== val && val !== null && val !== "";
        },
        setMoment(date) {
            return moment(date).format("YYYY-MM-DD");
        },

        submit() {
            let postData = {
                id: this.user.id,
                ...this.profile
            };

            axios.post("/agent/wizard/create", postData).then(response => {
                if (response.data.status) {
                    this.$Message.success(
                        "Таны мэдээлэл амжилттай бүртгэгдлээ. Түр хүлээнэ үү"
                    );
                    setTimeout(() => {
                        window.location = response.data.path;
                    }, 1000);
                } else {
                    this.$Message.error("Серверт алдаа гарлаа");
                }
            });
        }
    }
};
</script>
