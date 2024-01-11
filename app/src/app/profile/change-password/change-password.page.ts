import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertDialog } from '../../interface/alert-dialog.interface';
import { AuthService } from '../../services/auth.service';
import { ChangePasswordRequest } from '../../interface/change-password.interface';
import { passwordRegex } from '../../constant/index';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  isSubmitting: Boolean = false;
  form: FormGroup;

  oldPasswordType: string = 'password';
  oldPasswordIcon: string = 'eye';

  newPasswordType: string = 'password';
  newPasswordIcon: string = 'eye';

  confirmPasswordType: string = 'password';
  confirmPasswordIcon: string = 'eye';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.form = this.formBuilder.group({
      old_password: [
        null,
        [Validators.required, Validators.pattern(passwordRegex)],
      ],
      new_password: [
        null,
        [Validators.required, Validators.pattern(passwordRegex)],
      ],
      confirm_password: [
        null,
        [Validators.required, Validators.pattern(passwordRegex)],
      ],
    });
  }

  ngOnInit() {
    this.form.clearAsyncValidators();
  }

  submit() {
    const params: ChangePasswordRequest = {
      old_password: this.form.value.old_password,
      new_password: this.form.value.new_password,
    };
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
    if (this.form.valid) {
      this.isSubmitting = true;
      this.authService.changePassword(params).subscribe((res) => {
        if (res) {
          alertDialog = {
            ...alertDialog,
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.UPDATE_PASSWORD_SUCCESS'
            ),
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
          this.isSubmitting = false;
          this.presentAlert(alertDialog);
        } else {
          alertDialog = {
            ...alertDialog,
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.UPDATE_PASSWORD_FAILURE'
            ),
          };
          this.isSubmitting = false;
          this.presentAlert(alertDialog);
        }
      });
    }
  }

  hideShowNewPassword() {
    this.newPasswordType =
      this.newPasswordType === 'text' ? 'password' : 'text';
    this.newPasswordIcon =
      this.newPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  hideShowOldPassword() {
    this.oldPasswordType =
      this.oldPasswordType === 'text' ? 'password' : 'text';
    this.oldPasswordIcon =
      this.oldPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  hideShowConfirmPassword() {
    this.confirmPasswordType =
      this.confirmPasswordType === 'text' ? 'password' : 'text';
    this.confirmPasswordIcon =
      this.confirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
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
