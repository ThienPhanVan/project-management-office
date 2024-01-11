import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertDialog } from 'src/app/interface/alert-dialog.interface';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { THUMBNAIL_URL, emailPattern } from '../../constant';
import { ICountry, ICity } from '../../interface';
import { AuthService, CountriesService } from '../../services';
import { MasterDataService } from '../../shared/services';
import { DEFAULT_BIRTHDAY } from '../../constant';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  form: FormGroup;
  userId: string = '';

  selectedCountry: ICountry = {} as ICountry;
  selectedCity: ICity = {} as ICity;
  countries: ICountry[] = [];

  toastMessage: string = '';

  isLoading: boolean = true;
  isErrorImg: boolean = false;
  isSubmitting: boolean = false;
  

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private masterDataService: MasterDataService,
    private countriesService: CountriesService,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.form = this.initFormControl();
    this.getCountries();
  }

  initFormControl() {
    return this.formBuilder.group({
      img: [THUMBNAIL_URL, [Validators.required]],
      username: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(emailPattern)]],
      address: [null, [Validators.maxLength(255)]],
      description: [null, [Validators.maxLength(500)]],
      city_id: [null, [Validators.required]],
      country_id: [null, [Validators.required]],
      gender: [null],
      birthday: [DEFAULT_BIRTHDAY],
      is_public_phone: [null]
    });
  }

  ngOnInit() {
    this.getMe();
  }

  actionSubmit() {
    this.isSubmitting = true;
    this.update();
  }

  update() {
    if (this.userId) {
      this.userService.updateUser(this.form.value, this.userId).subscribe(
        (res) => {
          this.isSubmitting = false;
          this.toastMessage = this.translate.instant(
            'NOTIFICATION.CONTENT.UPDATE_PROFILE_SUCCESS'
          );
          localStorage.setItem('user', JSON.stringify(res));
          this.refreshMe();
        },
        () => {
          this.isSubmitting = false;
          this.toastMessage = this.translate.instant(
            'NOTIFICATION.CONTENT.UPDATE_PROFILE_FAILURE'
          );
        }
      );
    }
  }

  closeToast() {
    this.toastMessage = '';
  }

  getMe() {
    this.masterDataService.meBus$.subscribe((res: any) => {
      if (!res.birthday) {
        res['birthday'] = DEFAULT_BIRTHDAY;
      }
      this.form.patchValue(res);
      this.selectedCity = res.city || ({} as ICity);
      this.selectedCountry = res.country || ({} as ICountry);
      this.userId = res.id;
      this.isLoading = false;
    });
  }

  refreshMe() {
    this.authService.me().subscribe(
      (res: any) => {
        this.masterDataService.setMe(res);
      },
      () => {
        this.router.navigate(['/auth/login']);
      }
    );
  }

  getCountries() {
    this.countriesService
      .getCountries({ limit: 0, include: 'cities' })
      .subscribe((res: any) => {
        this.masterDataService.setCountries(res.data);
      });
    this.masterDataService.countries$.subscribe((value) => {
      if (value.length > 0) {
        this.countries = value;
      }
    });
  }

  countrySelectionChanged(country: ICountry) {
    this.form.patchValue({ country_id: country.id, city_id: null });
    this.selectedCountry = country;
    this.selectedCity = {} as ICity;
  }

  citySelectionChanged(city: ICity) {
    this.form.patchValue({ city_id: city.id });
    this.selectedCity = city;
  }

  //
  setCoverImage(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.form.controls['img'].setValue('');
      return;
    }

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.isErrorImg = true;
    } else {
      this.isErrorImg = false;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        this.form.controls['img'].setValue(reader.result);
        // this.user.img = reader.result || ''
      };
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
