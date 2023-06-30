import {element} from './elements'
import {getRule, setModel, setIdentity} from './rule'
import {dataFromTemplate} from './utils/formula.js'
import {doFormula, doTrigger} from './utils/formula_and_trigger.js'
import {evalstr, isValid} from './utils/methods.js'
import {getRelationData} from './utils/helpers.js'

export default {
    name: 'dataform',
    props: [
        'projectID',
        'schemaID',
        'editMode',
        'onReady',
        'onSuccess',
        'onError',
        'onClose',
        'beforeSubmit',
        'permissions',
        'user_condition',
        'formCustomData',
        'do_render',
        'isSubForm',
        'url',
        'page_id',
        'public',
        'title',
        'close',
        'template',
        'step'
    ],
    data() {
        return {
            isIos: !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform),
            formTitle: '',
            loadConfig: true,
            viewMode: false,
            asyncMode: false,
            save_btn_text: '',
            formValidationCustomText: '',
            meta: {
                model: '',
                option: {}
            },
            model: {},
            schema: [],
            formType: 'normal',
            ui: {},
            formula: [],
            rule: {},
            identity: null,
            dataID: null,
            relations: {},
            showInfo: false,
            infoUrl: '',
            infoTitle: '',
            showID: window.init ? window.init.showID ? window.init.showID : undefined : undefined,
            subFormValidations: [],
            extraButtons: [],
            disableReset: false,
            withBackButton: false,
            scrollOptions: {
                height: '100%'
            },
            currentStep: 0,
            step: {},
        }
    },

    computed: {
        baseUrl() {
            return this.$props.url ? this.$props.url : ''
        },
        submitUrl() {
            return this.editMode
                ? this.page_id ? `${this.baseUrl}/lambda/krud/${this.$props.schemaID}/update/${this.dataID}?page_id=${this.page_id}` : `${this.baseUrl}/lambda/krud/${this.$props.schemaID}/update/${this.dataID}`
                : this.page_id ? `${this.baseUrl}/lambda/krud/${this.$props.schemaID}/store?page_id=${this.page_id}` : `${this.baseUrl}/lambda/krud${this.optionUrl}/${this.$props.schemaID}/store`
        },
        optionUrl() {
            if (this.public === true) {
                return '-public'
            } else {
                return ''
            }
        },
        lang() {
            const labels = ['save', 'pleaseWait', 'resetFrom', 'close', 'pleaseEnterPasswordYouUCurrentlyUsing', 'pleaseReEnterYourPassword',
                'passwordConfirmError', 'informationIsIncomplete', 'trRMandatoryFieldsFillInformationLookFormAFillRequiredFieldsWithRedBorder',
                'successfullySaved', 'errorSaving'
            ]
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i])
                return obj
            }, {})
        }

    },

    created() {
        window.showInformationModal = this.showInformationModal
        if (this.schemaID) {
            this.initForm()
        }
    },

    watch: {
        src(val, oldValue) {
            this.initForm()
        },

        editMode(val) {
            if (!val) {
                this.handleReset(this.meta.model + '-' + this.schemaID)
            }
        },

        do_render(val) {
            if (!val) {
                this.viewMode = false
                this.handleReset(this.meta.model + '-' + this.schemaID)
            }
        },

        schemaID(val) {
            if (val) {
                this.initForm()
            }
        },

        ui(val) {
            if (val && this.dataID) {
                this.editModel(this.dataID)
            }
        }
    },

    methods: {
        createWithTemplate(template) {
            return dataFromTemplate(template, this.model)
        },

        isVisibleSection(col) {
            let showAbleFields = this.showAbleFields(col.children)
            if (col.type == 'section' && showAbleFields) {
                if (col.visibleUserRoles && showAbleFields) {
                    if (Array.isArray(col.visibleUserRoles) && showAbleFields) {
                        if (col.visibleUserRoles.length >= 1 && window.init.user && showAbleFields) {
                            if (col.visibleUserRoles.findIndex(role => role == window.init.user.role) >= 0 && showAbleFields) {
                                return true
                            } else {
                                return false
                            }
                        } else {
                            return true
                        }
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            } else if (col.type == 'col') {
                return false;
            } else {
                return false
            }
        },

        showAbleFields(items) {
            for (let item of items) {
                if (item.type == 'form' || item.type == 'Form') {
                    if (this.isShow(item.model)) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    if (item.formType == 'SubForm') {
                        return true
                    } else {
                        if (item.type == 'row') {
                            let showableFieldFound = false
                            for (let col of item.children) {
                                let fieldShowAble = this.showAbleFields(col.children)
                                if (fieldShowAble) {
                                    showableFieldFound = true
                                }
                            }
                            return showableFieldFound
                        } else {
                            if (item.hasOwnProperty('children')) {
                                let showAbleChild = this.showAbleFields(item.children)
                                if (showAbleChild) {
                                    return true
                                } else {
                                    return false
                                }
                            } else {
                                if (this.isShow(item.model)) {
                                    return true
                                } else {
                                    return false
                                }
                            }
                        }
                    }
                }
            }
        },
        element: element,
        evalstr: evalstr,
        isValid: isValid,

        isShow(model) {
            let index = this.schema.findIndex(item => item.model == model)
            if (index >= 0) {
                if (this.schema[index].hidden) {
                    return false
                } else
                    return true
            }
            return true
        },

        afterChange(model, val, oldValue) {
            doTrigger(model, val, this.model, this.schema, this.$refs, this.$Notice, this.editMode)
            if (this.do_render) {
                if (val != oldValue) {
                    doFormula(this.formula, model, this.model, this.schema, this.rule, false)
                }
            }
        },

        clearConfig() {
            this.model = {}
            this.schema = []
            this.ui = {}
            this.formula = []
            this.rule = {}
            this.dataID = null
        },

        async initFromServerData(userCondition) {
            let configUrl = this.baseUrl + `/lambda/puzzle/schema${this.optionUrl}/form/${this.$props.schemaID}`
            if (this.projectID) {
                configUrl = this.baseUrl + `/lambda/puzzle/project/${this.projectID}/form/${this.$props.schemaID}`
            }
            configUrl += userCondition.length == 0 ? '' : `/${userCondition}`
            try {
                let response = await axios.get(configUrl)
                let data = JSON.parse(response.data.data.schema)

                data['form_id'] = response.data.data.id
                data['form_name'] = response.data.data.name
                return data
            } catch (e) {
                console.error(e.message)
                return undefined
            }
        },

        async initForm() {
            // this.clearConfig();
            let userCondition = []

            if (this.user_condition) {
                userCondition = JSON.stringify(this.user_condition)
            }

            let formSchema = {}
            if (window.init) {
                if (window.init.formSchemas) {
                    if (window.init.formSchemas[this.$props.schemaID]) {
                        formSchema = window.init.formSchemas[this.$props.schemaID]
                    } else {
                        formSchema = await this.initFromServerData(userCondition)
                    }
                } else {
                    formSchema = await this.initFromServerData(userCondition)
                }
            } else {
                formSchema = await this.initFromServerData(userCondition)
            }

            this.identity = formSchema.identity
            this.schema = formSchema.schema
            this.formType = formSchema.formType;
            if (formSchema.step) {
                this.step = formSchema.step;
            }

            this.ui = formSchema.ui
            if (formSchema.save_btn_text) {
                this.save_btn_text = formSchema.save_btn_text
            }
            if (formSchema.formValidationCustomText) {
                this.formValidationCustomText = formSchema.formValidationCustomText
            }

            if (formSchema.formula) {
                this.formula = formSchema.formula
            }
            if (formSchema.extraButtons) {
                this.extraButtons = formSchema.extraButtons
            }
            if (formSchema.disableReset) {
                this.disableReset = formSchema.disableReset
            }
            if (formSchema.withBackButton) {
                this.withBackButton = formSchema.withBackButton
            }

            this.formTitle = formSchema.form_name
            this.meta = {
                model: formSchema.model,
                option: {
                    labelPosition: formSchema.labelPosition,
                    labelWidth: formSchema.labelWidth
                }
            }

            this.getOptionsData(formSchema.schema)
            this.setUiSchemaFormItem(formSchema.ui.schema)
            this.setHiddenItemModel(formSchema.schema)

            setModel(formSchema.model)
            this.setUserConditionValues(true)
            this.setCustomData()
            this.loadConfig = false

            if (this.$props.onReady) {
                this.$props.onReady(formSchema, this.schema)
            }
        },

        setHiddenItemModel(schema) {
            schema.forEach(item => {
                    if (item.hidden || item.disabled) {
                        if (this.isValid(item.default)) {
                            this.setModel(item.model, item.default, item.formType)
                        }

                        if (item.hasUserId) {
                            this.setModel(item.model, window.init.user.id * 1, item.formType)
                        }
                        if (item.fillByUserField !== null && item.fillByUserField !== '' && item.fillByUserField !== undefined) {
                            this.setModel(item.model, window.init.user[item.fillByUserField], item.formType)
                        }
                        if (this.isValid(item.param)) {
                            if (item.param in this.$route.params) {
                                let param = this.$route.params[item.param]
                                if (param != 'null') {
                                    Vue.set(this.$data.model, item.model, param)
                                }
                            }
                        }
                    }
                    item.source_hidden = item.hidden
                    item.source_disabled = item.disabled
                }
            )
        },

        validatePassCheck(model, rule, value, callback) {

            let value_ = value ? value : ''
            let password_value = this.model[model] ? this.model[model] : ''

            if (value === '' && !this.editMode) {
                callback(new Error(this.lang.pleaseReEnterYourPassword))
            } else if (value_ !== password_value) {
                callback(new Error(this.lang.passwordConfirmError))
            } else {
                callback()
            }
        },

        setUiSchemaFormItem(items) {

            items.forEach(item => {
                if (item.type == 'form') {
                    this.setModel(item.model, item.default, item.formType)
                    this.$watch('model.' + item.model, {
                        handler: (value, oldValue) => {
                            if (this.do_render) {
                                if (value !== oldValue) {
                                    this.afterChange(item.model, value, oldValue)
                                }
                            }
                        },
                        deep: true
                    })

                    if (item.rules) {
                        this.setRule(item.model, item.rules)
                    }

                    if (item.formType == 'Password') {
                        if (item.passwordOption) {
                            if (item.passwordOption.confirm) {
                                this.setModel('password_confirm', '', 'password')
                                this.$data.rule['password_confirm'] = [{
                                    validator: (rule, value, callback) => this.validatePassCheck(item.model, rule, value, callback),
                                    trigger: 'blur'
                                }]

                            }
                            if (item.passwordOption.edit_with_old_password) {
                                this.setModel('current_password', '', 'password')
                                let rules_for_current_password = []
                                let rules_current_password = [{
                                    type: 'required',
                                    msg: this.lang.pleaseEnterPasswordYouUCurrentlyUsing
                                }, {type: 'check_current_password', msg: null}]
                                rules_current_password.forEach(rule => {
                                    let r = getRule(rule, this.url)
                                    rules_for_current_password.push(r)
                                })
                                this.$data.rule['current_password'] = rules_for_current_password
                            }
                        }
                    }

                } else if (item.formType == 'SubForm') {
                    this.setModel(item.model, [], 'SubForm')
                    if (item.checkEmpty) {
                        this.subFormValidations.push({
                            model: item.model,
                            emptyErrorMsg: item.EmptyErrorMsg ? item.EmptyErrorMsg : `${item.name}-д мэдээлэл бүртгэнэ үү`
                        })
                    }

                    if (item.trigger != '') {
                        this.$watch('model.' + item.model, {
                            handler: (value, oldValue) => {
                                if (this.do_render) {
                                    this.afterChange(item.model, value, oldValue)
                                }
                            },
                            deep: true
                        })
                    }
                } else if (_.isArray(item.children)) {
                    this.setUiSchemaFormItem(item.children)
                }
            })
        },

        setModel(name, value, type) {
            switch (type) {
                case 'Switch':
                    let val = false
                    if (value == 'true' || value == 1) {
                        val = true
                    }
                    Vue.set(this.$data.model, name, val)
                    break
                case 'Checkbox':
                    let val_ = 0
                    if (value == 'true' || value == 1) {
                        val_ = 1
                    }
                    Vue.set(this.$data.model, name, val_)
                    break
                case 'CK':
                    let ck_value = ''
                    if (value != '' && value !== null) {
                        ck_value = value
                    }
                    Vue.set(this.$data.model, name, ck_value)
                    break
                case 'SubForm':
                    Vue.set(this.$data.model, name, [])
                    break
                case 'Select':
                    if (value == '' || value === null) {
                        Vue.set(this.$data.model, name, null)
                    } else if (!isNaN(value)) {
                        Vue.set(this.$data.model, name, value * 1)
                    } else {
                        Vue.set(this.$data.model, name, value)
                    }
                    break
                case 'Number':
                    if (value !== null) {
                        Vue.set(this.$data.model, name, value * 1)
                    }
                    break
                case 'ISelect':
                    Vue.set(this.$data.model, name, value)
                case 'TreeSelect':
                    Vue.set(this.$data.model, name, value)
                    break
                default:
                    Vue.set(this.$data.model, name, value)
            }
        },

        setRule(name, rules) {
            this.$data.rule[name] = []
            rules.forEach(item => {
                let r = getRule(item, this.url)
                this.$data.rule[name].push(r)
            })
        },

        setMeta(item, subForm) {
            let s_index = this.schema.findIndex(schema => schema.model == item.model)
            let i = s_index >= 0 ? this.schema[s_index] : item
            if (!subForm) {
                delete i['table']
                delete i['extra']
                i.schemaID = this.$props.schemaID
            }
            return i
        },

        setDataManually(model, data) {
            this.model[model] = data;
        },

        getSchemaByModel(model) {
            let index = this.schema.findIndex(item => item.model == model)
            if (index >= 0)
                return this.schema[index]
            else
                return null
        },

        getSchemaRelationByModel(model) {
            let index = this.schema.findIndex(item => item.model == model)
            if (index >= 0)
                return getRelationData(this.schema[index], this.relations)
            else
                return null
        },

        setSchemaByModel(model, prop, value, subModel) {
            if (prop == 'value') {
                Vue.set(this.$data.model, model, value)
            } else if (prop == 'sub-value') {
                Vue.set(this.$data.model, model, value)
                this.subFormFillData(model)
            } else {
                let index = this.schema.findIndex(item => item.model == model)

                if (index >= 0) {
                    if (subModel !== undefined) {
                        if (this.schema[index].formType == 'SubForm') {
                            let sindex = this.schema[index].schema.findIndex(sitem => sitem.model == subModel)
                            if (sindex >= 0) {
                                Vue.set(this.schema[index].schema[sindex], prop, value)
                            }
                        }

                    } else {
                        Vue.set(this.schema[index], prop, value)
                    }
                }

            }

        },

        getSubFormData(key) {
            let subFormData = []
            this.model[key].forEach(item => {
                subFormData.push(item.data)
            })
        },

        closeForm() {
            if (this.template === 'modal') {
                this.$modal.hide('krud-modal');
            }
            if (this.template === 'window') {
                this.$router.push({path: this.$route.path, query: {window: 'list'}});
            }

            if (this.onClose) {
                this.onClose();
            }
        },

        handleSubmit(name) {
            this.setIdentityManual()
            if (_.isEmpty(this.$data.rule)) {
                if (this.subFormValidations.length >= 1) {
                    this.validateWithSubForm()
                } else {
                    this.postData()
                }
            } else {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        if (this.subFormValidations.length >= 1) {
                            this.validateWithSubForm()
                        } else {
                            this.postData()
                        }
                    } else {
                        //auh дээр хэрэглэгдэж байгаа шүү
                        this.$Notice.error({
                            title: this.lang.informationIsIncomplete,
                            desc: this.formValidationCustomText != '' ? this.formValidationCustomText : this.lang.trRMandatoryFieldsFillInformationLookFormAFillRequiredFieldsWithRedBorder
                            , duration: 0
                        })

                    }
                })
            }
        },

        validateWithSubForm() {
            let subValid = true
            this.subFormValidations.forEach(sbValidation => {
                let isArray = _.isArray(this.model[sbValidation.model])
                if (this.model[sbValidation.model] === undefined || this.model[sbValidation.model] === null || isArray) {

                    if (isArray) {
                        if (this.model[sbValidation.model].length == 0) {
                            this.$Notice.error({
                                title: this.lang.informationIsIncomplete,
                                desc: sbValidation.emptyErrorMsg, duration: 0
                            })
                            subValid = false
                        }
                    } else {
                        this.$Notice.error({
                            title: this.lang.informationIsIncomplete,
                            desc: sbValidation.emptyErrorMsg, duration: 0
                        })
                        subValid = false
                    }
                }
            })
            if (subValid) {
                this.postData()
            }
        },

        postData() {
            if (this.beforeSubmit) {
                this.$props.beforeSubmit();
            }

            if (this.isSubForm) {
                this.$props.onSuccess(this.$data.model)
            } else {
                this.asyncMode = true
                axios.post(this.submitUrl, this.$data.model)
                    .then(({data}) => {
                        if (data.status) {
                            this.$Notice.success({
                                title: this.lang.successfullySaved
                            })

                            if (!this.editMode) {
                                this.$data.model[this.identity] = data[this.identity]
                                if (this.$props.onSuccess) {
                                    this.$props.onSuccess(data.data)
                                }
                                this.handleReset(this.meta.model + '-' + this.schemaID)
                            } else {
                                if (this.$props.onSuccess) {
                                    this.$props.onSuccess(data.data)
                                }
                            }

                            if (this.template === 'modal') {
                                this.$modal.hide('krud-modal');
                            }
                        } else {
                            this.$Notice.error({
                                title: this.lang.errorSaving
                            })
                            if (this.$props.onError) {
                                this.$props.onError()
                            }
                        }
                        this.asyncMode = false
                    })
                    .catch(e => {
                        let errorDesc = ''
                        if (e.response) {

                            if (e.response.data.hasOwnProperty('error')) {

                                if (typeof e.response.data.error === 'string' || e.response.data.error instanceof String) {
                                    errorDesc = e.response.data.error
                                } else {
                                    if (e.response.data.error instanceof Object) {
                                        Object.keys(e.response.data.error).forEach(error => {
                                            let desc = error + ': ' + e.response.data.error[error].map(ed => ed + ' ')
                                            if (errorDesc != '') {
                                                errorDesc = errorDesc + '<br/>' + desc
                                            } else {
                                                errorDesc = desc
                                            }
                                        })
                                    }
                                }

                            }
                            this.$Notice.error({
                                title: this.lang.errorSaving,
                                duration: 3,
                                desc: errorDesc
                            })

                        } else {
                            this.$Notice.error({
                                title: this.lang.errorSaving,
                                duration: 3,
                                desc: e
                            })


                        }

                        this.asyncMode = false
                        if (this.$props.onError) {
                            this.$props.onError()
                        }

                    })
            }
        },

        handleReset(name) {
            this.model = {}
            this.$refs[name].resetFields()
            setIdentity(this.identity, null)
            this.schema.forEach(item => {
                if (item.formType == 'SubForm' && typeof this.$refs[`sf${item.model}`] != 'undefined') {
                    console.log(this.$refs[`sf${item.model}`]);
                    this.$refs[`sf${item.model}`][0].reset()
                }
                //if (item.default != null && !this.editMode) {
                this.setModel(item.model, item.default, item.formType)
                //}

                item.hidden = item.source_hidden
                item.disabled = item.source_disabled
            })
            this.setHiddenItemModel(this.schema)
            this.setCustomData()

        },
        setIdentityManual() {
            setIdentity(this.identity, this.model[this.identity])
        },

        setUserConditionValues(setFromUserData) {
            //SET DEFAULT VALUE Disabled item on edit mode
            if (this.user_condition) {
                this.user_condition.forEach(user_condition => {

                    let schemaItem = this.getSchemaByModel(user_condition['form_field'])
                    if (schemaItem) {
                        if ((schemaItem.default != '' && schemaItem.default !== null && schemaItem.default != 0) || setFromUserData) {
                            if (this.model[schemaItem.model] == '' || this.model[schemaItem.model] === null || this.model[schemaItem.model] == 0) {
                                if (setFromUserData) {
                                    this.model[schemaItem.model] = window.init.user[user_condition['user_field']]
                                    schemaItem.default = window.init.user[user_condition['user_field']]
                                } else {
                                    // this.model[schemaItem.model] = schemaItem.default;
                                    this.setModel(schemaItem.model, schemaItem.default, schemaItem.formType)
                                }

                            }
                        }
                    }


                })
            }


        },
        setCustomData() {
            if (this.formCustomData) {
                Object.keys(this.formCustomData).forEach(model => {
                    let index = this.schema.findIndex(item => item.model == model)
                    if (index >= 0) {
                        Vue.set(this.schema[index], 'disabled', true)
                        Vue.set(this.schema[index], 'default', this.formCustomData[model])
                        Vue.set(this.$data.model, model, this.formCustomData[model])
                    }
                })
            }
        },

        editModel(id, editData) {
            if (editData) {
                this.model = {...this.model, ...editData}
                if (this.ui && this.ui.hasOwnProperty('schema')) {
                    this.setEditModel(this.ui.schema)
                    this.setUserConditionValues(false)
                    this.setCustomData()
                }
            } else {
                this.dataID = id
                setIdentity(this.identity, id)
                axios.post(this.page_id ? `${this.baseUrl}/lambda/krud/${this.$props.schemaID}/edit/${id}?page_id=${this.page_id}` : `${this.baseUrl}/lambda/krud/${this.$props.schemaID}/edit/${id}`)
                    .then(({data}) => {
                        if (data.status) {
                            this.model = {...this.model, ...data.data}
                            if (this.ui && this.ui.hasOwnProperty('schema')) {
                                this.setEditModel(this.ui.schema)
                            }
                            this.setUserConditionValues(false)
                            this.setCustomData()
                        }
                    })
            }
        },

        setHiddenValues(values) {
            values.map(item => {
                this.model[item['key']] = item['val']
            })
        },

        subFormFillData(subModel) {
            if (this.$refs[`sf${subModel}`]) {
                if (this.$refs[`sf${subModel}`].length >= 1) {
                    this.$refs[`sf${subModel}`][0].fillData()
                } else {
                    setTimeout(() => {
                        this.subFormFillData(subModel)
                    }, 100)
                }
            } else {
                setTimeout(() => {
                    this.subFormFillData(subModel)
                }, 100)
            }
        },

        setEditModel(items) {
            items.forEach(item => {
                if (item.type == 'form' || item.type == 'Form' || item.formType == 'SubForm') {
                    switch (item.formType) {
                        case 'SubForm':
                            this.subFormFillData(item.model)
                            break
                        case 'Switch':
                            if (this.model[item.model] == 1 || this.model[item.model] == 'true') {
                                this.model[item.model] = true
                            } else {
                                this.model[item.model] = false
                            }
                            break
                        // case "Checkbox":
                        //     if (this.model[item.model] == 1 || this.model[item.model] == "true") {
                        //         this.model[item.model] = true;
                        //     } else {
                        //         this.model[item.model] = false;
                        //     }
                        //     break;
                        case 'Password':
                            this.model[item.model] = ''
                            delete this.$data.rule[item.model]
                            break
                        case 'PasswordGenerate':
                            this.model[item.model] = ''
                            delete this.$data.rule[item.model]
                            break
                        default:
                            break
                    }
                } else if (_.isArray(item.children)) {
                    this.setEditModel(item.children)
                }

                // if (item.model && item.model == 'partner_register') {
                //     console.log('item: ', this.model[item.model]);
                // }
            })
        },

        cloneModel(id) {
            axios.post(`/lambda/krud/${this.$props.schemaID}/edit/${id}`)
                .then(({data}) => {
                    if (data.status) {
                        this.model = {...this.model, ...data.data}
                        delete this.model[this.identity]
                        this.setEditModel(this.ui.schema)
                        this.setUserConditionValues(false)
                        this.setCustomData()
                    }
                })
        },

        getOptionsByRelations(baseUrl, relations) {
            // console.log("get options: ", relations);

            if (Object.keys(relations).length >= 1) {
                axios.post(`${baseUrl}/lambda/puzzle/get_options${this.optionUrl}`, {relations: relations})
                    .then(({data}) => {
                        Object.keys(data).map(relation => {
                            let r = {...this.relations[relation], data: data[relation]}
                            Vue.set(this.$data.relations, relation, r)
                        })
                    })
            }
        },

        getOptionsData(schema) {
            this.relations = this.getSelects(schema, undefined)

            if (window.init.microserviceSettings) {
                if (window.init.microserviceSettings.length >= 1) {
                    window.init.microserviceSettings.forEach(microserviceSetting => {
                        let relations = this.getSelects(schema, microserviceSetting.project_id)
                        this.getOptionsByRelations(microserviceSetting.production_url, relations)
                    })
                } else {
                    this.getOptionsByRelations('', this.relations)
                }
            } else {
                this.getOptionsByRelations('', this.relations)
            }

        },
        getSelectItem(item, selects) {
            if (item.relation.filterWithUser) {
                if (!!item.relation.filterWithUser && item.relation.filterWithUser.constructor === Array) {
                    let userConditions = ''
                    item.relation.filterWithUser.forEach(userFilter => {
                        let condition = `${userFilter['tableField']} = '${window.init.user[userFilter['userField']]}'`
                        if (userConditions == '') {
                            userConditions = condition
                        } else {
                            userConditions = userConditions + ' AND ' + condition
                        }
                    })

                    if (item.relation.filter == '' || typeof item.relation.filter === 'undefined') {
                        item.relation.filter = userConditions
                        this.setSchemaByModel(item.model, 'relation', item.relation)
                    } else {
                        // item.relation.filter = `(${item.relation.filter}) OR (${userConditions})`
                        item.relation.filter = `(${item.relation.filter}) AND (${userConditions})`
                    }
                } else {
                    let condition = `${item.relation.filterWithUser['tableField']} = '${window.init.user[item.relation.filterWithUser['userField']]}'`
                    if (item.relation.filter == '' || typeof item.relation.filter === 'undefined') {
                        item.relation.filter = condition
                    } else {
                        item.relation.filter = item.relation.filter + ' AND ' + condition
                    }
                }

                item.relation.filterWithUser = undefined
            }

            if (item.relation.filter == '' || typeof item.relation.filter === 'undefined') {

                selects[item.relation.table] = item.relation

            } else {

                selects[item.model] = item.relation
            }
            return selects
        },
        getSelects(schema, microserviceID) {
            let selects = {}

            schema.map(item => {
                if (item.formType == 'Radio' || item.formType == 'Select' || item.formType == 'ISelect' || item.formType == 'TreeSelect') {
                    if (item.relation.table) {
                        if (typeof selects[item.relation.table] === 'undefined') {
                            if (microserviceID !== undefined) {
                                if (item.relation.microservice_id == microserviceID) {
                                    selects = this.getSelectItem(item, selects)
                                }
                            } else {
                                selects = this.getSelectItem(item, selects)
                            }
                        }
                    }
                }

                if (item.formType == 'AdminMenu') {
                    if (item.relation.table)
                        selects[item.relation.table] = item.relation
                }

                if (item.formType == 'SubForm') {
                    if (item.schema) {
                        let pre_selects = this.getSelects(item.schema, microserviceID)
                        if (pre_selects) {
                            selects = {...selects, ...pre_selects}
                        }
                    }
                }
            })
            console.log('selects: ', selects);

            return selects
        },

        /* countShowableChildren(children){
             let visible_item_found = false;
             children.forEach(child=>{
                 if(child.children){
                     child.children.forEach(sub_child=>{
                         if(sub_child.children){
                             sub_child.children.forEach(form_field=>{

                                 if(!form_field.hidden && form_field.type == 'form'){
                                     visible_item_found = true;


                                 }

                             })
                         }
                     })
                 }
             })
             return visible_item_found;
         }*/
        showInformationModal(url, title) {
            this.infoTitle = title
            this.infoUrl = url
            this.showInfo = true
        },

        getRelation(item) {
            let s_index = this.schema.findIndex(schema => schema.model == item.model)
            let i = s_index >= 0 ? this.schema[s_index] : item
            return getRelationData(i, this.relations)
        },

        getFooterButtons() {
            let buttons = []
            this.schema.forEach(item => {
                if (item.formType == 'FooterButton') {
                    buttons.push({...item})
                }
            })
            return buttons
        },

        setAndSend(model, value) {
            let name = this.meta.model + '-' + this.schemaID
            this.setIdentityManual()
            if (_.isEmpty(this.$data.rule)) {
                if (this.subFormValidations.length >= 1) {
                    this.validateWithSubForm()
                } else {
                    this.asyncMode = true
                    Vue.set(this.$data.model, model, value)
                    this.postData()
                }

            } else {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        if (this.subFormValidations.length >= 1) {
                            this.validateWithSubForm()
                        } else {
                            this.asyncMode = true
                            Vue.set(this.$data.model, model, value)
                            this.postData()
                        }
                    } else {
                        //auh дээр хэрэглэгдэж байгаа шүү
                        this.$Notice.error({
                            title: this.lang.informationIsIncomplete,
                            desc: this.formValidationCustomText != '' ? this.formValidationCustomText : this.lang.trRMandatoryFieldsFillInformationLookFormAFillRequiredFieldsWithRedBorder
                            , duration: 0
                        })

                    }
                })
            }
        },

        moveStep(stepNumber) {
            this.currentStep = stepNumber;
        },

        onStepSuccess() {

        },

        onStepError() {

        }
    }
}
