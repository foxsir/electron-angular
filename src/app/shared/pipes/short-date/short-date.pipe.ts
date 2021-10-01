import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {

  transform(value: number, format: string = 'MM-d hh:mm'): string {
    const date = new DatePipe("zh-Hans");
    if(this.isToday(value)) {
      return date.transform(value, 'hh:mm');
    } else {
      return date.transform(value, format);
    }
  }

  isToday(timestamp: number): boolean {
    const date = new Date(timestamp);
    const now = new Date();
    return date.getDate() === now.getDate() && date.getMonth() === now.getMonth()
  }

}
