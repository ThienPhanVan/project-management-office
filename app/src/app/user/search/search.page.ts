import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchHistoriesService } from 'src/app/services';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  constructor(
    private location: Location,
    private router: Router,
    private searchHistoryService: SearchHistoriesService
  ) {}

  ngOnInit() {
    this.getSearchHistories();
  }

  histories: any[] = [];

  getSearchHistories(query: any = {}) {
    this.searchHistoryService
      .getSearchHistories({ type: 'user', ...query })
      .subscribe((res: any) => {
        this.histories = res.data;
      });
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.getSearchHistories({ q: `%${query}%` });
  }

  search(event: any) {
    const query = event.target.value.toLowerCase();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/', 'tabs', 'users'], {
      queryParams: { q: query.replaceAll('%', '') },
    });
  }

  goBack() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/', 'tabs', 'users']);
  }

  remove(item: any) {
    this.histories = this.histories.filter((h: any) => h.id !== item.id);
    this.searchHistoryService.deleteSearchHistory(item.id).subscribe(() => {});
  }
}
