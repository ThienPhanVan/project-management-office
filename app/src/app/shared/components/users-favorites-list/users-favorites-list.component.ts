import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { NewsService } from '../../../services/news.service';

@Component({
  selector: 'app-users-favorites',
  templateUrl: './users-favorites-list.component.html',
  styleUrls: ['./users-favorites-list.component.scss'],
})
export class UsersFavoritesComponent implements OnInit {
  @Input() data: any;
  @Input() type: any;
  @Input() mentions: any[] = [];
  @Output() setOpen: EventEmitter<boolean> = new EventEmitter();
  @Output() setOpenAndRedirect: any = new EventEmitter();
  isAvatar: boolean = true;

  showModal: boolean = false;
  imagesString: string = '';
  isScroll: boolean = true;

  user: any;
  userReactions: any[] = [];
  userMentions: any[] = [];
  isLoading: boolean = false;
  query: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    resource_id?: string;
  } = {
    limit: 10,
    offset: 0,
    resource_id: '',
    q: '',
    include: 'user',
  };
  countReactions: number = 0;

  countPar: number = 0;
  queryPar: {
    offset: number;
    limit: number;
    q?: string;
    include: string;
    news_id: string;
    user_id?: string;
  } = {
    limit: 10,
    offset: 0,
    include: 'user,news',
    news_id: '',
  };
  participates: any[] = [];

  constructor(
    private newsService: NewsService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.query = {
      ...this.query,
      resource_id: this.data?.id,
    };
    // if (this.type === 'events') {
    //   this.queryPar = {
    //     ...this.queryPar,
    //     news_id: this.data.id,
    //   };
    //   this.newsService.getParticipates(this.queryPar).subscribe((res) => {
    //     if (res && res.data) {
    //       this.userReactions = res.data;
    //       this.queryPar.limit = +res.paging.limit;
    //       this.queryPar.offset = +res.paging.limit;
    //       this.countPar = +res.paging.count;
    //       this.isLoading = false;
    //     }
    //   });
    // } else {
    this.getReactionsData(this.query);
    // }

    if (this.mentions) {
      this.userMentions = this.mentions.slice(0, 10);
    }
  }

  getReactionsData(query: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    resource_id?: string;
  }) {
    this.isLoading = true;
    this.newsService.getReactions(query).subscribe((res) => {
      if (res && res.data) {
        this.userReactions = res.data;
        this.query.limit = +res.paging.limit;
        this.query.offset = +res.paging.limit;
        this.countReactions = +res.paging.count;
        this.isLoading = false;
      }
    });
  }

  //get data for load scroll
  getLoadReactionsData(query: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    resource_id?: string;
  }) {
    this.newsService.getReactions(query).subscribe((res: any) => {
      if (res && res.data) {
        // this.convertNewsData(res);
        this.userReactions = this.userReactions.concat(res.data);
        this.query.offset = this.userReactions.length;
        this.countReactions = +res.paging.count;
      }
    });
  }

  //load data after scroll
  loadDataReactions() {
    let query: any = {
      ...this.query,
      offset: this.query.offset,
      limit: this.query.limit,
    };
    if (this.query.offset < this.countReactions) {
      this.isScroll = true;
      this.getLoadReactionsData(query);
    } else {
      this.isScroll = false;
    }
  }

  loadDataMentions() {
    let count = 0;
    if (this.userMentions.length < this.mentions.length) {
      this.isScroll = true;
      count += 10;
      this.userMentions = this.userMentions.concat(
        this.mentions.splice(count, 10)
      );
    } else {
      this.isScroll = false;
    }
    // console.log(this.userMentions);
  }

  //get for load scroll
  getLoadParticipates(query?: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    news_id: string;
    user_id?: string;
  }) {
    this.newsService.getParticipates(query).subscribe((res) => {
      if (res && res.data) {
        this.participates = this.participates.concat(res.data);

        this.queryPar.offset = this.participates.length;
        this.countPar = +res.paging.count;
      }
    });
  }

  //load data after scroll
  loadDataParticipates() {
    let query: any = {
      ...this.queryPar,
      offset: this.queryPar.offset,
      limit: this.queryPar.limit,
    };
    if (this.queryPar.offset < this.countPar) {
      this.isScroll = true;
      this.getLoadParticipates(query);
    } else {
      this.isScroll = false;
    }
  }

  //scroll data
  onIonInfinite(ev: any) {
    // if (this.type === 'events') {
    //   this.loadDataParticipates();
    // } else {
    this.loadDataReactions();
    this.loadDataMentions();
    // }

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  // changeSegment(event: any) {
  //   this.segmentStatus = Number(event.detail.value);
  // }

  getImageSrc(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }

  setCloseModal(value: boolean) {
    this.setOpen.emit(value);
    this.modalController.dismiss();
  }
}
