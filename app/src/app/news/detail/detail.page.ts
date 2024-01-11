import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  AlertController,
  InfiniteScrollCustomEvent,
  ModalController,
} from '@ionic/angular';
import {
  THUMBNAIL_URL,
  convertComment,
  convertDataNewsDetail,
  convertDataNewsList,
  convertToLink,
  extractHTTPSURL,
} from '../../constant';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NewsService } from '../../services/news.service';
import { AlertDialog, IAttachment } from '../../interface';
import { TranslateService } from '@ngx-translate/core';
import { MetaDataService, NewsDataService } from 'src/app/shared/services';
import { AuthService } from 'src/app/services';
import * as _ from 'lodash';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  @ViewChild('commentElement') commentElement: ElementRef | undefined;

  showModal: boolean = false;
  isShowListUser: boolean = false;
  hostNameLocation: string = '';
  isLoading: boolean = true;
  isAvatar: boolean = true;
  type: string = 'detail';
  mentionsComment: any[] = [];
  imageComment: any;

  mentionOthers: any[] = [];

  itemComment: any = {
    comment: '',
  };
  isSendSuccess: boolean = false;
  data: any = {
    active_status: '',
    avatar: '',
    code: '',
    color: '',
    content: '',
    cover: '',
    created_by: '',
    created_date: '',
    creator: '',
    deleted_date: '',
    description: '',
    display_order: '',
    end_time: '',
    event_date: '',
    hagtags: '',
    id: '',
    images: '',
    inspector: '',
    interested: 0,
    location: '',
    media: '',
    minimum_price: '',
    name: '',
    number_of_comments: 0,
    number_of_likes: 0,
    number_of_shares: 0,
    post_date: '',
    start_time: '',
    status: '',
    type: 0,
    updated_date: '',
    user: '',
    username: '',
    thumbnail: '',
    tags: [],
    summary: {
      number_of_reactions: 0,
    },
    has_reacted: false,
  };
  query: any;
  isActionSheetOpen = false;
  news: any = [];

  public actionSheetGuests = [
    {
      text: this.translate.instant('BUTTON.REPORT'),
      role: 'report',
      data: {
        action: 'report',
      },
    },
    {
      text: this.translate.instant('BUTTON.FOLLOW'),
      role: 'follow',
      data: {
        action: 'follow',
      },
    },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  public actionSheetOwn = [
    // {
    //   text: this.translate.instant('BUTTON.REPORT'),
    //   role: 'report',
    //   data: {
    //     action: 'report',
    //   },
    // },
    // {
    //   text: this.translate.instant('BUTTON.FOLLOW'),
    //   role: 'follow',
    //   data: {
    //     action: 'follow',
    //   },
    // },
    {
      text: this.translate.instant('BUTTON.UPDATE'),
      role: 'edit',
      data: {
        action: 'edit',
      },
    },
    // {
    //   text: this.translate.instant('BUTTON.UPLOAD_IMAGE'),
    //   role: 'upload',
    //   data: {
    //     action: 'upload',
    //   },
    // },
    {
      text: this.translate.instant('BUTTON.DELETE'),
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  public actionSheetSuperAdmin = [
    {
      text: this.translate.instant('BUTTON.REPORT'),
      role: 'report',
      data: {
        action: 'report',
      },
    },

    {
      text: this.translate.instant('BUTTON.FOLLOW'),
      role: 'follow',
      data: {
        action: 'follow',
      },
    },
    {
      text: this.translate.instant('BUTTON.DELETE'),
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  id: string = _.split(this.router.snapshot.params['id'], '?')[0];
  queryComment: any = {
    q: '',
    limit: this.limit,
    offset: this.offset,
    include:
      'author,replies,replies_author,reply_images,mentions,images,reactions',
    resource_id: this.id,
    comment_id: this.getValueParameter(
      this.router.snapshot.params['id'],
      'comment_id'
    ),
  };
  me: any;

  constructor(
    private modalCtrl: ModalController,
    private route: Router,
    private location: Location,
    private newsService: NewsService,
    private router: ActivatedRoute,
    private alertController: AlertController,
    private translate: TranslateService,
    private newsDataService: NewsDataService,
    private authService: AuthService,
    private metadataService: MetaDataService
  ) {
    this.subscribeFetchNewDetail();
    this.subscribeFetchComment();
  }

  //init
  ngOnInit() {
    const queryStr = localStorage.getItem('searchQueryNews');
    if (queryStr) {
      this.query = JSON.parse(queryStr);
    }
    this.getMe();
    // this.getDetailNews();
    this.newsDataService.newsDetail$.subscribe((res: any) => {
      if (Object.keys(res).length === 0) {
        this.getDetailNews();
      } else {
        this.data = res;
        if (this.data?.mentions?.length > 2) {
          this.mentionOthers = this.data?.mentions?.filter(
            (mention: any) => mention.id !== this.data?.mentions[0].id
          );
        }

        this.isLoading = false;
      }
    });

    if (this.data.feeling) {
      this.data = {
        ...this.data,
        feeling:
          this.translate.instant(
            this.data.feeling.substring(0, this.data.feeling.indexOf('-'))
          ) +
          ' ' +
          this.data.feeling.substring(this.data.feeling.indexOf('-') + 1),
      };
    }

    this.hostNameLocation = window.location.host + '/tabs/news';

    this.getInitCommentData(this.queryComment);
  }

  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  getDetailNews() {
    this.isLoading = true;
    this.newsService
      .getNew(_.split(this.router.snapshot.params['id'], '?')[0])
      .subscribe((res: any) => {
        if (res && res.id) {
          const data = convertDataNewsDetail(res);
          this.data = data;
          if (this.data.feeling) {
            this.data = {
              ...this.data,
              feeling:
                this.translate.instant(
                  this.data.feeling.substring(0, this.data.feeling.indexOf('-'))
                ) +
                ' ' +
                this.data.feeling.substring(this.data.feeling.indexOf('-') + 1),
            };
          }
          if (this.data?.mentions?.length > 2) {
            this.mentionOthers = this.data?.mentions?.filter(
              (mention: any) => mention.id !== this.data?.mentions[0].id
            );
          }

          this.newsDataService.setNewDetail({ ...this.data });
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.route.navigate(['/not-found']);
        }
      });
  }

  //cancel modal
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  setOpenActionSheet(value: boolean) {
    this.isActionSheetOpen = value;
  }

  redirect(ev: any) {}

  //show modal mentions
  setOpen(value: boolean) {
    this.isShowListUser = value;
  }

  //action detail news

  isShowReport: boolean = false;
  idDataWithReport: string = '';

  setResult(ev: any) {
    if (ev?.detail?.data) {
      if (ev.detail.data.action === 'report') {
        this.idDataWithReport = this.data.id;
        this.isShowReport = true;
      } else if (ev.detail.data.action === 'follow') {
        const body = {
          resource_id: this.data.id,
          resource_type: 'news',
        };
        this.newsService.postFollowing(body).subscribe((res) => {
          let alertDialog = {
            header: this.translate.instant('NOTIFICATION.HEADER'),
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.FOLLOW_FAILURE'
            ),
            buttons: [
              {
                text: this.translate.instant('BUTTON.OK'),
                role: 'confirm',
                handler: () => {},
              },
            ],
          };
          if (res) {
            alertDialog.message = this.translate.instant(
              'NOTIFICATION.CONTENT.FOLLOW_SUCCESS'
            );
          }

          this.presentAlert(alertDialog);
        });
      } else if (ev?.detail?.data?.action === 'edit') {
        this.route.navigate([
          `/tabs/news/update/${
            _.split(this.router.snapshot.params['id'], '?')[0]
          }`,
        ]);
      } else if (ev.detail.data.action === 'upload') {
        this.isModalUpload = true;
      } else if (ev?.detail?.data?.action === 'delete') {
        let alertDialog = {
          header: this.translate.instant('NOTIFICATION.HEADER'),
          message: this.translate.instant('NOTIFICATION.QUESTION.DELETE'),
          buttons: [
            {
              text: this.translate.instant('BUTTON.OK'),
              role: 'confirm',
              handler: () => {
                this.newsService
                  .deleteNews(
                    _.split(this.router.snapshot.params['id'], '?')[0]
                  )
                  .subscribe(() => {
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
                            this.getNewsList();
                          },
                        },
                      ],
                    };
                    this.presentAlert(alertDialog);
                  });
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
    }

    this.setOpenActionSheet(false);
  }

  //list job detail changes
  subscribeFetchNewDetail() {
    this.newsDataService.newsDetail$.subscribe((res) => {
      this.data = res;
    });
  }

  subscribeFetchComment() {
    this.newsDataService.myNewsComments$.subscribe((res: any) => {
      this.comments = res;
      if (this.comments.length !== 0) {
        this.comments.forEach((comment: any) => {
          let url = extractHTTPSURL(comment.name);
          if (url) {
            this.fetchMetadata(url, comment);
          }
        });
      }
    });
  }

  //get news list data
  getNewsList() {
    this.newsService.getNews(this.query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertDataNewsList(res.data);
        this.news = data;
        this.newsDataService.setMyNews([...this.news]);
        let url = 'tabs/news';

        if (this.query.user_id) {
          url = `tabs/news/user/${this.query.user_id}`;
        } else if (this.query.organization_id) {
          url = `tabs/news/org/${this.query.organization_id}`;
        } else if (this.query.chapter_id) {
          url = `tabs/news/chapter/${this.query.chapter_id}`;
        } else {
          url = `tabs/news`;
        }

        this.route.navigate([url]);
      }
    });
  }

  images: {
    index: number;
    data: {
      id: number;
      image_url: string;
    }[];
  } = {
    index: 0,
    data: [],
  };

  //zoom image
  onZoom(value: { index: number; data: any }) {
    this.images = {
      index: value.index,
      data: value.data,
    };
    this.showModal = true;
  }

  //close popup preview image
  closeModal(value: boolean) {
    this.showModal = value;
    // this.imagesString = '';
  }

  comments: any = [];
  isLoadingComment: boolean = true;

  //get comments
  getInitCommentData(query?: {
    offset: number;
    limit: number;
    resource_id: string;
    q?: string;
    comment_id?: string;
  }) {
    this.isLoadingComment = true;
    this.newsService.getComments(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertComment(res.data);
        this.comments = data;
        this.newsDataService.setMyNewsComments(this.comments);
        this.comments = this.checkRevertComment(
          this.comments,
          this.queryComment.comment_id
        );

        if (this.comments.length !== 0) {
          this.comments.forEach((comment: any) => {
            let url = extractHTTPSURL(comment.name);
            if (url) {
              this.fetchMetadata(url, comment);
            }
          });
        }

        this.limit = +res.paging.limit;
        this.offset = +res.paging.limit;
        this.count = +res.paging.count;
        this.isLoadingComment = false;
      }
    });
  }

  getLoadComments(query?: any) {
    this.isLoadingComment = true;
    this.newsService.getComments(query).subscribe((res: any) => {
      if (res && res.data) {
        this.offset = this.comments.length;
        this.count = +res.paging.count;

        const data = convertComment(
          res.data.filter(
            (comment: any) => comment.id !== this.queryComment.comment_id
          )
        );
        this.offset += data.length;
        this.comments = this.comments.concat(data);
        if (this.comments.length !== 0) {
          this.comments.forEach((comment: any) => {
            let url = extractHTTPSURL(comment.name);
            if (url) {
              this.fetchMetadata(url, comment);
            }
          });
        }
      }
    });
  }

  //load data after scroll
  loadData(ev: any) {
    if (this.offset < this.count) {
      this.queryComment = {
        ...this.queryComment,
        offset: this.offset,
        limit: this.limit,
      };
      this.getLoadComments(this.queryComment);
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }
  }

  //scroll data
  onIonInfinite(ev: any) {
    this.loadData(ev);
  }

  repliesData: any;
  commentEdit: any;
  //onRepliesComment
  onRepliesComment(data: any) {
    this.repliesData = data;
  }

  //onRemoveReply
  onRemoveReply(value: boolean) {
    if (value) {
      this.repliesData = undefined;
    }
  }

  //edit comment
  onEditComment(data: any) {
    let parentName = data.parentName.replace(/<a[^>]*>(.*?)<\/a>/g, '$1');
    this.commentEdit = {
      ...data,
      parentName: parentName,
    };
  }

  listImagesComment: any = [];

  // send comment
  sendComments(event: { newMessage: string; images: any; mentions: any }) {
    let body: any = {
      name: event.newMessage,
      resource_type: 'news',
      mentions: event.mentions,
      images: event.images,
    };
    console.log(event.newMessage);

    if (this.repliesData) {
      body = {
        ...body,
        parent_id: this.repliesData.id,
      };
    } else {
      body = {
        ...body,
        resource_id: _.split(this.router.snapshot.params['id'], '?')[0],
      };
    }
    if (this.commentEdit && body.name !== '') {
      if (this.commentEdit?.childrenId) {
        body = {
          ...body,
          id: this.commentEdit.childrenId,
        };
      } else {
        body = {
          ...body,
          id: this.commentEdit.parentId,
        };
      }

      this.newsService.putComment(body).subscribe((res: any) => {
        if (res) {
          // this.newsService
          //   .getNew(this.router.snapshot.params['id'])
          //   .subscribe((res: any) => {
          //     if (res) {
          //       const data = convertDataNewsDetail(res);
          //       this.newsListImage = [...data.listImages];
          //       this.data = data;
          //     }
          //   });
          if (this.commentEdit?.parentId && this.commentEdit?.childrenId) {
            this.comments.forEach((item: any) => {
              if (item.id === this.commentEdit.parentId) {
                item.replies.forEach((element: any) => {
                  if (element.id === this.commentEdit.childrenId) {
                    element.name = body.name;
                  }
                });
              }
            });
            this.newsDataService.setMyNewsComments(this.comments);
          } else {
            this.comments.forEach((item: any) => {
              if (item.id === body.id) {
                item.name = body.name;
              }
            });
          }
          this.newsDataService.setMyNewsComments(this.comments);
          this.commentEdit = undefined;
        }
      });
    } else {
      this.newsService.postComment(body).subscribe((res: any) => {
        if (res) {
          // this.newsService
          //   .getNew(this.router.snapshot.params['id'])
          //   .subscribe((res: any) => {
          //     if (res) {
          //       const data = convertDataNewsDetail(res);
          //       this.newsListImage = [...data.listImages];
          //       this.data = data;
          //       this.newsDataService.setNewDetail(data);
          //     }
          //   });
          console.log(res);

          if (res.parent_id) {
            const replyData = convertComment([res]);
            this.comments.forEach((item: any) => {
              if (item.id === res.parent_id) {
                item.replies = [...item.replies, ...replyData];
              }
            });
            this.newsDataService.setMyNewsComments(this.comments);
          } else {
            const result = { ...res, replies: [] };
            const commentData = convertComment([result]);
            this.comments = [...commentData, ...this.comments];

            if (this.commentElement) {
              const element = this.commentElement.nativeElement as HTMLElement;
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            this.newsDataService.setMyNewsComments(this.comments);
          }
          this.repliesData = undefined;
        }
      });
    }
  }

  //delete comment
  onDeleteComment(id: any) {
    this.isLoadingComment = true;
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.DELETE_COMMENT'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.newsService.deleteComment(id).subscribe(() => {
              this.newsService
                .getNew(_.split(this.router.snapshot.params['id'], '?')[0])
                .subscribe((res: any) => {
                  if (res) {
                    const data = convertDataNewsDetail(res);
                    this.newsListImage = [...data.listImages];
                    this.data = data;
                    this.newsDataService.setNewDetail(data);
                  }
                });

              let isReply = false;
              this.comments.forEach((item: any) => {
                item.replies.forEach((element: any) => {
                  if (element.id === id) {
                    isReply = true;
                  }
                });
              });
              if (isReply) {
                this.comments.forEach((item: any) => {
                  item.replies = item.replies.filter(
                    (element: any) => element.id !== id
                  );
                });
              } else {
                this.comments = this.comments.filter(
                  (item: any) => item.id !== id
                );
              }

              this.newsDataService.setMyNewsComments(this.comments);
              this.isLoadingComment = false;
            });
          },
        },
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {
            this.isLoadingComment = false;
          },
        },
      ],
    };

    this.presentAlert(alertDialog);
  }

  //go back url
  goBack() {
    this.location.back();
    // this.route.navigate(['/tabs/news']);
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

  //thả tim
  onHeart(id: string) {
    const body = {
      resource_id: id,
      react_emoji: 'heart',
      resource_type: 'news',
    };
    this.newsService.postReaction(body).subscribe((res) => {
      if (res) {
        if (this.data.id === id) {
          if (!this.data.has_reacted) {
            this.data.summary.number_of_reactions += 1;
          } else {
            this.data.summary.number_of_reactions -= 1;
          }
          this.data.has_reacted = !this.data.has_reacted;
          this.newsDataService.setNewDetail(this.data);
        }
      }
    });
  }

  newsListImage: any[] = [];
  isLoadingUpload: boolean = false;
  isModalUpload: boolean = false;
  isUploadSuccess: boolean = false;

  //remove image in array
  handleRemoveImage(id: string) {
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
    this.newsService.deleteImages(id).subscribe((res) => {
      if (res) {
        alertDialog = {
          header: this.translate.instant('NOTIFICATION.HEADER'),
          message: this.translate.instant(
            'NOTIFICATION.CONTENT.DELETE_SUCCESS'
          ),
          buttons: [
            {
              text: this.translate.instant('BUTTON.OK'),
              role: 'confirm',
              handler: () => {
                this.newsService
                  .getNew(_.split(this.router.snapshot.params['id'], '?')[0])
                  .subscribe((res: any) => {
                    const data = convertDataNewsDetail(res);
                    this.data = data;
                    this.newsDataService.setNewDetail({ ...this.data });
                  });
                this.isUploadSuccess = false;
                this.isLoading = false;
              },
            },
          ],
        };
      } else {
        alertDialog = {
          ...alertDialog,
          message: this.translate.instant(
            'NOTIFICATION.CONTENT.DELETE_FAILURE'
          ),
        };
      }
      this.presentAlert(alertDialog);
    });
  }

  //add image for array
  async handleAddImage(event: any) {
    this.isLoadingUpload = true;
    let dataImages: {
      name: string;
      image_url: string;
      description: string;
      resource_id: string;
      resource_type: string;
    } = {
      name: '',
      image_url: THUMBNAIL_URL,
      description: '',
      resource_id: this.data.id,
      resource_type: 'news',
    };
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) !== null) {
      await this.newsService
        .onFileSelected(event.target.files[0], new Date().getDate())
        .subscribe((res: any) => {
          if (res.body && res.body.Location) {
            dataImages = {
              ...dataImages,
              name: res.body.Key,
              image_url: res.body.Location,
              description: res.body.key,
            };

            this.uploadImage(dataImages);
          }
          this.isLoadingUpload = false;
        });

      // this.data.listImages = dataImages;
    }
  }

  uploadImage(data: {
    name: string;
    image_url: string;
    description: string;
    resource_id: string;
    resource_type: string;
  }) {
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

    this.newsService.postImages(data).subscribe((res) => {
      if (res) {
        alertDialog = {
          header: this.translate.instant('NOTIFICATION.HEADER'),
          message: this.translate.instant(
            'NOTIFICATION.CONTENT.UPDATE_SUCCESS'
          ),
          buttons: [
            {
              text: this.translate.instant('BUTTON.OK'),
              role: 'confirm',
              handler: () => {
                this.newsService
                  .getNew(_.split(this.router.snapshot.params['id'], '?')[0])
                  .subscribe((res: any) => {
                    const data = convertDataNewsDetail(res);
                    this.data = data;
                    this.newsDataService.setNewDetail({ ...this.data });
                    this.isUploadSuccess = true;
                  });
                this.isLoading = false;
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
  }

  handleCloseUpload(value: boolean) {
    this.isModalUpload = value;
    this.isActionSheetOpen = false;
  }

  //search tag
  onSearchTag(value: any) {
    const params = {
      q: value.name,
    };
    localStorage.setItem('hashtag', JSON.stringify(params));
    this.route.navigate(['/tabs/news/hashtag']);
  }

  //copy-link
  onCopy(value: any) {}

  //report
  onGetValueReport(form: any) {
    const body = {
      parent_id: this.idDataWithReport,
      description: form.description,
    };

    this.newsService.postReport(body).subscribe((res) => {
      let alertDialog = {
        header: this.translate.instant('NOTIFICATION.HEADER'),
        message: this.translate.instant('NOTIFICATION.CONTENT.REPORT_FAILURE'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.isShowReport = false;
            },
          },
        ],
      };
      if (res) {
        this.idDataWithReport = '';
        alertDialog.message = this.translate.instant(
          'NOTIFICATION.CONTENT.REPORT_SUCCESS'
        );
      }

      this.presentAlert(alertDialog);
    });
  }

  //close modal report
  onCloseReport(value: boolean) {
    this.isShowReport = value;
  }

  getValueParameter(url: string, parameter: string) {
    var foundString = url.match(
      new RegExp('[?&]' + parameter + '=([^&]*)(&?)', 'i')
    );
    return foundString ? foundString[1] : foundString;
  }

  checkRevertComment(comments: any[], comment_id: string) {
    let check: boolean = false;
    let result: any[] = [];
    comments.map((comment) => {
      if (comment.id === comment_id) {
        check = true;
      }
    });

    if (this.offset === 0 && check) {
      const comment = comments[0];
      result = _.filter(comments, (comment) => comment.id != comment_id);
      result.unshift(comment);
    } else {
      result = comments;
    }

    return result;
  }

  metadata: any;
  //fetch meta data
  async fetchMetadata(url: string, comment: any): Promise<void> {
    try {
      this.metadata = await this.metadataService.getMetadata(url);

      comment.metadata = {
        name: this.metadata['og:site_name'],
        image_url: this.metadata['og:image'],
        description: this.metadata.description,
        url: url,
      };
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  }
}
