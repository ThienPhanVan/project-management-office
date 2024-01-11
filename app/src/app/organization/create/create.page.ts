import * as _ from 'lodash';
import * as moment from 'moment';
import {
  IBaseItem,
  ICity,
  ICountry,
  IOrganizationSocial,
} from 'src/app/interface';
import { OrganizationsService } from 'src/app/services/organization.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';

import { COVER_URL, phoneRegex, LOGO_ORG_URL } from '../../constant/index';
import { AuthService, CountriesService } from '../../services';
import {
  MasterDataService,
  ResourceAcessDataService,
  OrganizationDataService,
} from '../../shared/services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  @ViewChild('modalIndustry', { static: true }) modalIndustry!: IonModal;
  @ViewChild('modalService', { static: true }) modalService!: IonModal;

  organizationFormCreate: FormGroup;

  selectedServices: IBaseItem[] = [];
  selectedIndustries: IBaseItem[] = [];
  socials: IOrganizationSocial = {} as IOrganizationSocial;
  countries: ICountry[] = [];
  selectedCountry: ICountry = {} as ICountry;
  selectedCity: ICity = {} as ICity;
  isCreating: Boolean = false;
  idCreateBranchOrganization: string | undefined = '';

  isBackground: boolean = true;
  isLogo: boolean = true;
  isUploadImageBg: boolean = false;
  isUploadImageLogo: boolean = false;
  isDisplayWorkingTime: Boolean = false;
  isDisplayError: Boolean = false;
  toastMessage: string = '';
  isWebsiteError: boolean = false;
  isFacebookError: boolean = false;
  isInstagramError: boolean = false;
  isYoutubeError: boolean = false;
  constructor(
    private organizationsService: OrganizationsService,
    private resourceAcessDataService: ResourceAcessDataService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private countriesService: CountriesService,
    private masterDataService: MasterDataService,
    private location: Location,
    private authService: AuthService,
    private organizationDataService: OrganizationDataService
  ) {
    this.organizationFormCreate = this.initOrganizationFormCreate();
    this.idCreateBranchOrganization = this.route.snapshot.paramMap
      .get('organizationId')
      ?.toString();
    this.getCountries();
  }

  ngOnInit() {}

  initOrganizationFormCreate() {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
      code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      city_id: '',
      country_id: [null, [Validators.required]],
      description: '',
      address: ['', [Validators.required]],
      vision: '',
      mission: '',
      core_values: '',
      websites: '',
      thumbnail: LOGO_ORG_URL,
      cover: COVER_URL,
      working_time_start: moment(),
      working_time_end: moment(),
    });
  }

  setIsUploadImage(value: boolean) {
    return (this.isUploadImageBg = value);
  }

  setIsUploadImageLogo(value: boolean) {
    return (this.isUploadImageLogo = value);
  }

  create(params: any) {
    if (this.idCreateBranchOrganization) {
      params = {
        ...params,
        parent_id: this.idCreateBranchOrganization,
      };
    }
    this.organizationsService.addOrganization(params).subscribe(
      () => {
        this.isCreating = false;

        if (this.idCreateBranchOrganization) {
          this.refreshOrganizationDetail(this.idCreateBranchOrganization);
        } else {
          this.refreshMyOrganizations();
          this.refreshResourceAcess();
          this.resetForm();
        }
        this.goBack();
      },
      () => {
        this.isCreating = false;
      }
    );
  }

  resetForm() {
    this.organizationFormCreate = this.initOrganizationFormCreate();
    this.selectedCountry = {} as ICountry;
    this.selectedCity = {} as ICity;
    this.selectedIndustries = [];
    this.selectedServices = [];
  }

  refreshOrganizationDetail(orgId: string) {
    if (orgId) {
      const orgQuery = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,iam_groups,chapters,childen_organization_users,children_organization_users_position,children_organization_users_iam_group',
      };
      this.organizationsService
        .getOrganization(orgId, orgQuery)
        .subscribe((res) => {
          if (res) {
            this.organizationDataService.setOrganizationDetail(res);
          }
        });
    }
  }

  refreshMyOrganizations() {
    const user_id = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    if (!_.isNil(user_id)) {
      const query = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,childen_organization_users,children_organization_users_position,children_organization_users_iam_group,iam_groups,chapters',
        user_id: user_id,
      };
      this.organizationsService.getOrganizations(query).subscribe((res) => {
        this.organizationDataService.setMyOrganizations(res.data);
      });
    }
  }

  refreshResourceAcess() {
    this.authService.resourceAccess().subscribe((res: any) => {
      this.resourceAcessDataService.setResourceAcess(res);
    });
  }

  setCoverImage(event: any) {
    this.setIsUploadImage(true);
    if (event?.target?.files && event?.target?.files[0]) {
      this.organizationsService
        .onFileSelected(event.target.files[0], new Date().getDate())
        .subscribe((res: any) => {
          if (res.body && res.body.Location) {
            this.organizationFormCreate.patchValue({
              cover: res.body.Location,
            });
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
            this.organizationFormCreate.patchValue({
              thumbnail: res.body.Location,
            });
            this.setIsUploadImageLogo(false);
          }
        });
    }
  }

  closeToast() {
    this.toastMessage = '';
  }

  industrySelectionChanged(industries: IBaseItem[]) {
    this.selectedIndustries = industries;
    this.modalIndustry.dismiss();
  }

  serviceSelectionChanged(services: IBaseItem[]) {
    this.selectedServices = services;
    this.modalService.dismiss();
  }

  countrySelectionChanged(country: ICountry) {
    this.organizationFormCreate.patchValue({
      country_id: country.id,
      city_id: null,
    });
    this.selectedCountry = country;
    this.selectedCity = {} as ICity;
  }

  citySelectionChanged(city: ICity) {
    this.organizationFormCreate.patchValue({ city_id: city.id });
  }

  getCountries() {
    this.countriesService
      .getCountries({ limit: 0, include: 'cities' })
      .subscribe((res: any) => {
        this.masterDataService.setCountries(res.data);
      });
    this.masterDataService.countries$.subscribe((value: any) => {
      if (value.length > 0) {
        this.countries = value;
      }
    });
  }

  checkSocialsValid() {
    const regex = new RegExp('^(http|https)://');
    if (
      this.organizationFormCreate.value.websites &&
      !regex.test(this.organizationFormCreate.value.websites.trim())
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
    const isValid = this.checkSocialsValid();

    if (isValid) {
      if (this.organizationFormCreate.valid) {
        this.isCreating = true;

        const org = this.organizationFormCreate.value;

        _.assign(org, {
          industries: _.map(this.selectedIndustries, 'id'),
          services: _.map(this.selectedServices, 'id'),
          socials: JSON.stringify(this.socials),
        });
        this.create(org);
      } else {
        this.isDisplayError = true;
      }
    }
  }

  goBack() {
    this.location.back();
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
