import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { OnInit } from '@angular/core';

import { IBaseItem } from '../../../interface/base-item.interface';
import { ICreateIndustryRequestBody } from 'src/app/interface/industry.interface';

import { IndustriesService } from 'src/app/services/industry.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-industry-select',
  templateUrl: 'industry-select.component.html',
})
export class IndustrySelectComponent implements OnInit {
  @Input() selectedIndustries: IBaseItem[] = [];

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<IBaseItem[]>();

  industries: IBaseItem[] = [];
  filteredItems: IBaseItem[] = [];

  title = this.translate.instant('SELECT.LABEL.INDUSTRIES');
  newIndustryName: string = '';
  toastMessage: string = '';

  isCreating: Boolean = false;

  constructor(
    private industriesService: IndustriesService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadIndustries();
  }

  loadIndustries() {
    this.industriesService.getIndustries().subscribe((res: any) => {
      this.industries = res.data.filter((item: IBaseItem) => item.name);
      this.filteredItems = [...this.industries];
    });
  }

  // create industry and change icon submit by isCreating variable
  createIndustry(params: ICreateIndustryRequestBody) {
    this.isCreating = true;
    this.industriesService.addIndustry(params).subscribe(
      (res: any) => {
        this.loadIndustries();
        let industryCreated = {
          id: res.id,
          name: this.newIndustryName,
        };
        this.selectedIndustries.push(industryCreated);
        this.newIndustryName = ' ';
        this.toastMessage = this.translate.instant(
          'NOTIFICATION.CONTENT.ADD_SUCCESS'
        );
        this.isCreating = false;
      },
      () => {
        this.toastMessage = this.translate.instant(
          'NOTIFICATION.CONTENT.ADD_FAILURE'
        );
        this.isCreating = false;
      }
    );
  }

  changenewIndustry(event: any) {
    this.newIndustryName = event.detail.value;
  }

  closeToast() {
    this.toastMessage = '';
  }

  addItem() {
    const params: ICreateIndustryRequestBody = {
      name: this.newIndustryName,
      type: '',
      display_order: 0,
    };
    this.createIndustry(params);
  }

  trackItems(index: number, item: IBaseItem) {
    return item.id;
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.selectedIndustries);
  }

  searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  filterList(searchQuery: string | undefined) {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined) {
      this.filteredItems = [...this.industries];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.industries.filter((item) => {
        return item.name.toLowerCase().includes(normalizedQuery);
      });
    }
  }

  isChecked(value: IBaseItem) {
    return this.selectedIndustries.find((item) => item.id === value.id);
  }

  checkboxChange(ev: any) {
    const { checked, value } = ev.detail;

    if (checked) {
      this.selectedIndustries = [...this.selectedIndustries, value];
    } else {
      this.selectedIndustries = this.selectedIndustries.filter(
        (item) => item.id !== value.id
      );
    }
  }
}
