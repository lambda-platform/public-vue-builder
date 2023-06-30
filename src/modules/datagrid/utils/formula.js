let templateRe = /\{ *([\w_-]+) *\}/g;

export const dataFromTemplate = (str, data) => {
    return str.replace(templateRe, (str, key) => {
        let value = data[key];
        if (value === undefined) {
            return 0;
        } else if (typeof value === 'function') {
            value = value(data);
        }
        return value * 1;
    });
}

export const convertLink = (str, data) => {
    return str.replace(templateRe, (str, key) => {
        let value = data[key];
        if (value === undefined) {
            return '';
        }
        return value;
    });
}

export const evil = (fn) => {
    return new Function('return ' + fn)();
}
