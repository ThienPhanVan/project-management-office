import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseNotificationService, UserService } from '../../services';
import { AlertDialog, IOrganization } from '../../interface';
import { AlertController } from '@ionic/angular';
import { UserDetail } from '../../interface/user.interface';
import {
  NewsDataService,
  OrganizationDataService,
} from 'src/app/shared/services';
import { NewsService } from 'src/app/services/news.service';
import { convertDataNewsList } from 'src/app/constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security',
  templateUrl: './security.page.html',
  styleUrls: ['./security.page.scss'],
})
export class SecurityPage implements OnInit {
  query: any;
  languageId: string = 'vi';
  user: UserDetail = {
    address: '',
    code: '',
    color: '',
    created_by: '',
    created_date: '',
    description: '',
    display_order: '',
    email: '',
    id: '',
    name: '',
    organization_id: '',
    phone: '',
    thumbnail: '',
    updated_date: '',
    user_type: 0,
    username: '',
    verified_flag: 0,
    organization_user: '',
    position_id: '',
  };

  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private alertController: AlertController,
    private newsDataService: NewsDataService,
    private newsService: NewsService,
    private router: Router,
    private firebaseNotificationService: FirebaseNotificationService,
    private organizationDataService: OrganizationDataService
  ) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.languageId = JSON.parse(userStr).language ?? 'vi';
    }
  }

  onChangeLanguage(data: any) {
    const user = {
      ...this.user,
      language: data.key,
    };
    localStorage.setItem('user', JSON.stringify(user));

    this.userService.updateUser(user, this.user.id).subscribe((res) => {
      const alertDialog = {
        header: this.translate.instant('NOTIFICATION.HEADER'),
        message: this.translate.instant(
          'NOTIFICATION.CONTENT.UPDATE_LANGUAGE_SUCCESS'
        ),
        buttons: [
          {
            text: this.translate.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.getNewsList();
            },
          },
        ],
      };
      if (res && Object.keys(res).length > 0) {
        this.presentAlert(alertDialog);
      }
    });
    this.translate.setDefaultLang(data.key);
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

  //get news data
  getNewsList() {
    const queryStr = localStorage.getItem('searchQueryNews');
    if (queryStr) {
      this.query = JSON.parse(queryStr);
    }
    this.newsService.getNews(this.query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertDataNewsList(res.data);
        this.newsDataService.setMyNews(data);
      }
    });
  }

  //deactivate account
  deactivateAccount() {
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.DELETE'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.userService.deleteUser(this.user.id).subscribe(
              () => {
                let alertDialog = {
                  header: this.translate.instant('NOTIFICATION.HEADER'),
                  message: this.translate.instant(
                    'NOTIFICATION.CONTENT.DELETE_SUCCESS'
                  ),
                  buttons: [
                    {
                      text: this.translate.instant('BUTTON.OK'),
                      role: 'confirm',
                      handler: () => {
                        this.firebaseNotificationService.inactiveToken();

                        localStorage.clear();
                        this.organizationDataService.setMyOrganizations([
                          {} as IOrganization,
                        ]);
                        this.router.navigate(['/auth/login']);
                      },
                    },
                  ],
                };
                this.presentAlert(alertDialog);
              },
              () => {
                alertDialog = {
                  ...alertDialog,
                  message: this.translate.instant(
                    'NOTIFICATION.CONTENT.DELETE_FAILURE'
                  ),
                };
                this.presentAlert(alertDialog);
              }
            );
          },
        },
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {},
        },
      ],
    };
    this.presentAlert(alertDialog);
  }
}
