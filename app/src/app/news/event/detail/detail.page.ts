import { Location } from '@angular/common';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import {
  THUMBNAIL_URL,
  convertComment,
  convertDataNewsDetail,
  convertDataNewsList,
  extractHTTPSURL,
} from '../../../constant';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialog, IAttachment } from '../../../interface';
import { NewsService } from '../../../services/news.service';
import { MetaDataService, NewsDataService } from 'src/app/shared/services';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailEventPage implements OnInit {
  @ViewChild('commentElement') commentElement: ElementRef | undefined;

  @Output() heart = new EventEmitter();

  hostNameLocation: string = '';
  showModal: boolean = false;
  isAvatar: boolean = true;
  isBackground: boolean = true;
  segmentStatus: number = 1;
  isShowMore: boolean = false;
  data: any;
  isLoading: boolean = true;
  mentionsComment: any[] = [];

  query: any;
  limit = 10;
  offset = 0;
  count = 0;
  isActionSheetOpen = false;
  news: any = [];
  users = [];
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
    // {
    //   text: this.translate.instant('BUTTON.ADD_EVENT_CHILD'),
    //   role: 'create',
    //   data: {
    //     action: 'create',
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

  comments: any[] = [];
  limitCmt = 10;
  offsetCmt = 0;
  countCmt = 0;
  queryComment: any = {
    q: '',
    limit: this.limitCmt,
    offset: this.offsetCmt,
    include:
      'author,replies,replies_author,reply_images,mentions,images,reactions',
    resource_id: this.router.snapshot.params['id'],
  };

  isLoadingComment: boolean = true;
  itemComment: any = {
    comment: '',
  };
  isSendSuccess: boolean = false;

  participates: any[] = [];
  isLoadingParticipates: boolean = false;
  queryParticipates: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    news_id?: string;
    user_id?: string;
  } = {
    limit: 10,
    offset: 0,
    include: 'user,news',
  };
  countParticipates: number = 0;

  eventChildId: string = '';

  newsListImage: any[] = [];
  isLoadingUpload: boolean = false;
  isModalUpload: boolean = false;
  isUploadSuccess: boolean = false;
  me: any;

  constructor(
    private location: Location,
    private route: Router,
    private router: ActivatedRoute,
    private translate: TranslateService,
    private alertController: AlertController,
    private newsService: NewsService,
    private newsDataService: NewsDataService,
    private authService: AuthService,
    private metadataService: MetaDataService
  ) {
    this.subscribeFetchNewDetail();
    this.subscribeFetchComment();
  }

  ngOnInit(): void {
    const isCommentRedirect = localStorage.getItem('isComment');
    if (isCommentRedirect) {
      this.segmentStatus = 2;

      localStorage.removeItem('isComment');
    }

    const queryStr = localStorage.getItem('searchQueryNews');
    if (queryStr) {
      this.query = JSON.parse(queryStr);
    }
    const childrenIdStr = localStorage.getItem('children-active');
    if (childrenIdStr) {
      this.eventChildId = childrenIdStr;
      this.queryComment = {
        ...this.queryComment,
        resource_id: childrenIdStr,
      };
      // this.segmentStatus = 3;
    }
    this.isLoading = true;

    this.newsDataService.newsDetail$.subscribe((res: any) => {
      if (Object.keys(res).length === 0) {
        this.newsService
          .getNew(this.router.snapshot.params['id'])
          .subscribe((res: any) => {
            if (res && res.id) {
              const data = convertDataNewsDetail(res);
              this.newsListImage = [...data.listImages];
              this.data = data;
              this.newsDataService.setNewDetail({ ...this.data });
              this.isLoading = false;
            } else {
              this.isLoading = false;
              this.route.navigate(['/not-found']);
            }
          });
      } else {
        this.newsListImage = [...res.listImages];
        this.data = res;

        this.isLoading = false;
      }
    });
    this.queryParticipates = {
      ...this.queryParticipates,
      news_id: this.router.snapshot.params['id'],
    };
    this.getMe();
    this.getParticipatesData();
    this.getInitCommentData(this.queryComment);
    this.hostNameLocation = window.location.host + '/tabs/events';
  }

  //
  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  //
  handleClickEventChild(id: string) {
    this.isLoading = true;
    this.newsService.getNew(id).subscribe((res: any) => {
      if (res) {
        const data = convertDataNewsDetail(res);
        this.data = data;

        this.newsDataService.setNewEventDetail({ ...this.data });
        // this.segmentStatus = 3;
        this.isLoading = false;
      }
    });
  }

  //list comments
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

  //list job detail changes
  subscribeFetchNewDetail() {
    this.newsDataService.newsDetail$.subscribe((res) => {
      this.data = res;
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

  goBack() {
    if (this.eventChildId) {
      localStorage.removeItem('children-active');
      this.route.navigate([`/tabs/events/${this.data.parent_id}`]);
    } else this.location.back();
  }

  changeSegment(event: any) {
    this.segmentStatus = Number(event.detail.value);
  }

  onShowMore(value: boolean) {
    return (this.isShowMore = value);
  }

  redirect(ev: any) {
    this.segmentStatus = 2;
  }

  //get comments
  getInitCommentData(query?: {
    offset: number;
    limit: number;
    resource_id: string;
    q?: string;
  }) {
    this.isLoadingComment = true;
    this.newsService.getComments(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertComment(res.data);
        this.comments = data;
        this.newsDataService.setMyNewsComments(this.comments);
        if (this.comments.length !== 0) {
          this.comments.forEach((comment: any) => {
            let url = extractHTTPSURL(comment.name);
            if (url) {
              this.fetchMetadata(url, comment);
            }
          });
        }
        this.limitCmt = +res.paging.limit;
        this.offsetCmt = +res.paging.limit;
        this.countCmt = +res.paging.count;
        this.isLoadingComment = false;
      }
    });
  }

  getLoadComments(query?: any) {
    this.isLoadingComment = true;
    this.newsService.getComments(query).subscribe((res: any) => {
      if (res && res.data) {
        this.offsetCmt = this.comments.length;
        this.countCmt = +res.paging.count;
        const data = convertComment(res.data);
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
  loadDataComments() {
    if (this.offsetCmt < this.countCmt) {
      this.queryComment = {
        ...this.queryComment,
        offset: this.offset,
        limit: this.limit,
      };
      this.getLoadComments(this.queryComment);
    }
  }

  //scroll data
  onIonInfiniteComments(ev: any) {
    this.loadDataComments();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
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

  //
  onEditComment(data: any) {
    let parentName = data.parentName.replace(/<a[^>]*>(.*?)<\/a>/g, '$1');
    this.commentEdit = {
      ...data,
      parentName: parentName,
    };
  }

  onMentions(data: any) {
    this.mentionsComment = data;
  }

  sendComments(event: { newMessage: string; images: any; mentions: any }) {
    let body: any = {
      name: event.newMessage,
      resource_type: 'news',
      images: event.images,
      mentions: event.mentions,
    };
    if (this.repliesData) {
      body = {
        ...body,
        parent_id: this.repliesData.id,
      };
    } else {
      body = {
        ...body,
        resource_id: this.router.snapshot.params['id'],
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

      this.newsService.putComment(body).subscribe((res) => {
        if (res) {
          this.newsService
            .getNew(this.router.snapshot.params['id'])
            .subscribe((res: any) => {
              if (res) {
                const data = convertDataNewsDetail(res);
                this.newsListImage = [...data.listImages];
                this.data = data;
              }
            });
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
          this.newsService
            .getNew(this.router.snapshot.params['id'])
            .subscribe((res: any) => {
              if (res) {
                const data = convertDataNewsDetail(res);
                this.newsListImage = [...data.listImages];
                this.data = data;
                this.newsDataService.setNewDetail(data);
              }
            });
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
                .getNew(this.router.snapshot.params['id'])
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

  setOpenActionSheet(value: boolean) {
    this.isActionSheetOpen = value;
  }

  isShowReport: boolean = false;
  idDataWithReport: string = '';

  setResult(ev: any) {
    if (ev.detail.data) {
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
      } else if (ev.detail.data.action === 'create') {
        this.route.navigate([`tabs/events/create-children`]);
        localStorage.setItem('event-parent', JSON.stringify(this.data));
      } else if (ev.detail.data.action === 'upload') {
        this.isModalUpload = true;
      } else if (ev.detail.data.action === 'edit') {
        this.route.navigate([
          `tabs/events/update/${this.router.snapshot.params['id']}`,
        ]);
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
                  .deleteNews(this.router.snapshot.params['id'])
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
      } else {
        this.setOpenActionSheet(false);
      }
    }
    this.isActionSheetOpen = false;
  }

  getUsersData(query?: string) {
    // this.userService.getUsers(query).subscribe((res: ListUsers) => {
    //   if (res && res.data) {
    //     this.users = this.users.concat(res.data);
    //     this.offset = this.users.length;
    //     this.count = +res.paging.count;
    //     this.isLoading = false
    //   }
    // });
  }

  loadUsers(phone_query?: string) {
    let query: any = { offset: this.offset, limit: this.limit };
    if (this.offset < this.count) {
      if (phone_query) {
        query = { ...query, phone: phone_query };
      }
      this.getUsersData(query);
    }
  }

  onIonInfinite(ev: any) {
    this.loadUsers();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
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
        this.news = data;
        this.newsDataService.setMyNews(this.news);
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

  onWillParticipate(object: any) {
    if (object.type === 'join') {
      const body = {
        news_id: object.id,
      };
      this.newsService.postParticipates(body).subscribe((res) => {
        if (res) {
          this.data.summary.number_of_participates += 1;
          this.data.has_participated = !this.data.has_participated;
          // this.newsDataService.setNewDetail(this.data);
          this.participates.push(res);
        }
      });
    } else {
      const event_id = object.id;

      this.newsService.deleteParticipates(event_id).subscribe((res) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (this.data.summary.number_of_participate === 0) {
          this.data.summary.number_of_participates = 0;
        } else {
          this.data.summary.number_of_participates -= 1;
        }

        this.data.has_participated = !this.data.has_participated;
        // this.newsDataService.setNewDetail(this.data);
        this.participates = this.participates.filter(
          (item: any) => item.user.id !== user.id
        );
      });
    }
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
        this.newsService
          .getNew(this.router.snapshot.params['id'])
          .subscribe((res: any) => {
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
        this.newsService.getNews(this.query).subscribe((res) => {
          if (res && res.data) {
            const data = convertDataNewsList(res.data);
            this.newsDataService.setMyNews(data);
          }
        });
      }
    });
  }

  //
  getParticipatesData() {
    this.newsService
      .getParticipates(this.queryParticipates)
      .subscribe((res) => {
        if (res && res.data) {
          this.participates = res.data;
          this.queryParticipates.limit = +res.paging.limit;
          this.queryParticipates.offset = +res.paging.limit;
          this.countParticipates = +res.paging.count;
          this.isLoadingParticipates = false;
        }
      });
  }

  //get news for load scroll
  getLoadParticipatesData(query?: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    news_id?: string;
    user_id?: string;
  }) {
    this.newsService.getParticipates(query).subscribe((res) => {
      if (res && res.data) {
        // this.convertNewsData(res);
        this.participates = this.participates.concat(res.data);
        this.queryParticipates.offset = this.participates.length;
        this.countParticipates = +res.paging.count;
      }
    });
  }

  //load data after scroll
  loadDataPaticipates() {
    let query: any = {
      ...this.queryParticipates,
      offset: this.queryParticipates.offset,
      limit: this.queryParticipates.limit,
    };
    if (this.queryParticipates.offset < this.countParticipates) {
      this.getLoadParticipatesData(query);
    }
  }

  //scroll data
  onIonInfinitePaticipates(ev: any) {
    this.loadDataPaticipates();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

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
                  .getNew(this.router.snapshot.params['id'])
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
      resource_id: this.data.id ? this.data.id : null,
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
                  .getNew(this.router.snapshot.params['id'])
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
