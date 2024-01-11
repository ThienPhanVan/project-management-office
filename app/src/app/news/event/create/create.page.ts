import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import {
  COVER_URL,
  THUMBNAIL_URL,
  convertDataNewsDetail,
  convertDataNewsList,
  convertDateTimeYYYYMMDD,
} from '../../../constant';
import {
  AuthService,
  OrganizationsService,
  UserService,
} from '../../../services';
import {
  IdIndexImageEmit,
  NewsResponse,
} from '../../../interface/news.interface';
import { Editor, Toolbar } from 'ngx-editor';
import { NewsService } from '../../../services/news.service';
import { NewsDataService } from '../../../shared/services';
import { AlertDialog } from '../../../interface';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreateEventsPage implements OnInit {
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
  data: any = {
    listImages: [],
  };
  form: FormGroup;
  isCreate: boolean = false;
  isEdit: boolean = false;
  isAvatar: boolean = true;
  isUploadImageBg: boolean = true;
  isBackground: boolean = true;
  user: any = {};
  isLoadingUpload: boolean = false;
  isShowDateEnd: boolean = false;
  showModal: boolean = false;
  imagesString: string = '';
  labelEventType: string = 'online';
  isSubmitting: boolean = false;
  query: any;
  hashtag: string = '';
  arrayTag: string[] = [];
  isLoading: boolean = false;
  // labelFeeEventType: string = 'Miễn phí';
  // isFree: boolean = true;
  eventParent: any;
  isCheckedType: boolean = false;
  typePrice: number = 0;
  isGetPrice: boolean = false;
  organizations: any[] = [];
  organization: any;
  isValidPrice: boolean = true;
  minimumPrice: any;
  isNotImageCover: boolean = false;
  dayNow: any = moment().format('YYYY-MM-DD');
  linkOnline: string = '';
  isLinkOnline: boolean = true;
  isValidLinkOnline: boolean = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private translateService: TranslateService,
    private newsService: NewsService,
    private newsDataService: NewsDataService,
    private organizationsService: OrganizationsService,
    private alertController: AlertController,
    private userService: UserService
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
      event_type: ['online', [Validators.required]],
      // fee_type: [0, [Validators.required]],
      cover: [],
      location: [''],
      organization_id: [''],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
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

    const eventParrentStr = localStorage.getItem('event-parent');
    if (eventParrentStr) {
      this.eventParent = JSON.parse(eventParrentStr);
    }

    this.authService.me().subscribe((res: any) => {
      this.user = {
        ...res,
        thumbnail: res.thumbnail ?? THUMBNAIL_URL,
      };
    });

    const paramsId = this.route.snapshot.params['id'];
    if (paramsId) {
      this.isCreate = false;
      this.isEdit = true;
      this.titlePage = this.translateService.instant('PAGES.EVENTS.UPDATE');

      this.newsService
        .getNew(this.route.snapshot.params['id'])
        .subscribe((res: any) => {
          if (res) {
            const data = convertDataNewsDetail(res);
            this.data = data;

            this.isShowDateEnd = this.data.event_date_end ? true : false;
            this.form.patchValue({
              name: data.name,
              content: data.content,
              event_date_start: moment(data.start_date_event).format(
                'YYYY-MM-DD'
              ),
              event_date_end: data.end_date_event
                ? moment(data.end_date_event).format('YYYY-MM-DD')
                : moment(data.start_date_event).format('YYYY-MM-DD'),
              start_time: data.start_time,
              end_time: data.end_time ? data.end_time : '07:00',
              event_type: data.event_type,
              fee_type: data.fee_type,
              // cover: data.cover,
              location: data.location,
              organization_id: data?.organization?.id,
            });
            if (data?.tags) {
              const tags: string[] = [];
              data.tags?.forEach((el: any) => {
                tags.push(el.name);
              });
              this.arrayTag = tags;
            }
            if (data.event_type === 'online') {
              this.labelEventType = 'online';
              this.isLinkOnline = true;
              this.isValidLinkOnline = true;
              this.isCheckedType = true;
            } else {
              this.labelEventType = 'offline';
              this.isLinkOnline = false;
              this.isValidLinkOnline = true;
              this.isCheckedType = false;
            }

            if (data?.fee_type > 0) {
              this.typePrice = 1;
              this.isGetPrice = true;
            } else {
              this.typePrice = data.fee_type;
              this.isGetPrice = false;
            }

            this.query.type = data.type.toString();
          }
          this.isLoading = false;
          this.isNotImageCover = false;
        });
    } else {
      this.isCreate = true;
      this.isEdit = false;
      this.titlePage = this.translateService.instant('PAGES.EVENTS.CREATE');

      if (this.eventParent) {
        this.isShowDateEnd = this.eventParent.event_date_end ? true : false;
        this.form.patchValue({
          // name: data.name,
          // content: data.content,
          event_date_start: this.eventParent.start_date_event,
          event_date_end: this.eventParent.end_date_event,
          start_time: this.eventParent.start_time,
          end_time: this.eventParent.end_time
            ? this.eventParent.end_time
            : '00:00',
          event_type: this.eventParent.event_type,
        });

        if (this.eventParent.event_type === 'online') {
          this.labelEventType = 'online';
          this.isLinkOnline = true;
          this.isValidLinkOnline = true;
          this.isCheckedType = true;
        } else {
          this.labelEventType = 'offline';
          this.isLinkOnline = false;
          this.isValidLinkOnline = false;
          this.isCheckedType = false;
        }
      } else {
        this.labelEventType = 'online';
        this.isLinkOnline = true;
        this.isValidLinkOnline = true;
        this.isCheckedType = true;
      }
      this.isLoading = false;
      this.typePrice = 0;
      this.isGetPrice = false;
    }

    const userStr = localStorage.getItem('user');
    let user;
    if (userStr) {
      user = JSON.parse(userStr);
    }
    this.getOrgs(user);

    if (this.typePrice === 1) {
      this.isValidPrice = true;
    } else {
      this.isValidPrice = false;
    }
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

  //on time event end
  onTimeEventDateEnd(ev: any) {
    let event_date_end = moment(ev.target.value).format('YYYY-MM-DD');
    this.form.patchValue({
      event_date_end: event_date_end,
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

  //remove image in array
  handleRemoveImage(object: IdIndexImageEmit) {
    console.log(object);
    console.log(this.data.listImages);
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
    console.log(this.data.listImages);
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

  async setCoverImage(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }

    var mimeType = event.target.files[0].type;
    if (
      mimeType.match(/image\/*/) !== null ||
      mimeType.match(/video\/*/) !== null
    ) {
      this.isNotImageCover = false;
      await this.userService
        .onFileSelected(event.target.files[0], new Date().getDate())
        .subscribe((res: any) => {
          if (res.body && res.body.Location) {
            this.form.controls['cover'].patchValue(res.body.Location);
          }
        });
    }
  }

  getSrcImage(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
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
          {
            text: this.translateService.instant('BUTTON.CANCEL'),
            role: 'cancel',
            handler: () => {},
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
    localStorage.removeItem('event-parent');
    this.location.back();
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

  changeType(event: any) {
    if (event.detail.checked) {
      this.labelEventType = 'online';
      this.isLinkOnline = true;
      this.isValidLinkOnline = true;
    } else {
      this.labelEventType = 'offline';
      this.isLinkOnline = false;
      this.isValidLinkOnline = false;
    }
    this.form.patchValue({
      event_type: this.labelEventType,
    });
  }

  isValidContent: boolean = false;
  editorChange(ev: any) {
    if (ev === '<p></p>') {
      this.isValidContent = true;
    } else {
      this.isValidContent = false;
    }
  }

  //get link online
  getLinkOnline(ev: any) {
    const regexLink: RegExp =
      /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    if (regexLink.test(ev.target.value)) {
      this.linkOnline = ev.target.value;
      this.isValidLinkOnline = false;
    } else {
      this.isValidLinkOnline = true;
    }
  }

  get isNotCanSave() {
    if (
      (this.form.invalid &&
        this.isSubmitting &&
        this.isNotImageCover &&
        this.isValidPrice &&
        this.isValidContent) ||
      this.isSubmitting ||
      this.form.invalid ||
      this.isNotImageCover ||
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
    // this.isNotCanSave = false;
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
      if (this.form.value.cover === COVER_URL) {
        const alertDialog = {
          header: this.translateService.instant('NOTIFICATION.HEADER'),
          message: this.translateService.instant('FORM.VALID.COVER.REQUIRED'),
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
        this.isNotImageCover = true;
      } else {
        if (this.hashtag !== '') {
          if (!this.arrayTag.includes(this.hashtag)) {
            this.arrayTag.push(this.hashtag);
          }
        }

        let body = {
          ...this.form.value,
          event_date_end: this.isShowDateEnd
            ? this.form.value.event_date_end
            : null,
          end_time: this.isShowDateEnd ? this.form.value.end_time : null,
          // media: this.data.listImages.toString(),
          images: this.data.listImages,
          event_type: this.form.value.event_type,
          type: '1',
          chapter_id: '',
          organization_id: this.form.value.organization_id,
          user_id: '',
          tags: this.arrayTag,
          fee_type:
            this.typePrice === -1
              ? -1
              : this.typePrice === 0
              ? 0
              : this.minimumPrice,
        };
        if (!this.isValidLinkOnline) {
          body = {
            ...body,
            link: this.linkOnline,
          };
        }
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
          if (this.eventParent) {
            body = {
              ...body,
              parent_id: this.eventParent.id,
            };
          }

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

                      if (this.eventParent) {
                        this.newsService
                          .getNew(this.eventParent.id)
                          .subscribe((res: any) => {
                            const data = convertDataNewsDetail(res);
                            this.data = data;
                            this.newsDataService.setNewDetail({ ...this.data });
                          });
                        localStorage.removeItem('event-parent');
                      }

                      if (
                        this.query?.chapter_id ||
                        this.query?.organization_id
                      ) {
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
  }

  //get news list data
  getNewsList() {
    this.newsService.getNews(this.query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertDataNewsList(res.data);
        this.data = data;
        this.newsDataService.setMyNews(this.data);

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
