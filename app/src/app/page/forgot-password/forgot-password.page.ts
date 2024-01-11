import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertDialog } from '../../interface/alert-dialog.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import {
  ForgotPasswordResponse,
  ForgotPasswordResquest,
} from './forgot-password.page.interface';
import { emailPattern } from '../../constant/index';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'nx-register',
  templateUrl: 'forgot-password.page.html',
  styleUrls: ['forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  forgotForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
    });
  }

  //submit send email
  submit() {
    let alertDialog = {
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

    if (this.forgotForm.valid) {
      this.isSubmitting = true;
      const params: ForgotPasswordResquest = {
        ...this.forgotForm.value,
      };
      this.authService.forgotPassword(params).subscribe(
        (res: ForgotPasswordResponse) => {
          if (res) {
            alertDialog = {
              ...alertDialog,
              buttons: [
                {
                  ...alertDialog.buttons[0],
                  handler: () => {
                    this.router.navigate(['reset-password']);
                  },
                },
              ],
            };

            this.presentAlert(alertDialog);
            this.isSubmitting = false;
          }
        },
        () => {
          alertDialog = {
            ...alertDialog,
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.SEND_MAIL_FAILURE'
            ),
          };
          this.presentAlert(alertDialog);
          this.isSubmitting = false;
        }
      );
    }
  }

  //redirect login
  redirectLogin() {
    this.router.navigate(['login']);
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
