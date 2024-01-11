import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertDialog } from 'src/app/interface/alert-dialog.interface';
import { AuthService } from 'src/app/services/auth.service';
import { LoginRequestBody } from './login.page.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { phoneRegex, passwordRegex } from '../../constant/index';
import {
  MasterDataService,
  ResourceAcessDataService,
} from '../../shared/services';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseNotificationService } from 'src/app/services';

@Component({
  selector: 'nx-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  isSubmitting: Boolean = false;
  loginForm: FormGroup;

  loginFalse: Boolean = false;
  loginFalseReason: string = '';

  passwordType: string = 'password';
  passwordIcon: string = 'eye';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private route: Router,
    private formBuilder: FormBuilder,
    private masterDataService: MasterDataService,
    private resourceAcessDataService: ResourceAcessDataService,
    private translate: TranslateService,
    private firebaseNotificationService: FirebaseNotificationService
  ) {
    localStorage.clear();
    this.isSubmitting = false;
    masterDataService.meBus$.next({});
    this.loginForm = this.formBuilder.group({
      phone: [null, [Validators.required, Validators.pattern(phoneRegex)]],
      password: [
        null,
        [Validators.required, Validators.pattern(passwordRegex)],
      ],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.loginForm.reset();
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  //login
  submit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      const queryBody: LoginRequestBody = {
        ...this.loginForm.value,
      };
      this.authService.login(queryBody).subscribe(
        async (res) => {
          if (res && res.access_token && res.user) {
            localStorage.setItem('access_token', res.access_token);
            localStorage.setItem('user', JSON.stringify(res.user));
            localStorage.setItem('noel', 'noel');
            this.firebaseNotificationService.registerToken(res.user.id);

            this.getMe();
            this.getResouceAccess();
          }
          this.isSubmitting = false;
        },
        (error) => {
          this.isSubmitting = false;
          this.loginFalse = true;
          if (error.statusText === 'Unauthorized') {
            this.loginFalseReason = this.translate.instant(
              'NOTIFICATION.CONTENT.LOGIN_FAILURE_CLIENT'
            );
          } else {
            this.loginFalseReason = this.translate.instant(
              'NOTIFICATION.CONTENT.LOGIN_FAILURE_SERVER'
            );
          }
        }
      );
    }
  }

  getMe() {
    this.authService.me().subscribe(
      (res: any) => {
        this.masterDataService.setMe(res);
        this.route.navigate(['/tabs']);
      },
      () => {
        this.route.navigate(['/auth/login']);
      }
    );
  }

  getResouceAccess() {
    this.authService.resourceAccess().subscribe(
      (res: any) => {
        this.resourceAcessDataService.setResourceAcess(res);
      },
      () => {
        this.route.navigate(['/auth/login']);
      }
    );
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

  redirectRegister() {
    this.router.navigate(['/auth/register']);
  }

  get errorControl() {
    return this.loginForm.controls;
  }
}
