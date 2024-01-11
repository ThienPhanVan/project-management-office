import * as _ from 'lodash';

export class ObjectHelper {
  public static isObjectEmpty(obj: any) {
    return !_.includes(_.keys(obj), 'id');
  }
}
