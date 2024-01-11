import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertDialog } from '../../interface/alert-dialog.interface';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserResponse } from '../edit/edit-profile.page.interface';
import { phoneRegex, passwordRegex } from '../../constant/index';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.page.html',
  styleUrls: ['./change-phone.page.scss'],
})
export class ChangePhonePage implements OnInit {
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;

  user: UserResponse = {
    id: '',
    img: '',
    fullName: '',
    email: '',
    address: '',
    introduce: '',
  };

  isSubmitting: boolean = false;
  stepPassword: boolean = true;
  stepPhone: boolean = false;
  stepVerify: boolean = false;
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: Router,
    private translate: TranslateService
  ) {
    this.form1 = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(passwordRegex)]],
    });
    this.form2 = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
    });
    this.form3 = this.formBuilder.group({
      otp: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.authService.me().subscribe(
      (res: any) => {
        this.user = res;
        this.isLoading = false;
      },
      () => {
        this.route.navigate(['/auth/login']);
      }
    );
  }

  alertDialog = {
    header: this.translate.instant('NOTIFICATION.HEADER'),
    message: '',
    buttons: [
      {
        text: this.translate.instant('BUTTON.OK'),
        role: 'confirm',
        handler: () => {},
      },
    ],
  };

  submitPassword() {
    this.alertDialog = {
      ...this.alertDialog,
      message: this.translate.instant(
        'NOTIFICATION.CONTENT.CHECK_PASS_SUCCESS'
      ),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.stepPassword = false;
            this.stepPhone = true;
            this.stepVerify = false;
          },
        },
      ],
    };
    this.presentAlert(this.alertDialog);
    this.isSubmitting = false;
  }

  submitPhone() {
    this.alertDialog = {
      ...this.alertDialog,
      message: this.translate.instant(
        'NOTIFICATION.CONTENT.UPDATE_PHONE_SUCCESS'
      ),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.stepPassword = false;
            this.stepPhone = false;
            this.stepVerify = true;
          },
        },
      ],
    };

    this.presentAlert(this.alertDialog);
  }

  submitOTP() {
    this.alertDialog = {
      ...this.alertDialog,
      message: this.translate.instant('NOTIFICATION.CONTENT.PHONE_IS_UPDATED'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.router.navigate(['tabs/profile/security']);
          },
        },
      ],
    };

    this.presentAlert(this.alertDialog);
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
