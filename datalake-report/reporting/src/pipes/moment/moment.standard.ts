import { formattedDateTimeForView } from './../../common_code/CommonHelper';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentStandardPipe'
})
export class MomentStandardPipe implements PipeTransform {
  transform(value: Date | moment.Moment, ...args: any[]): any {
    return moment(value).format(formattedDateTimeForView);
  }
}