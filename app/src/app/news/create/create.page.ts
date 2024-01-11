import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  THUMBNAIL_URL,
  convertDataNewsList,
  convertDataNewsDetail,
} from '../../constant';
import { IdIndexImageEmit, NewsResponse } from '../../interface/news.interface';
import { Location } from '@angular/common';
import { NewsService } from '../../services/news.service';
import { AlertDialog } from '../../interface';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationsService, UserService } from '../../services';
import { NewsDataService } from '../../shared/services';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-create-news',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreateNewsPage implements OnInit {
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

  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  data: any = {
    listImages: [],
  };
  form: FormGroup;
  isCreate: boolean = true;
  isEdit: boolean = false;
  hashtag: string = '';
  arrayTag: Array<string> = [];
  arrayMention: Array<string> = [];
  users: any[] = [];
  organizations: any[] = [];
  organization: any = {};
  mentions: any[] = [];
  isSubmitting: boolean = false;
  query: any;
  isLoadingUpload: boolean = false;
  isLoadingMentions = false;
  isLoading: boolean = false;
  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  selectedFeeling: string = '';
  isValidContent: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private newsService: NewsService,
    private userService: UserService,
    private alertController: AlertController,
    private translate: TranslateService,
    private router: Router,
    private newsDataService: NewsDataService,
    private organizationsService: OrganizationsService,
    private route: ActivatedRoute
  ) {
    this.editor = new Editor({
      keyboardShortcuts: true,
    });
    this.form = this.formBuilder.group({
      content: ['', [Validators.required]],
      type: [''],
      name: ['', [Validators.required]],
      feeling: [''],
      organization_id: [''],
    });
  }

  //
  ngOnInit() {
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

    this.form.controls['type'].patchValue(this.query?.type);

    if (this.route.snapshot.params['id']) {
      this.isLoading = true;
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
            if (data?.mentions) {
              const newMentions: string[] = [];
              data.mentions?.forEach((el: any) => {
                newMentions.push(el);
              });
              this.mentions = newMentions;
            }

            this.form.patchValue({
              content: data?.content,
              type: data?.type?.toString(),
              name: data?.name,
              feeling: data?.feeling,
              organization_id: data?.organization?.id,
            });
            this.query.type = data.type.toString();
          }
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
      this.isCreate = true;
      this.isEdit = false;
    }

    this.getUsers();
    this.getOrgs();
  }

  getUsers() {
    this.isLoadingMentions = true;
    this.userService.getUsers().subscribe((res: any) => {
      res.data.map((item: any) => {
        if (item.id !== this.user?.id) this.users.push(item);
      });

      this.count = +res.paging.count;
      this.isLoadingMentions = false;
    });
  }

  getOrgs() {
    this.organizationsService.getOrganizationsByMe().subscribe((res: any) => {
      this.organizations = res || [];
    });
  }

  //clear choose org
  clearOrg() {
    this.form.patchValue({
      organization_id: '',
    });
  }

  editorChange(ev: any) {
    if (ev === '<p></p>') {
      this.isValidContent = true;
    } else {
      this.isValidContent = false;
    }
  }

  get isNotCanSave() {
    if (
      (this.form.invalid && this.isSubmitting && this.isValidContent) ||
      this.isSubmitting ||
      this.form.invalid ||
      this.isValidContent
    )
      return true;
    else return false;
  }

  //submit form create
  submit() {
    this.isSubmitting = true;

    if (this.hashtag !== '') {
      if (!this.arrayTag.includes(this.hashtag)) {
        this.arrayTag.push(this.hashtag);
      }
    }

    let body: any = {
      name: this.form.controls['name'].value,
      content: this.form.controls['content'].value,
      tags: this.arrayTag,
      mentions: this.arrayMention,
      feeling: this.selectedFeeling,
      type: this.form.controls['type'].value,
      organization_id: this.form.controls['organization_id'].value,
      images: this.data.listImages,
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

    if (this.route.snapshot.params['id']) {
      body = {
        ...body,
        id: this.route.snapshot.params['id'],
      };
      this.newsService.updateNews(body).subscribe((res) => {
        if (res) {
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
                      if (res) {
                        const data = convertDataNewsDetail(res);
                        this.data = data;
                        this.newsDataService.setNewDetail({ ...this.data });
                      }
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
            message: this.translate.instant(
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
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.CREATE_SUCCESS'
            ),
            buttons: [
              {
                text: this.translate.instant('BUTTON.OK'),
                role: 'confirm',
                handler: () => {
                  this.form.reset();

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
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.CREATE_FAILURE'
            ),
          };
        }
        this.presentAlert(alertDialog);
      });
    }
  }

  handleChooseData(data: any) {
    this.selectedFeeling = data.name + '-' + data.char;
  }
  //get hashtag
  onGetHasTag(hashtag: string) {
    this.hashtag = hashtag;
  }

  //get array tag
  onGetArrayHashtag(array: Array<string>) {
    this.arrayTag = array;
  }

  //get array mention
  onGetArrayMention(array: Array<string>) {
    this.arrayMention = array;
  }
  //get query
  onGetQuery(query: any) {
    this.query = query;
    this.userService
      .getUsers({ offset: this.query.offset, limit: this.query.limit })
      .subscribe((res: any) => {
        res.data.map((item: any) => {
          if (item.id !== this.user.id) this.users.push(item);
        });
      });
  }

  //search users
  onSearchQuery(q: string) {
    let querySearch = `%${q}%`;
    this.userService.searchUsers(querySearch).subscribe((res: any) => {
      if (res && res.data) {
        this.users = res.data.filter((item: any) => item.id !== this.user.id);
      }
    });
  }

  //go back
  goBackCreate() {
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

    if (this.route.snapshot.params['id']) {
      alertDialog = {
        ...alertDialog,
        message: this.translate.instant('NOTIFICATION.CONTENT.UPDATE_CANCEL'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.OK'),
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
        message: this.translate.instant('NOTIFICATION.CONTENT.CREATE_CANCEL'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.goBack();
            },
          },
          {
            text: this.translate.instant('BUTTON.CANCEL'),
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
    console.log(event.target.files[0]);

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

  //convert new list data
  // convertNewsData(news: NewsListResponse) {
  //   news.data.forEach((item: any) => {
  //     item.updated_date = convertTimeToFromNow(item.updated_date);
  //     item.listImages =
  //       // item.media !== null && item.media !== '' ? item.media.split(',') : [];

  //     item.username = item.author.username;
  //     item.thumbnail = item.author.thumbnail ?? THUMBNAIL_URL;
  //   });
  // }
}
