import { Component, OnInit } from '@angular/core';
import { AlertDialog, CreateFollowParams } from '../../interface';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { ChapterService } from '../../services/chapter.service';
import { Location } from '@angular/common';
import { query } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.page.html',
  styleUrls: ['./chapters.page.scss'],
})
export class ChaptersPage implements OnInit {
  chapters: any = [];
  organizations: any = [];

  limit = 10;
  offset = 0;
  count = 0;
  searchValue: any = '';
  me: any;
  chapterIds: any = [];
  resourceAccess: any;

  isErrorImg: boolean = false;
  isLoading: boolean = true;

  constructor(
    private chapterService: ChapterService,
    private alertController: AlertController,
    private location: Location,
    private route: Router,
    private router: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.router.queryParams.subscribe((params: any) => {
      this.searchValue =
        params['q']?.replaceAll('%', '') ||
        (params['tag']?.replaceAll('%', '')
          ? `#${params['tag']?.replaceAll('%', '')}`
          : '');
      let query: any = {
        offset: 0,
        limit: 10,
        q: this.searchValue.replaceAll('%', '')
          ? `%${this.searchValue.replaceAll('%', '')}%`
          : '',
      };

      this.getChapters(query);
    });
    this.getMe();
  }

  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  getChapters(query: any) {
    this.isLoading = true;
    this.chapterService.getChapters(query).subscribe((res: any) => {
      if (res && res.data) {
        this.chapters = res.data;
        this.chapters.forEach((chapter: any) => {
          this.authService.resourceAccess().subscribe((res: any) => {
            if (res.chapters.length !== 0) {
              res.chapters.forEach((item: any) => {
                if (chapter.id === item.chapter_id) {
                  chapter.is_member = true;
                }
              });
            }
          });
        });
        this.limit = +res.paging.limit;
        this.offset = +res.paging.limit;
        this.count = +res.paging.count;
        this.isLoading = false;
      }
    });
  }

  loadChapters(ev: any) {
    let query: any = { offset: this.offset, limit: this.limit };
    if (this.offset < this.count) {
      this.chapterService.getChapters(query).subscribe((res: any) => {
        this.offset = this.chapters.length;
        this.count = +res.paging.count;

        this.chapters = this.chapters.concat(res.data);
        setTimeout(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        }, 500);
      });
    } else {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }
  }

  onIonInfinite(ev: any) {
    this.loadChapters(ev);
  }

  goBack() {
    this.location.back();
  }

  handleSearch(event: any) {
    const query = {
      q: event.target.value.toLowerCase(),
    };
    this.getChapters(query);
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

  //join chapter
  joinChapter(id: string) {
    let body = {
      user_id: this.me.id,
      chapter_id: id,
    };
    this.chapterService.joinChapter(body).subscribe((res) => {
      this.chapters.forEach((item: any) => {
        if (item.id === id) {
          item.is_requested = !item.is_requested;
        }
      });
    });
  }

  //reject chapter
  cancelJoinChapter(chapter: any) {
    this.chapterService
      .cancelJoinChapter(chapter.request_id)
      .subscribe((res) => {
        if (res) {
          this.chapters.forEach((item: any) => {
            if (item.id === chapter.id) {
              item.is_requested = !item.is_requested;
            }
          });
        }
      });
  }

  //search chapter
  showSearchChapterModel() {
    this.route.navigate(['/', 'tabs', 'chapters', 'search']);
  }
}
