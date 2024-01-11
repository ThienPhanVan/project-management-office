import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-categories-filter',
  templateUrl: './categories-filter.component.html',
  styleUrls: ['./categories-filter.component.scss'],
})
export class CategoriesFilterComponent implements OnInit {
  @Input() title: string = '';
  @Input() isModalOpen: boolean = false;
  @Input() categories: any[] = [];

  @Output() categoriesFilter: EventEmitter<Array<string>> = new EventEmitter();
  @Output() setOpenModal = new EventEmitter();
  @Output() searchQuery = new EventEmitter();
  @Output() checked = new EventEmitter();

  searchUser: string = '';
  filterSelected: any = [];
  idChecked: any = [];
  constructor() {}

  ngOnInit() {}

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.setOpenModal.emit(this.isModalOpen);
  }

  //choose id
  ionChangeCategory(item: any, checked: boolean) {
    this.categories.forEach((el: any) => {
      if (el.id === item.id) {
        el.has_user_favorite = checked;
      }
    });
  }

  //choose Id and close modal
  confirmChanges() {
    this.categoriesFilter.emit(this.categories);
    this.idChecked = [];
    this.categories.forEach((el: any) => {
      if (el.has_user_favorite) {
        this.idChecked.push(el.id);
      }
    });
    this.checked.emit(this.idChecked);
    this.idChecked = [];
    this.isModalOpen = false;
    this.setOpenModal.emit(this.isModalOpen);
  }

  //close modal
  cancelChanges() {
    this.isModalOpen = false;
    this.searchQuery.emit('');
    this.setOpenModal.emit(this.isModalOpen);
  }

  //search categories
  handleSearch(event: any) {
    this.searchUser = event.target.value.toLowerCase();
    this.searchQuery.emit(event.target.value.toLowerCase());
  }
}
