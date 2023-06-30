export const idGenerator = (type) => {
    let randomId = Math.random()
        .toString(36)
        .substr(3, 9);
    return `${type}-${randomId}`;
}


export const evalstr = (str) => {
    if (typeof str == "undefined" || str == null || str == "") {
        return true;
    }
    return eval(str.toString());
}

export const isValid = (val) => {
    if (typeof val == "undefined" || val == null || val == '') {
        return false;
    }
    return true;
}
