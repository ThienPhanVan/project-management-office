import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageUpdateService {
  private messageUpdatedSource = new Subject<any>();
  messageUpdated$ = this.messageUpdatedSource.asObservable();

  constructor() {}

  updateMessage(updatedMessage: any) {
    this.messageUpdatedSource.next(updatedMessage);
  }
}
