import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { OnInit } from '@angular/core';

import { IBaseItem } from '../../../interface/base-item.interface';
import { ICreateServiceRequestBody } from 'src/app/interface/service.interface';

import { ServicesService } from 'src/app/services/service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-service-select',
  templateUrl: 'service-select.component.html',
})
export class ServiceSelectComponent implements OnInit {
  @Input() selectedServices: IBaseItem[] = [];

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<IBaseItem[]>();

  services: IBaseItem[] = [];
  filteredItems: IBaseItem[] = [];

  title = this.translate.instant('SELECT.LABEL.SERVICES');
  toastMessage: string = '';
  newServiceName: string = '';

  isCreating: Boolean = false;

  constructor(
    private servicesService: ServicesService,
    private translate: TranslateService
    ) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.servicesService.getServices().subscribe((res: any) => {
      this.services = res.data.filter(
        (item: IBaseItem) => item.name !== null || ''
      );
      this.filteredItems = [...this.services];
    });
  }

  // create service and change icon submit by isCreating variable
  createService(params: ICreateServiceRequestBody) {
    this.isCreating = true;
    this.servicesService.addService(params).subscribe(
      (res: any) => {
        this.loadServices();
        let serviceCreated = {
          id: res.id,
          name: this.newServiceName,
        };
        this.selectedServices.push(serviceCreated);
        this.newServiceName = ' ';
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

  changenewService(event: any) {
    this.newServiceName = event.detail.value;
  }

  closeToast() {
    this.toastMessage = '';
  }

  addItem() {
    const params: ICreateServiceRequestBody = {
      name: this.newServiceName,
      type: '',
      display_order: 0,
    };
    this.createService(params);
  }

  trackItems(index: number, item: IBaseItem) {
    return item.id;
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.selectedServices);
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
      this.filteredItems = [...this.services];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */

      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.services.filter((item) => {
        return item.name.toLowerCase().includes(normalizedQuery);
      });
    }
  }

  isChecked(value: IBaseItem) {
    return this.selectedServices.find((item) => item.id === value.id);
  }

  checkboxChange(ev: any) {
    const { checked, value } = ev.detail;

    if (checked) {
      this.selectedServices = [...this.selectedServices, value];
    } else {
      this.selectedServices = this.selectedServices.filter(
        (item) => item.id !== value.id
      );
    }
  }
}
