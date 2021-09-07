"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
exports.formattedDateTimeForView = 'YYYY-MM-DD HH:mm:ss';
function toFormatedDateTime(dateTime) {
    return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
}
exports.toFormatedDateTime = toFormatedDateTime;
