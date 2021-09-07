import * as moment from 'moment';

export const formattedDateTimeForView = 'YYYY-MM-DD HH:mm:ss';

export function toFormatedDateTime(dateTime) {
    return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
}