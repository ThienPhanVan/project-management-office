import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { emailPattern, phoneRegex, passwordRegex } from 'src/app/constant';
import { AlertDialog } from 'src/app/interface';
import { AuthService } from 'src/app/services';
import {
  RegisterRequestBody,
  RegisterResponse,
} from '../register/register.page.interface';
import { UserDetail } from 'src/app/interface/user.interface';

@Component({
  selector: 'app-register-invited',
  templateUrl: './register-invited.page.html',
  styleUrls: ['./register-invited.page.scss'],
})
export class RegisterInvitedPage implements OnInit {
  org: any = [
    {
      id: '0305129b-70bc-4338-97eb-50aafa9a0b8a',
      name: 'Organization name',
      description: 'string',
      display_order: null,
      color: null,
      code: null,
      created_date: null,
      created_by: '90e9a33e-1eac-4fc8-89d6-2bcfbcab79ec',
      updated_date: '2023-07-04T15:25:42.000Z',
      phone: 'string',
      address: null,
      thumbnail: null,
      status: 0,
      images: null,
      websites: null,
      socials: null,
      grade: null,
      rate: null,
      cover: null,
      avatar: null,
      vision: null,
      mission: null,
      core_values: null,
      city_id: null,
      country_id: null,
      working_time_start: null,
      working_time_end: null,
      verified_flag: 0,
    },
  ];

  orgLoading = false;

  registerForm: FormGroup;

  submitted: boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye';

  description: string = 'Bạn được mời vào vị trí CEO bởi người dùng TEST.';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(emailPattern)]],
      phone: [null, [Validators.required, Validators.pattern(phoneRegex)]],
      password: [
        null,
        [Validators.required, Validators.pattern(passwordRegex)],
      ],
    });
  }
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.authService.getInvitationInfo(id).subscribe((res: any) => {
      console.log(res);

      console.log(res.organization);

      this.org = [res.organization];
      this.orgLoading = true;
    });
  }

  //submit register form
  submit() {
    let alertDialog = {
      header: 'Thông báo',
      message: 'Đăng ký thành công!',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {},
        },
      ],
    };
    if (this.registerForm.valid) {
      this.submitted = true;
      const params: RegisterRequestBody = {
        ...this.registerForm.value,
      };
      this.authService.register(params).subscribe(
        (res: RegisterResponse) => {
          if (res && res.message) {
            alertDialog = {
              ...alertDialog,
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
            this.submitted = false;
          }
        },
        (error) => {
          alertDialog = {
            ...alertDialog,
            message: 'Đăng ký thất bại',
          };
          this.presentAlert(alertDialog);
          this.submitted = false;
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

  showModal: boolean = false;
  imagesString: string = '';
  getSrcImage(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }
}
