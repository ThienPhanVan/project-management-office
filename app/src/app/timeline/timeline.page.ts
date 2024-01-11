import { Component, OnInit, createComponent } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailPage } from '../user/detail/detail.page';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {

  message = 'This modal example uses the modalController to present and dismiss modals.';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: createComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }

  async openModalDetail() {
    const modal = await this.modalCtrl.create({
      component: DetailPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }


  public actionSheetButtons = [
    {
      text: 'Hoàn thành',
      role: 'destructive',
      data: {
        action: 'done'
      }
    },
    {
      text: 'Xoá',
      role: 'destructive',
      data: {
        action: 'delete'
      }
    },
    {
      text: 'Báo cáo',
      data: {
        action: 'share'
      }
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel'
      }
    }
  ];
}
