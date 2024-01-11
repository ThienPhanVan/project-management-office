import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonInput } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertDialog } from '../../interface/alert-dialog.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  RegisterRequestBody,
  RegisterResponse,
} from './register.page.interface';
import {
  phoneRegex,
  passwordRegex,
  emailPattern,
  MustMatch,
} from '../../constant/index';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'nx-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;
  isSubmitting: boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this.registerForm = this.initForm();
  }

  initForm() {
    return this.formBuilder.group(
      {
        username: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.pattern(emailPattern)]],
        phone: [null, [Validators.required, Validators.pattern(phoneRegex)]],
        password: [
          null,
          [Validators.required, Validators.pattern(passwordRegex)],
        ],
        confirmPassword: [
          null,
          [Validators.required, Validators.pattern(passwordRegex)],
        ],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  //submit register form
  submit() {
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: '',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {},
        },
      ],
    };
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      const params: RegisterRequestBody = {
        ...this.registerForm.value,
      };
      this.authService.register(params).subscribe(
        () => {
          alertDialog = {
            ...alertDialog,
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.REGISTER_USER_SUCCESS'
            ),
            buttons: [
              {
                ...alertDialog.buttons[0],
                handler: () => {
                  this.router.navigate(['login']);
                },
              },
            ],
          };

          this.presentAlert(alertDialog);
          this.isSubmitting = false;
        },
        (error) => {
          let errMessage = this.translate.instant(
            'NOTIFICATION.CONTENT.REGISTER_USER_FAILURE'
          );
          if (error.code === 'US0401') {
            errMessage = this.translate.instant(
              'NOTIFICATION.CONTENT.ACCOUNT_EXISTS'
            );
          }
          alertDialog = {
            ...alertDialog,
            message: errMessage,
          };
          this.presentAlert(alertDialog);
          this.isSubmitting = false;
        }
      );
    }
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
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

  //redirect login form
  redirectLogin() {
    this.router.navigate(['login']);
  }
}
