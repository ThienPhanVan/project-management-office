import { query } from '@angular/animations';
import { LocationStrategy } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  HostListener,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { IAttachment, Message } from '../../interface';
import * as _ from 'lodash';
import { GroupService } from 'src/app/services/group.service';
import { ConversationService } from 'src/app/services/conversation.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { InfiniteScrollCustomEvent, IonContent } from '@ionic/angular';
import { Subject, interval, switchMap, takeUntil, Subscription } from 'rxjs';
import { MasterDataService } from 'src/app/shared/services';
import { MessageUpdateService } from 'src/app/shared/services/message.service';
import { TranslateService } from '@ngx-translate/core';

interface User {
  id: string;
  username: string;
}

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit, OnDestroy {
  user!: User;
  shouldScrollToBottom: boolean = true;
  isTyping: boolean = true;
  groupId: any;
  @Input() selectedGroup: any;
  @Input() inputData: string = '';
  destroy$ = new Subject<void>();
  messages: Message[] = [];
  groupName: any;
  updateMessage: any;
  item: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private selectedGroupSubject: Subject<any> = new Subject<any>();
  private intervalSubscription: Subscription | undefined;

  @ViewChild(IonContent, { static: false }) content!: IonContent;

  constructor(
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private location: LocationStrategy,
    private groupService: GroupService,
    private masterDataService: MasterDataService,
    private messageService: MessageUpdateService,
    private translate: TranslateService,
    private router: Router,
    private zone: NgZone
  ) {}

  scrollToBottom(): void {
    if (this.content) {
      this.content.scrollToBottom(710);
    }
  }

  ionViewDidEnter() {
    this.scrollToBottom();
    this.shouldCallInfinite = true;
  }

  // @HostListener('ionScroll', ['$event'])
  // onScroll(event: CustomEvent) {
  //   const scrollPosition = event.detail.scrollTop;
  //   console.log('Scroll Position:', scrollPosition);
  // }

  limit = 20;
  offset = 0;
  count = 0;

  ngOnInit() {
    this.selectedGroupSubject
      .asObservable()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
          this.user = JSON.parse(userData);
        }

        this.messageService.messageUpdated$
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((updatedMessage: any) => {
            this.updateMessage = updatedMessage;
          });
      });

    const navigationExtras: NavigationExtras =
      this.router.getCurrentNavigation()?.extras || {};
    this.selectedGroup = navigationExtras.state?.['item'];

    if (this.selectedGroup) {
      this.selectedGroupSubject.next(true);
      this.groupName = this.selectedGroup.name
    }

    let hasCalledGetGroupById = false; 

    this.route.paramMap.subscribe((params) => {
      const groupId = this.selectedGroup?.id ?? params.get('groupId');
      let read: any = {
        status: 1,
        message_group_id: groupId,
      };
      this.groupService.readMessage(read).subscribe();

      if (groupId !== null) {
        let query: any = {
          offset: 0,
          limit: 20,
        };

        this.groupId = groupId;
        this.getMessageByGroup(query);
        interval(3000)
          .pipe(
            switchMap(() =>
              this.conversationService.getMessage(this.groupId, query)
            ),
            takeUntil(this.ngUnsubscribe)
          )
          .subscribe((res: any) => {
            const newMessages = res.data;
            newMessages.reverse();
            const uniqueNewMessages = newMessages.filter((newMessage: any) => {
              return !this.messages.some(
                (existingMessage) => existingMessage.id === newMessage.id
              );
            });
            this.messages.push(...uniqueNewMessages);
            this.offset = this.messages.length;
            if (this.offset < this.count) {
              this.limit += 10;
            }
            this.groupService.readMessage(read);
          });
          if (!hasCalledGetGroupById) {
            this.getGroupById(groupId);
            hasCalledGetGroupById = true; 
          }
        this.getGroupMember(groupId);
      }
      this.scrollToBottom();
    });
  }

  getGroupMember(id: string) {
    this.groupService.getMemberList(id).subscribe((res: any) => {
      if (res.paging.count === 2) {
        if (res.data[1].user.id === this.getMyId()) {
          this.groupName = res.data[0].user.username;
        } else {
          this.groupName = res.data[1].user.username;
        }
      }
    });
  }
  
  getGroupById(id: string) {
    this.groupService.getGroupById(id).subscribe((res: any) => {
      this.groupName = res.name;
    });
  }

  getContactInfo() {
    if (!this.selectedGroup) return {};
    if (this.selectedGroup.is_group === 0) {
      return _.find(
        this.selectedGroup.group_users,
        (user) => user.id !== this.user.id
      );
    }
    return this.selectedGroup;
  }

  shouldCallInfinite: boolean = false;

  onIonInfinite(ev: any) {
  if (!this.groupId || !this.shouldCallInfinite) {
    if (ev) {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }
    return;
  }

  let query: any = {
    offset: this.offset,
    limit: this.limit,
  };

  this.conversationService.getMessage(this.groupId, query).subscribe((res: any) => {
    const mess = res.data.reverse();
    this.messages.unshift(...mess);

    this.offset = this.messages.length;
    this.limit += 20;

    if (ev) {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }
    this.shouldCallInfinite = true;
  });
}
  

  getMessageByGroup(query: any) {
    if (this.groupId !== null) {
      this.conversationService
        .getMessage(this.groupId, query)
        .subscribe((res: any) => {
          const mess = res.data;
          const newMessages = [...mess];
          const uniqueNewMessages = newMessages.filter((newMessage: any) => {
            return !this.messages.some(
              (existingMessage) => existingMessage.id === newMessage.id
            );
          });
          this.messages.unshift(...uniqueNewMessages);
          
          this.offset = this.messages.length;
          if (this.offset < this.count) {
            this.limit += 20;
          }
          if (this.offset >= this.count) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.scrollToBottom();
              }, 0);
            });
          }
        });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  dataURItoBlob(dataURI: string, fileType: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: fileType });
  }

  async sendMessage(event: any) {
    const newMessage = event.newMessage;

    if (this.updateMessage && this.updateMessage.id !== null) {
      const sendMessageRequest: Message = {
        id: this.updateMessage.id,
        description:
          newMessage + this.translate.instant('TAB.MESSAGE.EDITED_MESSAGE'),
        message_group_id: this.groupId,
      };
      this.conversationService
        .editMessage(this.updateMessage.id, sendMessageRequest)
        .subscribe(() => {
          const updatedIndex = this.messages.findIndex(
            (msg) => msg.id === this.updateMessage.id
          );
          if (updatedIndex !== -1) {
            this.messages[updatedIndex].description =
              sendMessageRequest.description;
          }
          this.updateMessage.id = null;
        });
    } else {
      const selectedAttachments = event.selectedAttachments;
      if (newMessage.trim().length > 0 || selectedAttachments.length > 0) {
        if (selectedAttachments.length > 0) {
          const uploadRequests = selectedAttachments.map(
            (attachment: IAttachment) => {
              const blob = this.dataURItoBlob(
                attachment.content as string,
                attachment.type
              );
              const file = new File([blob], attachment.name, {
                type: attachment.type,
              });
              const isVideo = attachment.type.includes('video');
              const isImage = attachment.type.startsWith('image');
              if (isVideo) {
                this.uploadVideo(file);
              } else if (isImage) {
                this.uploadImage(file);
              } else {
                console.error('Unsupported file type');
              }
            }
          );
        } else {
          const sendMessageRequest: Message = {
            id: '',
            description: newMessage,
            message_group_id: this.groupId,
          };

          this.conversationService
            .sendMessage(sendMessageRequest)
            .subscribe((res) => {
              this.messages = [...this.messages, res];
            });
        }
      }
    }
  }

  uploadVideo(file: File) {
    this.conversationService
      .onFileSelected(file, new Date().getDate())
      .subscribe((res: any) => {
        if (res.body && res.body.Location) {
          const mediaIds = res.body.Location;
          const sendMessageRequest: Message = {
            id: '',
            message_group_id: this.groupId,
            images: [{ image_url: mediaIds }],
          };
          this.conversationService
            .sendMessage(sendMessageRequest)
            .subscribe((res) => {
              res.message_images = [{ image_url: mediaIds }];
              this.messages = [...this.messages, res];
            });
        }
      });
  }

  uploadImage(file: File) {
    this.conversationService
      .onFileSelected(file, new Date().getDate())
      .subscribe((res: any) => {
        if (res.body && res.body.Location) {
          const mediaIds = res.body.Location;
          const sendMessageRequest: Message = {
            id: '',
            message_group_id: this.groupId,
            images: [{ image_url: mediaIds }],
          };

          this.conversationService
            .sendMessage(sendMessageRequest)
            .subscribe((res) => {
              res.message_images = [{ image_url: mediaIds }];
              this.messages = [...this.messages, res];
            });
        }
      });
  }

  back() {
    this.router.navigateByUrl('/tabs/connect');
  }

  getMyId() {
    return this.masterDataService.meBus$.value?.id || '';
  }
}
