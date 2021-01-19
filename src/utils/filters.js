import * as moment from "moment";

export function dateFormatter(value) {
    if (moment(value).isValid()) {
        return moment(value).format('YYYY-MM-DD');
    }
    return value;
}

export function timeFormatter(value) {
    if (moment(value).isValid()) {
        return moment(value).format('HH:mm:ss');
    }
    return value;
}

export function dateTimeFormatter(value) {
    if (moment(value).isValid()) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
    }
    return value;
}

// export function dateTimeFormatterZh(value) {
//     if (moment(value).isValid()) {
//         const input = moment(value).toDate();
//         con
//
//         return moment(value).format('YYYY-MM-DD HH:mm:ss');
//     }
//     return value;
// }
