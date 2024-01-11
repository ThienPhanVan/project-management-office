import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UnreadMessageService {

  private _numberUnread$ = new BehaviorSubject<number>(0);

  get numberUnread$() {
    return this._numberUnread$.asObservable();
  }

  updateNumberUnread(value: number) {
    this._numberUnread$.next(value);
  }
}
