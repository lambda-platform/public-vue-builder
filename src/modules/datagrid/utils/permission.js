import jsonLogic from "json-logic-js"


export const isCan = (condition, row)=>{
    let result = jsonLogic.apply(condition, row);
    if (Array.isArray(result)) {
        if(result.length >= 1){
            return !result[0];
        } else {
            return true;
        }
    }
    return !result;
}
