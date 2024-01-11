import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class MasterDataService {
  private countriesBus$ = new BehaviorSubject<any>({});
  countries$ = this.countriesBus$.asObservable();

  public meBus$ = new BehaviorSubject<any>({});
  public me$ = this.meBus$.asObservable();

  constructor() {}

  setCountries(countries: any) {
    this.countriesBus$.next(countries);
  }

  setMe(user: any) {
    this.meBus$.next(user);
  }
}
