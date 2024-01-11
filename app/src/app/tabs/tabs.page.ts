import { Subscription } from 'rxjs';
import { Component, Query } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from '../services/news.service';
import { NewsDataService } from '../shared/services';
import { convertDataNewsList, convertProductsList } from '../constant';
import { CommerceService } from '../services';
import { CommerceDataService } from '../shared/services/commerce-data.service';
import { UnreadMessageService } from '../shared/services/unread-message.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  receivedNumberUnread!: number;
  private subscription!: Subscription;
  query: any;
  constructor(
    private router: Router,
    private newsService: NewsService,
    private newsDataService: NewsDataService,
    private commerceService: CommerceService,
    private commerceDataService: CommerceDataService,
    private unreadMessageService: UnreadMessageService
  ) {
    this.subscription = this.unreadMessageService.numberUnread$.subscribe(
      (numberUnread) => {
        this.receivedNumberUnread = numberUnread;
      }
    );
  }

  historyNavigate: string = '';
  navigate(router: string): void {
    if (
      router === this.historyNavigate &&
      router !== '/tabs/home' &&
      router !== '/tabs/commerces'
    ) {
      return;
    } else {
      if (router === '/tabs/home' && router === this.historyNavigate) {
        const queryStr = localStorage.getItem('searchQueryNews');

        if (queryStr) {
          this.query = {
            ...JSON.parse(queryStr),
            user_id: '',
            chapter_id: '',
            organization_id: '',
          };
          localStorage.setItem('searchQueryNews', JSON.stringify(this.query));
        }
        this.getNewsList();
      }
      if (router === '/tabs/home' && router !== this.historyNavigate) {
        const queryStr = localStorage.getItem('searchQueryNews');

        if (queryStr) {
          this.query = {
            ...JSON.parse(queryStr),
            type: '',
            user_id: '',
            chapter_id: '',
            organization_id: '',
          };
          localStorage.setItem('searchQueryNews', JSON.stringify(this.query));
        }
        this.getNewsList();
      }

      if (router === '/tabs/commerces' && router !== this.historyNavigate) {
        this.query = {
          limit: 10,
          offset: 0,
          include: 'author,summary,user,product_category,images',
          q: '',
        };
        localStorage.setItem('searchQueryProducts', JSON.stringify(this.query));
        this.commerceDataService.setMyOrders([]);
        this.commerceDataService.setProducts([]);
      }

      if (router === '/tabs/community' && router !== this.historyNavigate) {
        this.commerceDataService.setMyOrders([]);
        this.commerceDataService.setProducts([]);
        this.newsDataService.setMyNews([]);
      }
      if (router === '/tabs/profile' && router !== this.historyNavigate) {
        this.commerceDataService.setMyOrders([]);
        this.commerceDataService.setProducts([]);
        this.newsDataService.setMyNews([]);
      }

      this.historyNavigate = router;
    }

    localStorage.removeItem('createNewsType');
    localStorage.removeItem('hashtag');
    localStorage.removeItem('org_seller');
    localStorage.removeItem('orderPreviews');
    localStorage.removeItem('cart');
    localStorage.removeItem('searchQueryChapterProducts');
    localStorage.removeItem('searchQueryChapterNews');

    this.router.navigate([router]);
  }

  getNewsList() {
    this.newsService.getNews(this.query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertDataNewsList(res.data);
        this.newsDataService.setMyNews(data);
      }
    });
  }

  getProducts(query?: any) {
    this.commerceService.getProducts(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertProductsList(res.data);
        this.commerceDataService.setProducts(data);
      }
    });
  }
}
