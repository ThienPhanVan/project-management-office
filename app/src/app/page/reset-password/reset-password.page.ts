import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInput } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertDialog } from '../../interface/alert-dialog.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  phoneRegex,
  passwordRegex,
  emailPattern,
  MustMatch,
} from '../../constant/index';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetForm: FormGroup;
  isSubmitting: boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye';
  verifyCode: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.resetForm = this.initForm();

    this.route.queryParams.subscribe((params: any) => {
      this.verifyCode = params['code'];
      this.resetForm.patchValue({ verify_code: this.verifyCode });
    });
  }
  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }
  initForm() {
    return this.formBuilder.group(
      {
        verify_code: [null, [Validators.required]],
        new_password: [
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
    if (this.resetForm.valid) {
      this.isSubmitting = true;
      const params = {
        ...this.resetForm.value,
      };
      console.log(params);

      this.authService.resetPassword(params).subscribe(
        () => {
          alertDialog = {
            ...alertDialog,
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.RESET_PASSWORD_SUCCESSFULLY'
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
            'NOTIFICATION.CONTENT.RESET_PASSWORD_FAILURE'
          );
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
