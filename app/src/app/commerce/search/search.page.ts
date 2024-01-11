import { Location } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchHistoriesService } from 'src/app/services';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('searchQuery', { read: ElementRef }) searchQuery!: ElementRef;
  searchValue: string = '';

  constructor(
    private location: Location,
    private router: Router,
    private searchHistoryService: SearchHistoriesService
  ) {}

  ngOnInit() {
    this.getSearchHistories();
  }

  ionViewDidEnter() {
    this.searchQuery.nativeElement.setFocus();
    let value = localStorage.getItem('searchValue');
    if (value !== null) {
      this.searchValue = value;
    }
  }

  histories: any[] = [];

  getSearchHistories(query: any = {}) {
    this.searchHistoryService
      .getSearchHistories({ type: 'product', ...query })
      .subscribe((res: any) => {
        this.histories = res.data;
      });
  }

  handleInput(event: any) {
    const query = event.target.value;
    this.getSearchHistories({ q: `%${query}%` });
    localStorage.removeItem('searchValue');
  }

  search(event: any) {
    const query = event.target.value;
    this.router.navigate(['/', 'tabs', 'commerces'], {
      queryParams: { q: query.replaceAll('%', '') },
    });
    localStorage.removeItem('searchValue');
  }

  goBack() {
    localStorage.removeItem('searchValue');
    this.router.navigate(['/', 'tabs', 'commerces']);
  }

  remove(item: any) {
    this.histories = this.histories.filter((h: any) => h.id !== item.id);
    this.searchHistoryService.deleteSearchHistory(item.id).subscribe(() => {});
  }
}
