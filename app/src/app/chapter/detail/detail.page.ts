import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IChapter } from '../../interface/chapter.interface';
import { Location } from '@angular/common';
import { AuthService } from '../../services';
import { ChapterDataService } from '../../shared/services';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { UserDetail } from 'src/app/interface/user.interface';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  @ViewChild('fab', { read: ElementRef }) fab!: ElementRef;
  @ViewChild(IonContent) content: IonContent | undefined;
  fabListOpen: boolean = false;

  buttons = [
    {
      type: '0',
      title: this.translate.instant('TAB.HOME.CHILD.OPPORTUNITY'),
      icon: 'bulb-outline',
    },
    {
      type: '1',
      title: this.translate.instant('TAB.HOME.CHILD.EVENT'),
      icon: 'calendar-number-outline',
    },
    {
      type: '2',
      title: this.translate.instant('TAB.HOME.CHILD.NEWS'),
      icon: 'newspaper-outline',
    },
    {
      type: '3',
      title: this.translate.instant('TAB.COMMERCE.TITLE'),
      icon: 'add-circle-outline',
    },
  ];

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  query: any = {
    q: '',
    limit: this.limit,
    offset: this.offset,
    include:
      'user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children',
    type: '',
  };

  chapter: IChapter = {
    code: null,
    color: null,
    created_by: null,
    created_date: null,
    description: '',
    display_order: null,
    id: '',
    name: '',
    updated_date: '',
    users: [],
    organizations: [],
  };

  chapterId: string = '';
  selectedSegment: string = 'about';
  isAvailableUser = false;
  isLoading: boolean = true;
  me: any;
  resourceAccess: any;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private chapterDataService: ChapterDataService,
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) {
    this.chapterId = this.route.snapshot.params['id'];
    this.getChapterDetail();
  }

  ngOnInit() {
    this.getMe();
    this.getResourceAccess();
  }

  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  getResourceAccess() {
    this.authService.resourceAccess().subscribe((res: any) => {
      this.resourceAccess = res;
    });
  }

  getChapterDetail() {
    this.chapterDataService.chapterDetail$.subscribe((chapter) => {
      this.chapter = chapter;

      this.isLoading = false;

      let user = JSON.parse(localStorage.getItem('user') || '{}');
      chapter.users?.filter((u: UserDetail) => {
        if (u.id === user.id) {
          this.isAvailableUser = true;
        }
      });
    });
  }

  goBack() {
    localStorage.removeItem('searchQueryProducts');
    localStorage.removeItem('searchQueryNews');
    this.location.back();
  }

  changeSegment(event: any) {
    this.selectedSegment = event.detail.value;
  }

  onClickCreateCommerce(type: number) {
    const typeString = type.toString();
    this.query = {
      include:
        'user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children',
      limit: 10,
      offset: 0,
      type: typeString,
      chapter_id: this.chapter.id,
    };

    if (Number(this.query.type) <= 2) {
      localStorage.setItem('searchQueryNews', JSON.stringify(this.query));
    }

    if (this.query.type === '1') {
      this.router.navigate([`/tabs/chapters/event/create`]);
    } else if (this.query.type === '0') {
      this.router.navigate([`/tabs/chapters/opportunity/create`]);
    } else if (this.query.type === '2') {
      this.router.navigate([`/tabs/chapters/news/create`]);
    } else {
      const query = {
        limit: 10,
        offset: 0,
        include: 'author,summary,user,product_category,images',
        chapter_id: this.chapter.id,
      };
      localStorage.setItem('searchQueryProducts', JSON.stringify(query));
      this.router.navigate([`/tabs/chapters/commerce/create`]);
    }
  }

  toggleFabList() {
    this.fabListOpen = true;
  }

  @HostListener('document:mousewheel', ['$event'])
  closeFabListOnScroll(event: any) {
    if (!this.fab.nativeElement.contains(event.target)) {
      this.fab.nativeElement.close();
      this.fabListOpen = false;
    }
  }
  @HostListener('document:click', ['$event'])
  closeFabListOnClickOutside(event: any) {
    if (!this.fab.nativeElement.contains(event.target)) {
      this.fab.nativeElement.close();
      this.fabListOpen = false;
    }
  }
}
