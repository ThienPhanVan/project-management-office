import { Component, OnInit } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import {
  THUMBNAIL_URL,
  convertDataNewsDetail,
  convertDataNewsList,
  convertTimeToFromNow,
} from '../../../constant';
import { AuthService, OrganizationsService } from '../../../services';
import {
  IdIndexImageEmit,
  NewsListResponse,
  NewsResponse,
} from '../../../interface/news.interface';
import { Editor, Toolbar } from 'ngx-editor';
import { NewsService } from '../../../services/news.service';
import { AlertDialog } from '../../../interface';
import { NewsDataService } from '../../../shared/services';
import { type } from 'os';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreateOpportunityPage implements OnInit {
  titlePage: string = '';
  editor: Editor;
  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike', 'blockquote'],
    // ['code', 'blockquote'],
    // ['ordered_list', 'bullet_list'],
    // ['link'],
    // ['text_color', 'background_color'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
    // ['horizontal_rule', 'format_clear'],
  ];

  industries: any[] = [];
  isIndustry: boolean = false;
  isShowDateEnd: boolean = false;
  isLoading: boolean = false;
  form: FormGroup;
  isCreate: boolean = false;
  isEdit: boolean = false;
  isValidPrice: boolean = false;
  hashtag: string = '';
  arrayTag: string[] = [];
  data: any = {
    listImages: [],
  };
  isLoadingUpload: boolean = false;
  isSubmitting: boolean = false;
  query: any;
  typePrice: number = 0;
  isGetPrice: boolean = false;
  organizations: any[] = [];
  organization: any;
  minimumPrice: any;
  dayNow: any = moment().format('YYYY-MM-DD');

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private newsService: NewsService,
    private alertController: AlertController,
    private newsDataService: NewsDataService,
    private organizationsService: OrganizationsService,
    private router: Router
  ) {
    this.editor = new Editor({
      keyboardShortcuts: true,
    });
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      content: ['', [Validators.required]],
      event_date_start: [moment().format('YYYY-MM-DD'), [Validators.required]],
      event_date_end: [moment().format('YYYY-MM-DD')],
      start_time: ['07:00', [Validators.required]],
      end_time: ['07:00'],
      minimum_price: [0],
      industry_id: [''],
      requirement: [''],
      location: [''],
      organization_id: [''],
    });
  }

  ngOnInit(): void {
    this.isEdit = false;
    const queryStr = localStorage.getItem('searchQueryNews');
    if (queryStr) {
      this.query = JSON.parse(queryStr);
    }

    if (this.query?.organization_id) {
      const orgQuery = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,iam_groups,chapters,childen_organization_users,children_organization_users_position,children_organization_users_iam_group,summary',
      };
      this.organizationsService
        .getOrganization(this.query?.organization_id, orgQuery)
        .subscribe((res) => {
          this.organization = res;
        });
    }

    if (this.route.snapshot.params['id']) {
      this.isLoading = true;
      this.titlePage = this.translateService.instant(
        'TAB.HOME.OPPORTUNITY_TYPE.UPDATE'
      );
      this.isEdit = true;
      this.isCreate = false;
      this.newsService
        .getNew(this.route.snapshot.params['id'])
        .subscribe((res: NewsResponse) => {
          if (res) {
            const data = convertDataNewsDetail(res);
            this.data = data;
            if (data?.tags) {
              const tags: string[] = [];
              data.tags?.forEach((el: any) => {
                tags.push(el.name);
              });
              this.arrayTag = tags;
            }
            this.isShowDateEnd = this.data.event_date_end ? true : false;
            this.form.patchValue({
              content: data?.content,
              event_date_start: moment(data.start_date_event).format(
                'YYYY-MM-DD'
              ),
              event_date_end: data.end_date_event
                ? moment(data.end_date_event).format('YYYY-MM-DD')
                : moment(data.start_date_event).format('YYYY-MM-DD'),
              start_time: data.start_time,
              end_time: data.end_time ? data.end_time : '07:00',
              minimum_price: data?.minimum_price,
              industry_id: data?.industry_id,
              requirement: data?.requirement,
              location: data?.location,
              name: data.name,
              organization_id: data?.organization?.id,
            });
            if (data?.minimum_price > 0) {
              this.typePrice = 1;
              this.isGetPrice = true;
            } else {
              this.typePrice = data.minimum_price;
              this.isGetPrice = false;
            }
            this.query.type = data.type.toString();
          }

          this.isLoading = false;
        });
    } else {
      this.titlePage = this.translateService.instant(
        'TAB.HOME.OPPORTUNITY_TYPE.CREATE'
      );
      this.typePrice = 0;
      this.isGetPrice = false;
      this.isCreate = true;
      this.isEdit = false;
    }

    const userStr = localStorage.getItem('user');
    let user;
    if (userStr) {
      user = JSON.parse(userStr);
    }
    this.getIndustries();
    this.getOrgs(user);
  }

  //go back
  goBackCreate() {
    let alertDialog = {
      header: this.translateService.instant('NOTIFICATION.HEADER'),
      message: '',
      buttons: [
        {
          text: this.translateService.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {},
        },
      ],
    };

    if (this.route.snapshot.params['id']) {
      alertDialog = {
        ...alertDialog,
        message: this.translateService.instant(
          'NOTIFICATION.CONTENT.UPDATE_CANCEL'
        ),
        buttons: [
          {
            text: this.translateService.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.goBack();
            },
          },
        ],
      };
    } else {
      alertDialog = {
        ...alertDialog,
        message: this.translateService.instant(
          'NOTIFICATION.CONTENT.CREATE_CANCEL'
        ),
        buttons: [
          {
            text: this.translateService.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.goBack();
            },
          },
          {
            text: this.translateService.instant('BUTTON.CANCEL'),
            role: 'cancel',
            handler: () => {},
          },
        ],
      };
    }
    this.presentAlert(alertDialog);
  }

  goBack() {
    this.location.back();
  }

  getIndustries(q?: string) {
    this.isIndustry = true;
    let query: any = {};
    if (q && q !== '%%') {
      query = {
        q,
      };
    }
    this.newsService.getIndustries(query).subscribe((res: any) => {
      if (res && res.data) {
        // this.convertNewsData(res);
        this.industries = res.data;
      }
      this.isIndustry = false;
    });
  }

  getOrgs(user: any) {
    const query = {
      offset: 0,
      user_id: user.id,
    };
    this.organizationsService.getOrganizations(query).subscribe((res: any) => {
      if (res && res.data) {
        this.organizations = res.data;
      }
    });
  }

  //clear choose org
  clearOrg() {
    this.form.patchValue({
      organization_id: '',
    });
  }

  onShowDateEnd(value: boolean) {
    return (this.isShowDateEnd = value);
  }

  //on time event end
  onTimeEventDateEnd(ev: any) {
    let event_date_end = moment(ev.target.value).format('YYYY-MM-DD');
    this.form.patchValue({
      event_date_end: event_date_end,
    });
  }

  //get hashtag
  onGetHasTag(hashtag: string) {
    this.hashtag = hashtag;
  }

  //get array tag
  onGetArrayHashtag(array: Array<string>) {
    this.arrayTag = array;
  }

  //get Price
  onPrice(price: any) {
    if (price === -1) {
      this.isValidPrice = true;
    } else {
      this.isValidPrice = false;
      this.minimumPrice = price;
    }
  }

  //choose categories id
  onChooseData(item: any) {
    this.form.controls['industry_id'].patchValue(item.id);
  }

  //search categories
  onSearchQuery(q: string) {
    this.getIndustries(`%${q}%`);
  }

  removeName: boolean = false;
  //create categories
  onCreateData(name: string) {
    this.isIndustry = true;
    const params = {
      name,
    };
    this.newsService.addIndustry(params).subscribe((res: any) => {
      if (res) {
        this.getIndustries();
        this.removeName = true;
      }
    });
  }

  //remove image in array
  handleRemoveImage(object: IdIndexImageEmit) {
    const dataImages: any = [];
    if (object.isCreate) {
      this.data.listImages.forEach((el: any, i: number) => {
        if (i !== object.index) dataImages.push(el);
      });
      this.data.listImages = dataImages;
    } else {
      this.data.listImages.forEach((el: any, i: number) => {
        if (i !== object.index) dataImages.push(el);
      });
      this.data.listImages = dataImages;
    }
  }

  //add image for array
  async handleAddImage(event: any) {
    this.isLoadingUpload = true;
    let dataImages: any = [...this.data.listImages];
    if (dataImages.length === 0) {
      dataImages.push({
        name: '',
        image_url: '',
        description: '',
        resource_id: this.data.id ? this.data.id : null,
      });
    }
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }

    for (let i: number = 0; i < event.target.files.length; i++) {
      if (
        i === 0 &&
        dataImages.length === 1 &&
        dataImages[0].image_url === ''
      ) {
        var mimeType = event.target.files[i].type;
        if (
          mimeType.match(/image\/*/) !== null ||
          mimeType.match(/video\/*/) !== null
        ) {
          await this.newsService
            .onFileSelected(event.target.files[i], new Date().getDate())
            .subscribe((res: any) => {
              if (res.body && res.body.Location) {
                dataImages[i] = {
                  name: res.body.Key,
                  image_url: res.body.Location,
                  description: res.body.key,
                  resource_id: this.data.id ? this.data.id : null,
                };
              }
              this.isLoadingUpload = false;
            });
          this.data.listImages = dataImages;
        }
      } else {
        var mimeType = event.target.files[i].type;
        if (
          mimeType.match(/image\/*/) !== null ||
          mimeType.match(/video\/*/) !== null
        ) {
          await this.newsService
            .onFileSelected(event.target.files[i], new Date().getDate())
            .subscribe((res: any) => {
              if (res.body && res.body.Location) {
                dataImages.push({
                  name: res.body.Key,
                  image_url: res.body.Location,
                  description: res.body.key,
                  resource_id: this.data.id ? this.data.id : null,
                });
              }

              this.isLoadingUpload = false;
            });

          this.data.listImages = dataImages;
        }
      }
    }
  }

  isValidContent: boolean = false;
  editorChange(ev: any) {
    if (ev === '<p></p>') {
      this.isValidContent = true;
    } else {
      this.isValidContent = false;
    }
  }

  get isNotCanSave() {
    if (
      (this.form.invalid &&
        this.isSubmitting &&
        this.isValidPrice &&
        this.isValidContent) ||
      this.isSubmitting ||
      this.form.invalid ||
      this.isValidPrice ||
      this.isValidContent
    )
      return true;
    else return false;
  }

  submit() {
    this.isSubmitting = true;
    if (!this.isShowDateEnd) {
      this.form.patchValue({
        event_date_end: null,
        end_time: null,
      });
    }

    if (this.form.value.event_date_end < this.form.value.event_date_start) {
      const alertDialog = {
        header: this.translateService.instant('NOTIFICATION.HEADER'),
        message: this.translateService.instant('FORM.VALID.TIME.REQUIRED'),
        buttons: [
          {
            text: this.translateService.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.isSubmitting = false;
            },
          },
        ],
      };
      this.presentAlert(alertDialog);
    } else if (
      this.form.value.event_date_end === this.form.value.event_date_start &&
      this.form.value.end_time <= this.form.value.start_time
    ) {
      const alertDialog = {
        header: this.translateService.instant('NOTIFICATION.HEADER'),
        message: this.translateService.instant('FORM.VALID.TIME.REQUIRED'),
        buttons: [
          {
            text: this.translateService.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.isSubmitting = false;
            },
          },
        ],
      };
      this.presentAlert(alertDialog);
    } else {
      if (this.hashtag !== '') {
        if (!this.arrayTag.includes(this.hashtag)) {
          this.arrayTag.push(this.hashtag);
        }
      }
      let body: any = {
        ...this.form.value,
        event_date_end: this.isShowDateEnd
          ? this.form.value.event_date_end
          : null,
        end_time: this.isShowDateEnd ? this.form.value.end_time : null,
        minimum_price:
          // this.typePrice === -1
          //   ? -1
          //   :
          this.typePrice === 0 ? -1 : this.minimumPrice,
        images: this.data.listImages,
        chapter_id: '',
        organization_id: this.form.controls['organization_id'].value,
        user_id: '',
        type: '0',
        tags: this.arrayTag,
      };
      if (this.query?.chapter_id) {
        body = {
          ...body,
          chapter_id: this.query?.chapter_id,
        };
      } else {
        if (!body?.organization_id) {
          if (this.query?.user_id) {
            body = {
              ...body,
              user_id: this.query?.user_id,
            };
          }
        }
      }
      if (this.query?.organization_id) {
        body = {
          ...body,
          organization_id: this.query?.organization_id,
        };
      } else {
        if (!body?.organization_id) {
          if (this.query?.user_id) {
            body = {
              ...body,
              user_id: this.query?.user_id,
            };
          }
        }
      }
      let alertDialog = {
        header: this.translateService.instant('NOTIFICATION.HEADER'),
        message: '',
        buttons: [
          {
            text: this.translateService.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {},
          },
        ],
      };

      if (this.route.snapshot.params['id']) {
        body = {
          ...body,
          id: this.route.snapshot.params['id'],
        };
        this.newsService.updateNews(body).subscribe((res) => {
          if (res) {
            alertDialog = {
              ...alertDialog,
              message: this.translateService.instant(
                'NOTIFICATION.CONTENT.UPDATE_SUCCESS'
              ),
              buttons: [
                {
                  text: this.translateService.instant('BUTTON.OK'),
                  role: 'confirm',
                  handler: () => {
                    // const { organization_id, chapter_id, ...newQuery } =
                    //   this.query;
                    // this.query = { ...newQuery, user_id: '' };
                    // localStorage.setItem(
                    //   'searchQueryNews',
                    //   JSON.stringify(this.query)
                    // );

                    this.newsService
                      .getNew(this.route.snapshot.params['id'])
                      .subscribe((res: any) => {
                        const data = convertDataNewsDetail(res);
                        this.data = data;
                        this.newsDataService.setNewDetail({ ...this.data });
                      });

                    this.isSubmitting = false;
                    this.goBack();
                  },
                },
              ],
            };
          } else {
            alertDialog = {
              ...alertDialog,
              message: this.translateService.instant(
                'NOTIFICATION.CONTENT.UPDATE_FAILURE'
              ),
            };
          }
          this.presentAlert(alertDialog);
        });
      } else {
        this.newsService.createNews(body).subscribe((res) => {
          if (res) {
            alertDialog = {
              ...alertDialog,
              message: this.translateService.instant(
                'NOTIFICATION.CONTENT.CREATE_SUCCESS'
              ),
              buttons: [
                {
                  text: this.translateService.instant('BUTTON.OK'),
                  role: 'confirm',
                  handler: () => {
                    // const { organization_id, chapter_id, ...newQuery } =
                    //   this.query;
                    // this.query = { ...newQuery, user_id: '' };
                    // localStorage.setItem(
                    //   'searchQueryNews',
                    //   JSON.stringify(this.query)
                    // );

                    if (this.query?.chapter_id || this.query?.organization_id) {
                      this.query.type = '';
                    }

                    this.getNewsList();
                  },
                },
              ],
            };
          } else {
            alertDialog = {
              ...alertDialog,
              message: this.translateService.instant(
                'NOTIFICATION.CONTENT.CREATE_FAILURE'
              ),
            };
          }
          this.presentAlert(alertDialog);
        });
      }
    }
  }

  //get news list data
  getNewsList() {
    this.newsService.getNews(this.query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertDataNewsList(res.data);
        this.data = data;
        this.newsDataService.setMyNews([...this.data]);
        this.isSubmitting = false;
        // this.router.navigate(['/', 'tabs', 'home']);
        this.goBack();
      }
    });
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

  checkTypePrice(event: any) {
    this.typePrice = event.detail.value;

    if (event.detail.value === 1) {
      this.isGetPrice = true;
      this.isValidPrice = true;
    } else {
      this.isGetPrice = false;
      this.isValidPrice = false;
    }
  }
}
