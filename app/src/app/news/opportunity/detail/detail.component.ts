import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NewsResponse } from 'src/app/interface/news.interface';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { NewsService } from 'src/app/services/news.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import {
  THUMBNAIL_URL,
  convertComment,
  convertDataNewsDetail,
  convertDataNewsList,
  convertTimeToFromNow,
  extractHTTPSURL,
} from 'src/app/constant';
import { MetaDataService, NewsDataService } from 'src/app/shared/services';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { AlertDialog, IAttachment } from 'src/app/interface';
import { AuthService } from 'src/app/services';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-opportunity-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class OpportunityDetailComponent implements OnInit {
  // @Output() heart: EventEmitter<string> = new EventEmitter();
  @ViewChild('commentElement') commentElement: ElementRef | undefined;
  type: string = 'detail';
  isLoading: boolean = true;
  hostNameLocation: string = '';
  showModal: boolean = false;

  isActionSheetOpen = false;
  isAvatar: boolean = true;
  query: any;
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
    summary: {
      number_of_reactions: 0,
    },
  };

  segment: string = '1';
  itemComment: any = {
    comment: '',
  };
  isSendSuccess: boolean = false;
  hasBid: boolean = true;
  dataBids: any[] = [];
  queryBids = {
    offset: 0,
    limit: 10,
    q: '',
    include: 'user,news',
    news_id: undefined,
  };
  countBids: number = 0;
  showBid: boolean = false;
  news: any = [];
  user: any;
  newsDetail: any;
  mentionsComment: any[] = [];

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  queryComment: any = {
    q: '',
    limit: this.limit,
    offset: this.offset,
    include:
      'author,replies,replies_author,reply_images,mentions,images,reactions',
    resource_id: this.router.snapshot.params['id'],
  };

  comments: any = [];
  isLoadingComment: boolean = true;
  me: any;

  constructor(
    private translate: TranslateService,
    private location: Location,
    private newsService: NewsService,
    private router: ActivatedRoute,
    private newsDataService: NewsDataService,
    private route: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private groupService: GroupService,
    private routers: Router,
    private metadataService: MetaDataService
  ) {
    this.subscribeFetchNewDetail();
    this.subscribeFetchComment();
  }

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

  ngOnInit(): void {
    this.isLoading = true;

    const isCommentRedirect = localStorage.getItem('isComment');
    if (isCommentRedirect) {
      this.segment = '1';
      localStorage.removeItem('isComment');
    }
    const queryStr = localStorage.getItem('searchQueryNews');
    if (queryStr) {
      this.query = JSON.parse(queryStr);
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }

    this.getMe();

    this.newsService
      .getNew(this.router.snapshot.params['id'])
      .subscribe((res: any) => {
        if (res && res.id) {
          const data = convertDataNewsDetail(res);
          this.data = data;
          this.queryBids = {
            ...this.queryBids,
            news_id: this.data.id,
          };
          this.getDefaultBidsData(this.queryBids);
          this.newsDataService.setNewDetail({ ...this.data });
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.route.navigate(['/not-found']);
        }
      });
    this.getInitCommentData(this.queryComment);
    this.hostNameLocation = window.location.host + '/tabs/opportunities';
  }

  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  getCallbackBids() {
    const query = {
      ...this.queryBids,
      offset: 0,
    };
    this.getDefaultBidsData(query);
  }

  getDefaultBidsData(query: any) {
    this.newsService.getBids(query).subscribe((res: any) => {
      if (res && res.data) {
        this.dataBids = res.data;
        this.queryBids.limit = +res.paging.limit;
        this.queryBids.offset = +res.paging.limit;
        this.countBids = +res.paging.count;
        this.isLoading = false;
      }
    });
  }

  //get bids data
  getBidsData(query: any) {
    this.newsService.getBids(query).subscribe((res: any) => {
      if (res && res.data) {
        this.dataBids = res.data;
        this.dataBids = this.dataBids.concat(res.data);
        this.queryBids.offset = this.dataBids.length;
        this.countBids = +res.paging.count;
      }
    });
  }

  //load data after scroll
  loadDataBids() {
    let query: any = {
      ...this.queryBids,
      offset: this.queryBids.offset,
      limit: this.queryBids.limit,
    };
    if (this.queryBids.offset < this.countBids) {
      this.getBidsData(query);
    }
  }

  //scroll data
  onIonInfiniteBids(ev: any) {
    this.loadDataBids();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  //convert detail news data
  convertNewData(data: NewsResponse) {
    data.updated_date = convertTimeToFromNow(data.updated_date);
    data.listImages =
      data.media !== null && data.media !== '' ? data.media.split(',') : [];

    data.username = data?.author?.username ?? '';
    data.thumbnail = data?.author?.thumbnail ?? THUMBNAIL_URL;
    return data;
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

  redirect(ev: any) {
    this.segment = '1';
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
          `/tabs/opportunities/update/${this.router.snapshot.params['id']}`,
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
      }
    }
    this.isActionSheetOpen = false;
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

  setOpenActionSheet(value: boolean) {
    this.isActionSheetOpen = value;
  }

  //go back url
  goBack() {
    this.location.back();
  }

  //change tab
  changeSegment(event: any) {
    this.segment = event.detail.value;
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
        this.limit = +res.paging.limit;
        this.offset = +res.paging.limit;
        this.count = +res.paging.count;
        this.isLoadingComment = false;
      }
    });
  }

  getLoadComments(query?: any) {
    this.newsService.getComments(query).subscribe((res: any) => {
      if (res && res.data) {
        this.offset = this.comments.length;
        this.count = +res.paging.count;
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
    if (this.offset < this.count) {
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
      resource_id: this.data.id,
      resource_type: 'opportunity',
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

  //bid detail
  onBidDetail(data: any) {
    this.dataBids.forEach((item: any, index: number) => {
      if (item.id === data.id) {
        this.dataBids[index] = data;
      }
    });
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

  async sendMessage(ev: any) {
    const groupData = {
      is_private: 0,
      member_ids: [ev.user.id],
    };
    this.groupService.createGroup(groupData).subscribe((res) => {
      this.routers.navigate(['/group', res.id]);
    });
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
      console.log(this.metadata);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  }
}
