import * as _ from 'lodash';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'displayActivity' })
export class DisplayActivityPipe implements PipeTransform {
  transform(obj: any): string {
    const results = [];
    for (const key in obj) {
      if (!key.includes('Id')) {
        if (obj[key].Name) {
          results.push(
            `${key}: ${obj[key].Name.oldValue} -> ${obj[key].Name.newValue}`,
          );
        } else {
          results.push(`${key}: ${obj[key].oldValue} -> ${obj[key].newValue}`);
        }
      }
    }
  
    return _.join(results, '\n');
  }
}
