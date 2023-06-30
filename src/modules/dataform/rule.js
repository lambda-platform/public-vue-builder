let ruleModel = null;
let identityColumn = null;
let identity = null;

export const isValid = (val) => {
    if (typeof val !== undefined && val != null && val != "") {
        return true;
    }
    return false;
}

export const setModel = (model) => {
    ruleModel = model;
}

export const setIdentity = (column, value) => {
    identity = value;
    identityColumn = column;
}

export const rules = [{
    type: 'required',
    msg: 'Талбарыг бөглөнө үү!'
},
    {
        type: 'email',
        msg: 'Имэйл хаягаа зөв оруулна уу!'
    },
    {
        type: 'number',
        msg: 'Тоон утга оруулна уу!'
    },
    {
        type: 'numeric',
        msg: 'Тоон утга оруулна уу!'
    },
    {
        type: 'register',
        msg: 'Регистрийн дугаар!'
    },
    {
        type: 'mongolianMobileNumber',
        msg: '8 оронтой утасны дугаар оруулна уу!'
    },
    {
        type: 'englishAlphabet',
        msg: 'Зөвхөн латин үсэг оруулна уу!'
    },
    {
        type: 'mongolianCyrillic',
        msg: 'Зөвхөн кирилл үсэг оруулна уу!'
    },
    {
        type: 'unique',
        msg: 'Давхацсан утга оруулсан байна!'
    },
    {
        type: 'lambda-account',
        msg: 'Давхацсан утга оруулсан байна!'
    }
];

const unique = (rule, value, callback, baseUrl) => {
    axios.post(`${baseUrl}/lambda/krud/unique`, {
        table: ruleModel,
        identityColumn: identityColumn,
        identity: identity,
        field: rule.field,
        val: value
    }).then(o => {
        if (o.data.status) {
            callback();
        } else {
            callback(new Error(o.data.msg));
        }
    })
};
const checkLambdaaccount = (rule, value, callback, baseUrl) => {
    axios.post(`${baseUrl}/lambda/check`, {
        value: value
    }).then(o => {
        if (o.data.status) {
            callback();
        } else {
            callback(new Error(`'${value} Давхацсан утга оруулсан байна!'`));
        }
    })
};
const englishAlphabet = (rule, value, callback) => {
    var letterNumber = /^[a-zA-Z!@#\$%\^\&*\s*)\(+=._-]+$/;
    if(value.match(letterNumber)){
        callback();
    } else {
        callback(new Error("Зөвхөн латин үсэг оруулна уу"));
    }
};
const mongolianCyrillic = (rule, value, callback) => {
    // var letterNumber = /^[\u0400-\u04FF\s*]+$/;
    var letterNumber = /^[а-яөүёА-ЯӨҮЁ0-9!@#\$%\^\&*\s*)\(+=._-]+$/;
    if(value.match(letterNumber)){
        callback();
    } else {
        callback(new Error("Зөвхөн кирилл үсэг оруулна уу!"));
    }
};
const mongolianMobileNumber = (rule, value, callback) => {

    var letterNumber = /^[0-9]{8}$/;
    if(value.toString().match(letterNumber)){
        callback();
    } else {

        callback(new Error('8 оронтой утасны дугаар оруулна уу!'));
    }
};

const register = (rule, value, callback) => {
    var cryllicLetter = /^[а-яөүёА-ЯӨҮЁ0-9!@#\$%\^\&*\s*)\(+=._-]+$/;
    var letterNumber = /^[0-9]{8}$/;
    if(value.toString().substring(0,2).match(cryllicLetter) && value.toString().substring(2,10).match(letterNumber)){
        callback();
    } else {
        callback(new Error('Регистрээ зөв оруулна уу!'));
    }
};

const check_current_password = (rule, value, callback, baseUrl) => {
    axios.post(`${baseUrl}/lambda/krud/check_current_password`, {
        password: value
    }).then(o => {
        if (o.data.status) {
            callback();
        } else {

            callback(new Error(o.data.msg));
        }
    })
};


export const getRule = (rule, baseUrl) => {
    if(!baseUrl){
        baseUrl = ""
    }
    switch (rule.type) {
        case 'required':
            return {
                required: true,
                message: rule.msg
            }
        case 'array':
            return {
                type: "array",
                required: rule.required,
                message: rule.message
            }
        case 'min':
            return {
                type: 'string',
                min: parseInt(rule.val, 10),
                message: rule.msg
            }
        case 'max':
            return {
                type: 'string',
                max: parseInt(rule.val, 10),
                message: rule.msg
            }
        case 'email':
            return {
                type: 'email',
                trigger: 'blur',
                message: rule.msg
            }
        case 'number':
            return {
                type: 'number',
                message: rule.msg
            }
        case 'mongolianMobileNumber':
            return {
                validator: mongolianMobileNumber,
                trigger: 'blur',
                // message: rule.msg
            }
        case 'unique':
            return {
                validator: (rule, value, callback)=> unique(rule, value, callback, baseUrl),
                trigger: 'blur',
                // message: rule.msg
            }
        case 'lambda-account':
            return {
                validator: (rule, value, callback)=> checkLambdaaccount(rule, value, callback, baseUrl),
                trigger: 'blur',
                // message: rule.msg
            }
        case 'englishAlphabet':
            return {
                validator: englishAlphabet,
                trigger: 'blur',
                message: rule.msg
            }
        case 'mongolianCyrillic':
            return {
                validator: mongolianCyrillic,
                trigger: 'blur',
                // message: rule.msg
            }
        case 'check_current_password':
            return {
                validator: (rule, value, callback)=> check_current_password(rule, value, callback, baseUrl),
                trigger: 'blur',
                // message: rule.msg
            }
        case 'register':
            return {
                validator: register,
                trigger: 'blur'
            }
        default:
            return null;

    }
}
