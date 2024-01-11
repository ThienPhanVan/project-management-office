import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService, UserService } from '../services';
import { AlertDialog } from '../interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.page.html',
  styleUrls: ['./chapter.page.scss'],
})
export class ChapterPage implements OnInit {
  user: any = {};
  chapters: any = [];

  isErrorImg: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertController: AlertController,
    private route: Router
  ) {}

  ngOnInit() {
    this.authService.me().subscribe(
      (res: any) => {
        this.user = res;
      },
      (err: any) => {
        this.route.navigate(['/login']);
      }
    );
  }

  //update image
  async setCoverImage(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.isErrorImg = true;
    } else {
      this.isErrorImg = false;
      await this.userService
        .onFileSelected(event.target.files[0], new Date().getDate())
        .subscribe((res: any) => {
          let alertDialog = {
            header: 'Thông báo',
            message: 'Cập nhật avatar thành công',
            buttons: [
              {
                text: 'OK',
                role: 'confirm',
              },
            ],
          };
          if (res.body && res.body.Location) {
            alertDialog = {
              ...alertDialog,
              message: 'Cập nhật avatar thành công',
            };
            this.presentAlert(alertDialog);
            this.user.thumbnail = res.body.Location;
            this.userService.updateUser(this.user, this.user.id).subscribe();
          }
        });
    }
  }

  //alert
  async presentAlert(alertDialog: AlertDialog) {
    const alert = await this.alertController.create({
      header: alertDialog.header,
      subHeader: alertDialog.subHeader,
      message: alertDialog.message,
      buttons: alertDialog.buttons,
    });

    await alert.present();
  }
}
