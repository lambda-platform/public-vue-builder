import Moment from 'moment'

export const getDate = (date) => {
    if (!(typeof date === 'string' || date instanceof String)) {
        if ((new Date(date)).toString() !== "Invalid Date") {
            return Moment(date).format("YYYY-MM-DD");
        } else {
            return Moment(date * 1).format("YYYY-MM-DD");
        }
    }
    return date;
}

export function toMoment(date) {
    return Moment(date)
}

export function toTime(time) {
    return Moment(time, 'HH:mm:ss')
}

export function toDateTime(datetime) {
    return Moment(datetime, 'YYYY-MM-DD HH:mm:ss')
}

export function getDateTime(date) {
    if (typeof date === 'string' || date instanceof String) {
        return date;
    } else {
        if ((new Date(date)).toString() !== "Invalid Date") {
            return Moment(date).format("YYYY-MM-DD HH:mm");
        } else {
            return Moment(date * 1).format("YYYY-MM-DD HH:mm");
        }
    }
}

export function getTime(date) {
    if (typeof date === 'string' || date instanceof String) {
        return date;
    } else {
        if ((new Date(date)).toString() !== "Invalid Date") {
            return Moment(date).format("HH:mm:ss");
        } else {
            return Moment(date * 1).format("HH:mm:ss");
        }
    }
}
