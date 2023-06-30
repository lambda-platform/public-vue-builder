var templateRe = /\{ *([\w_-]+) *\}/g;
var fieldTimeout = null;

export function dataFromTemplate(str, data) {
    return str.replace(templateRe, function (str, key) {
        let value = data[key];
        if (value === undefined) {
            return '';
        } else if (typeof value === 'function') {
            value = value(data);
        }
        return value;
    });
}

export function evil(fn) {
    return new Function('return ' + fn)();
}

export function doFormula(formulas, model, model_, schema_, rule_, subFormModelName) {
    //formula
    if (formulas.length >= 1) {
        let formula_index = formulas.findIndex(formula => formula.model == model)
        if (formula_index <= -1) {
            formulas.map(formula => {
                if (formula.template.includes(model)) {
                    doFormula2(formula, model, model_, schema_, rule_, subFormModelName)
                }
            });
        } else {
            doFormula2(formulas[formula_index], model, model_, schema_, rule_, subFormModelName)
        }
    }
}

function doFormula2(formula, model, model_, schema_, rule_, subFormModelName) {

    let use_formula = false;

    //old one i dont know just commented
    // if (formula['form']) {
    //     if (formula['form'] == 'main')
    //         use_formula = true;
    //     else if (subFormModelName) {
    //         if (formula['form'] == subFormModelName)
    //             use_formula = true
    //     }
    // } else {
    //     use_formula = true;

    if (formula['form']) {
        if (formula['form'] == 'main')
            use_formula = true;
        else if (subFormModelName) {
            if (formula['form'] == subFormModelName)
                use_formula = true
        }
    }
        //use_formula = true;
        if (use_formula) {
            let pre_formula = dataFromTemplate(formula.template, model_);
            if (pre_formula) {
                let calculated = evil(pre_formula);
                formula.targets.map(target => {
                    let schema_index = getSchemaIndex(schema_, target.field);
                    if (schema_index >= 0) {
                        if (target.prop == 'value') {
                            model_[target.field] = calculated;
                        } else {
                            if (target.prop == 'hidden') {
                                if (rule_) {
                                    if (rule_[target.field]) {
                                        if (rule_[target.field].length > 0 && rule_[target.field][0].hasOwnProperty("required"))
                                            rule_[target.field][0].required = calculated ? false : true;
                                    }
                                }
                            }
                            // schema_[schema_index][target.prop] = calculated;
                            Vue.set(schema_[schema_index], target.prop, calculated)
                        }
                    }
                })
            }
        }

}

export function doTrigger(model, val, model_, schema_, refs, Message, editMode) {

    if (val) {
        let model_index = getSchemaIndex(schema_, model);
        if (model_index >= 0) {
            if (schema_[model_index]['trigger']) {
                if (fieldTimeout) {
                    clearTimeout(fieldTimeout);
                }
                fieldTimeout = setTimeout(() => {
                    callFieldTrigger(schema_[model_index]['trigger'], model_, schema_, refs, Message, editMode);
                }, schema_[model_index]['triggerTimeout'] != undefined && schema_[model_index]['triggerTimeout'] !== null && schema_[model_index]['triggerTimeout'] != '' ? schema_[model_index]['triggerTimeout'] : 0);
            }
        }
    }
}

function setValueProps(field, model_, schema_, refs, is_sub) {

    if (is_sub) {
        let schema_sub_index = getSchemaIndex(schema_, is_sub);
        if (schema_sub_index >= 0) {
            let schema_index = getSchemaIndex(schema_[schema_sub_index].schema, field.field);
            if (schema_index >= 0) {
                Object.keys(field.props).forEach(prop => {
                    schema_[schema_sub_index].schema[schema_index][prop] = field.props[prop];
                });
            }
        }
    } else {

        let schema_index = getSchemaIndex(schema_, field.field);
        if (schema_index >= 0) {
            if ('value' in field) {
                //model_[field.field] = field.value;
                Vue.set(model_, field.field, field.value);
                let current_schema = schema_[schema_index];
                if (current_schema.formType == "SubForm") {
                    refs[`sf${field.field}`][0].fillData();
                }
            }
            if (field.props) {
                Object.keys(field.props).forEach(prop => {
                    // schema_[schema_index][prop] = field.props[prop];
                    Vue.set(schema_[schema_index], prop, field.props[prop]);
                });
            }
        }
    }
}

function callFieldTrigger(trigger_url, model_, schema_, refs, Message, editMode) {
    // console.log('axios sent', trigger_url);

    let services = trigger_url.split(",");

    services.forEach(service => {
        axios.post(service, {model: {...model_}, editMode: editMode})
            .then(({data}) => {
                if (data['schema']) {
                    data['schema'].forEach(field => {
                        setValueProps(field, model_, schema_, refs)
                    })
                }
                if (data['schema_sub']) {

                    data['schema_sub'].forEach(schema_sub => {
                        schema_sub.schema.forEach(field_sub => {
                            setValueProps(field_sub, model_, schema_, refs, schema_sub.model)
                        })

                    })
                }
                if (data['message']) {
                    if (data['message']['type'] == 'success') {
                        Message.success({
                            duration: 3,
                            desc: data['message']['message']
                        });
                    } else {
                        Message.error({
                            duration: 3,
                            desc: data['message']['message']
                        });
                    }
                }
                if (data['info']) {
                    data['info'].forEach(info => {
                        document.getElementById(info.target).innerHTML = info.html;
                    })
                }
            })
    })


}

function getSchemaIndex(schema_, model) {
    return schema_.findIndex(item => item.model == model);
}
