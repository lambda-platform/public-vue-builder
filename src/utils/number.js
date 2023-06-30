import numeral from 'numeral';


export function getMoney(number) {
    let value = numeral(number);

    return value.format('0,0.00');

}
export function getNumber(number) {
    let value = numeral(number);

    return value.format('0,0');

}
export function number(number) {
    let value = numeral(number);

    return value.format('0,0.00');

}
export function gridNumber(row, column) {
    let value = numeral(row[column.property]);

    return value.format('0,0.00');

}
export function cellNumber(row, column, number) {
    let value = numeral(number);

    return value.format('0,0');

}
export function getNumbervalue(number) {
    let value = numeral(number);

    return value.value();

}
