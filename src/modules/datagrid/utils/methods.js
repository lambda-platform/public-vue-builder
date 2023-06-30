export const idGenerator = (type) => {
    let randomId = Math.random()
        .toString(36)
        .substr(3, 9);
    return `${type}-${randomId}`;
}

export const isValid = (val) => {
    if (typeof val == "undefined" || val == null || val == '') {
        return false;
    }
    return true;
}


export const compareObj = (obj1, obj2) => {
    for (let p in obj1) {
        //Check property exists on both objects
        if (Object.prototype.hasOwnProperty.call(obj1, p) !== Object.prototype.hasOwnProperty.call(obj2, p)) return false;

        if (obj1[p] === null && obj2[p] !== null) return false;
        if (obj2[p] === null && obj1[p] !== null) return false;

        switch (typeof (obj1[p])) {
            //Deep compare objects
            case 'object':
                if (!compareObj(obj1[p], obj2[p])) return false;
                break;
            //Compare function code
            case 'function':
                if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                break;
            //Compare values
            default:
                if (obj1[p] === '' && obj2[p] !== '') return false;
                if (obj2[p] === '' && obj1[p] !== '') return false;
                if (obj1[p] != obj2[p]) return false;
        }
    }

    //Check object 2 for any extra properties
    for (let p in obj2) {
        if (typeof (obj1[p]) == 'undefined') return false;
    }
    return true;
}
