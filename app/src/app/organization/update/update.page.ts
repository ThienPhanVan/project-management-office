import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonModal } from '@ionic/angular';
import { OrganizationsService } from 'src/app/services/organization.service';
import { IBaseItem } from '../../interface/base-item.interface';
import { ICity } from 'src/app/interface/city.interface';
import { ICountry } from 'src/app/interface/country.interface';
import { COVER_URL, THUMBNAIL_URL, phoneRegex } from '../../constant/index';
import * as _ from 'lodash';
import { AlertDialog, IOrganizationSocial } from 'src/app/interface';
import { CountriesService } from 'src/app/services';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import {
  OrganizationDataService,
  ResourceAcessDataService,
} from '../../shared/services';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {
  @ViewChild('modalIndustry', { static: true }) modalIndustry!: IonModal;
  @ViewChild('modalService', { static: true }) modalService!: IonModal;

  organizationFormUpdate: FormGroup;
  organizationId: string | undefined = '';

  selectedIndustries: IBaseItem[] = [];
  selectedServices: IBaseItem[] = [];
  selectedCountry: ICountry = {} as ICountry;
  selectedCity: ICity = {} as ICity;
  socials: IOrganizationSocial = {} as IOrganizationSocial;
  countries: ICountry[] = [];

  workingTimeStart = new Date().toISOString();
  workingTimeEnd = new Date().toISOString();

  toastMessage: string = '';

  isDisplayError: Boolean = false;
  isDisplayWorkingTime: Boolean = false;
  isUpdating: boolean = false;
  isBackground: boolean = true;
  isLogo: boolean = true;
  isUploadImageBg: boolean = false;
  isUploadImageLogo: boolean = false;
  isWebsiteError: boolean = false;
  isFacebookError: boolean = false;
  isInstagramError: boolean = false;
  isYoutubeError: boolean = false;

  constructor(
    private organizationsService: OrganizationsService,
    private countriesService: CountriesService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private organizationDataService: OrganizationDataService,
    private masterDataService: MasterDataService,
    private translate: TranslateService,
    private location: Location,
    private alertController: AlertController,
    private resourceAcessDataService: ResourceAcessDataService
  ) {
    this.organizationFormUpdate = this.initOrganizationForm();
    this.getCountries();
  }

  initOrganizationForm() {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
      code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      city_id: [''],
      country_id: [null, [Validators.required]],
      address: ['', [Validators.required]],
      industries: [[], [Validators.required]],
      services: [[], [Validators.required]],
      description: '',
      vision: '',
      mission: '',
      core_values: '',
      websites: '',
      thumbnail: THUMBNAIL_URL,
      cover: COVER_URL,
    });
  }

  ngOnInit() {
    this.get();
  }

  setIsUploadImage(value: boolean) {
    return (this.isUploadImageBg = value);
  }

  setIsUploadImageLogo(value: boolean) {
    return (this.isUploadImageLogo = value);
  }

  get() {
    this.organizationId = this.route.snapshot.paramMap
      .get('organizationId')
      ?.toString();
    if (this.organizationId) {
      const params = {
        include: 'industries,services,country,city',
      };
      this.organizationsService
        .getOrganization(this.organizationId, params)
        .subscribe((res) => {
          if (res) {
            this.organizationFormUpdate.patchValue(res);
            this.socials = JSON.parse(res.socials) as IOrganizationSocial;
            this.selectedIndustries = res.industries;
            this.selectedServices = res.services;
            this.selectedCity = res.city || ({} as ICity);
            this.selectedCountry = res.country || ({} as ICountry);
          }
        });
    }
  }

  update(org: any) {
    this.isUpdating = true;
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

    if (this.organizationId) {
      this.organizationsService
        .updateOrganization(org, this.organizationId)
        .subscribe(
          () => {
            alertDialog = {
              ...alertDialog,
              message: this.translate.instant(
                'NOTIFICATION.CONTENT.UPDATE_SUCCESS'
              ),
              buttons: [
                {
                  text: this.translate.instant('BUTTON.OK'),
                  role: 'confirm',
                  handler: () => {
                    this.refreshMyOrganizations();
                    this.router.navigate(['/tabs/profile']);
                    this.isUpdating = false;
                  },
                },
              ],
            };

            this.presentAlert(alertDialog);
          },
          () => {
            this.isUpdating = false;
            alertDialog = {
              ...alertDialog,
              message: this.translate.instant(
                'NOTIFICATION.CONTENT.UPDATE_FAILURE'
              ),
            };

            this.presentAlert(alertDialog);
          }
        );
    } else {
      this.isUpdating = false;
      alertDialog = {
        ...alertDialog,
        message: this.translate.instant('NOTIFICATION.CONTENT.UPDATE_FAILURE'),
      };

      this.presentAlert(alertDialog);
    }
  }

  setCoverImage(event: any) {
    this.setIsUploadImage(true);
    if (event?.target?.files && event?.target?.files[0]) {
      this.organizationsService
        .onFileSelected(event.target.files[0], new Date().getDate())
        .subscribe((res: any) => {
          if (res.body && res.body.Location) {
            this.organizationFormUpdate.patchValue({
              cover: res.body.Location,
            });
            this.actionSubmit();
            this.setIsUploadImage(false);
          }
        });
    }
  }

  setThumbnail(event: any) {
    this.setIsUploadImageLogo(true);
    if (event?.target?.files && event?.target?.files[0]) {
      this.organizationsService
        .onFileSelected(event.target.files[0], new Date().getDate())
        .subscribe((res: any) => {
          if (res.body && res.body.Location) {
            this.organizationFormUpdate.patchValue({
              thumbnail: res.body.Location,
            });
            this.actionSubmit();
            this.setIsUploadImageLogo(false);
          }
        });
    }
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

  industrySelectionChanged(industries: IBaseItem[]) {
    this.selectedIndustries = industries;
    this.organizationFormUpdate.patchValue({
      industries: _.map(this.selectedIndustries, 'id'),
    });
    this.modalIndustry.dismiss();
  }

  serviceSelectionChanged(services: IBaseItem[]) {
    this.selectedServices = services;
    this.organizationFormUpdate.patchValue({
      services: _.map(this.selectedServices, 'id'),
    });
    this.modalService.dismiss();
  }

  countrySelectionChanged(country: ICountry) {
    if (country.id !== this.selectedCountry.id) {
      this.organizationFormUpdate.patchValue({
        country_id: country.id,
        city_id: null,
      });
      this.selectedCountry = country;
      this.selectedCity = {} as ICity;
    }
  }

  citySelectionChanged(city: ICity) {
    this.organizationFormUpdate.patchValue({ city_id: city.id });
    this.selectedCity = city;
  }

  checkSocialsValid() {
    const regex = new RegExp('^(http|https)://');
    if (
      this.organizationFormUpdate.value.websites &&
      !regex.test(this.organizationFormUpdate.value.websites.trim())
    ) {
      this.isWebsiteError = true;
    } else {
      this.isWebsiteError = false;
    }

    if (this.socials?.facebook && !regex.test(this.socials.facebook.trim())) {
      this.isFacebookError = true;
    } else {
      this.isFacebookError = false;
    }

    if (this.socials?.instagram && !regex.test(this.socials.instagram.trim())) {
      this.isInstagramError = true;
    } else {
      this.isInstagramError = false;
    }

    if (this.socials?.youtube && !regex.test(this.socials.youtube.trim())) {
      this.isYoutubeError = true;
    } else {
      this.isYoutubeError = false;
    }

    return (
      !this.isWebsiteError &&
      !this.isFacebookError &&
      !this.isInstagramError &&
      !this.isYoutubeError
    );
  }

  actionSubmit() {
    if (this.organizationFormUpdate.valid) {
      this.isUpdating = true;
      let org = this.organizationFormUpdate.value;
      _.assign(org, {
        socials: JSON.stringify(this.socials),
      });
      this.update(org);
    } else {
      this.isDisplayError = true;
    }
  }

  closeToast() {
    this.toastMessage = '';
  }

  goBack() {
    this.location.back();
  }

  // delete() {
  //   if (this.organizationId) {
  //     this.organizationsService
  //       .deleteOrganization(this.organizationId)
  //       .subscribe(
  //         () => {
  //           this.refreshMyOrganizations();
  //           this.toastMessage = this.getMessageDeleteSuccess();
  //           setTimeout(() => {
  //             this.router.navigate(['/tabs/profile']);
  //           }, 500);
  //         },
  //         () => {
  //           this.toastMessage = this.translate.instant(
  //             'NOTIFICATION.CONTENT.ORGANIZATION_DELETE_FAILURE'
  //           );
  //         }
  //       );
  //   }
  // }

  // getMessageDeleteSuccess() {
  //   return (
  //     this.translate.instant(
  //       'NOTIFICATION.PASSAGE.ORGANIZATION_DELETE_SUCCESS.ORGANIZATION_DELETE'
  //     ) +
  //     ' ' +
  //     this.organizationFormUpdate.value.name +
  //     ' ' +
  //     this.translate.instant(
  //       'NOTIFICATION.PASSAGE.ORGANIZATION_DELETE_SUCCESS.SUCCESS'
  //     )
  //   );
  // }

  refreshMyOrganizations() {
    const user_id = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    if (user_id) {
      const query = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,childen_organization_users,children_organization_users_position,children_organization_users_iam_group,iam_groups,chapters',
        user_id: user_id,
      };
      this.organizationsService.getOrganizations(query).subscribe((orgs) => {
        this.organizationDataService.setMyOrganizations(orgs.data);
      });
    }
  }

  hasPermission(permission: string): boolean {
    return this.resourceAcessDataService.hasPermission(
      permission,
      this.organizationId || '',
      'organization'
    );
  }

  onActionSheet(ev: any) {
    const type = ev.detail.data?.action;
    if (type === 'delete') {
      this.presentDeleteAlert();
    }
  }

  getActionSheetButtons() {
    let actionSheetButtons = [
      {
        text: this.translate.instant('BUTTON.CANCEL'),
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ];
    if (this.hasPermission('DELETE_ORGANIZATION')) {
      actionSheetButtons = [
        ...actionSheetButtons,
        {
          text: this.translate.instant('BUTTON.DELETE'),
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
      ];
    }
    return actionSheetButtons;
  }

  async presentDeleteAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant(
        'NOTIFICATION.QUESTION.ORGANIZATION_DELETE'
      ),
      buttons: [
        {
          text: this.translate.instant('BUTTON.DELETE'),
          role: 'destructive',
          handler: () => {
            this.deleteOrg();
          },
        },
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }

  showModalImageZoom: boolean = false;
  imagesString: string = '';
  getSrcImage(thumbnail: string) {
    this.showModalImageZoom = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModalImageZoom = value;
    this.imagesString = '';
  }

  deleteOrg() {
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.DELETE'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            if (this.organizationId) {
              this.organizationsService
                .deleteOrganization(this.organizationId)
                .subscribe(
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
                            this.refreshMyOrganizations();
                            this.router.navigate(['/tabs/profile']);
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
            } else {
              alertDialog = {
                ...alertDialog,
                message: this.translate.instant(
                  'NOTIFICATION.CONTENT.DELETE_FAILURE'
                ),
              };
              this.presentAlert(alertDialog);
            }
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
