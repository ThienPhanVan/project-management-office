import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent  implements OnInit {
  @ViewChild('modal') modal!: IonModal;

  constructor() { }

  ngOnInit() {}

  actionSubmit(){
    this.modal.dismiss()
  }

}
