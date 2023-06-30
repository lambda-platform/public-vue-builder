var templateRe = /\{ *([\w_-]+) *\}/g;

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
