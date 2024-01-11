import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'displayTotal' })
export class DisplayTotalPipe implements PipeTransform {
  transform(value: any[]): string {
    return value?.length ? '(' + value.length + ')' : '';
  }
}
