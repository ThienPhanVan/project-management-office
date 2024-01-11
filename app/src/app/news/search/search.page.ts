import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
    setTimeout(() => {
      this.setFocusOnSearch();
    }, 500);
    // this.searchQuery.nativeElement.setFocus();
    // let value = localStorage.getItem('searchValue');
    // if (value !== null) {
    //   this.searchValue = value;
    // }
  }

  setFocusOnSearch() {
    if (this.searchQuery && this.searchQuery.nativeElement) {
      this.searchQuery.nativeElement.setFocus();
      let value = localStorage.getItem('searchValue');
      if (value !== null) {
        this.searchValue = value;
      }
    }
  }
  histories: any[] = [];

  getSearchHistories(query: any = {}) {
    this.searchHistoryService
      .getSearchHistories({ type: 'news', ...query })
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
    this.router.navigate(['/', 'tabs', 'home'], {
      queryParams: { q: query.replaceAll('%', '') },
    });
    localStorage.removeItem('searchValue');
  }

  goBack() {
    localStorage.removeItem('searchValue');
    this.router.navigate(['/', 'tabs', 'home']);
  }

  remove(item: any) {
    this.histories = this.histories.filter((h: any) => h.id !== item.id);
    this.searchHistoryService.deleteSearchHistory(item.id).subscribe(() => {});
  }
}
