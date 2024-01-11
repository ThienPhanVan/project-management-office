import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'app-select',
  templateUrl: './base-select.component.html',
  styleUrls: ['./base-select.component.scss'],
})
export class BaseSelectComponent implements OnInit, OnChanges {
  @Input() value: any;
  @Input() items: any[] = [];

  @Input() title: string = '';
  @Input() label: string = '';
  @Input() placeHolder: string = '';

  @Input() isOpen: boolean = false;

  @Input() searchable: boolean = false;
  @Input() removable: boolean = false;
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() required: boolean = false;

  @Output() selectionChange = new EventEmitter<any>();
  @Output() valueChange = new EventEmitter<any>();

  itemsFiltered: any[];
  selectedItems: any[];

  constructor() {
    this.itemsFiltered = this.items;
    this.selectedItems = this.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    let currentItems = changes['items']?.currentValue;
    if (currentItems) {
      this.itemsFiltered = currentItems;
    }

    let currentValue = changes['value']?.currentValue;
    if (currentValue && this.multiple) {
      this.selectedItems = currentValue;
    }
  }

  ngOnInit() {}

  cancel() {
    this.isOpen = false;
    if (this.multiple) {
      this.selectedItems = this.value;
    }
  }

  open() {
    this.isOpen = true;
  }

  isChecked(value: any) {
    if (this.multiple) {
      return _.includes(this.value, value.id);
    } else {
      return this.value === value.id;
    }
  }

  isNil(item: any): boolean {
    return _.isNil(item);
  }

  getItemById(id: any) {
    return _.find(this.items, (item) => item.id === id) || {};
  }

  checkboxChange(event: any) {
    const { checked, value } = event.detail;
    if (!this.multiple) {
      this.value = checked ? value.id : null;
    } else {
      if (checked) {
        if (_.isArray(this.selectedItems)) {
          this.selectedItems = [...this.selectedItems, value.id];
        } else {
          this.selectedItems = [value.id];
        }
      } else {
        this.selectedItems = this.selectedItems.filter(
          (id: any) => id !== value.id
        );
      }
    }
  }

  confirmChanges() {
    if (this.multiple) {
      this.valueChange.emit(this.selectedItems);
    } else {
      const group =
        this.itemsFiltered.find((group) => group.id === this.value) || {};
      this.valueChange.emit(this.value);
      this.selectionChange.emit(group);
    }
    this.cancel();
  }

  clear() {
    this.value = null;
    this.valueChange.emit(this.value);
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
      this.itemsFiltered = [...this.items];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.itemsFiltered = this.items.filter((item) => {
        return (item.name + (item.code || ''))
          .toLowerCase()
          .includes(normalizedQuery);
      });
    }
  }
}
