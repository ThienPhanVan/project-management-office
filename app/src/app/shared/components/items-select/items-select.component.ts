import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-items-select',
  templateUrl: './items-select.component.html',
  styleUrls: ['./items-select.component.scss'],
})
export class ItemsSelectComponent implements OnInit, OnChanges {
  @Input() itemId: string = '';
  @Input() title: string = '';
  @Input() type: string = '';
  @Input() data: any;
  @Input() isLoading: boolean = false;
  @Input() removeName: boolean = false;

  @Output() chooseData = new EventEmitter();
  @Output() searchQuery = new EventEmitter();
  @Output() createData = new EventEmitter();

  nameChoose: string = '';
  newItemName: string = '';
  isModalOpen = false;
  item: any;

  constructor() {}

  ngOnInit() {}

  //
  ngOnChanges() {
    if (this.removeName) {
      this.newItemName = '';
    }

    if (this.itemId) {
      const find = this.data.find((el: any) => el.id === this.itemId);
      if (find) {
        this.nameChoose = find.name;
      }
    }
  }

  //open modal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  //change field
  changeNewItem(event: any) {
    this.newItemName = event.detail.value;
  }

  //add
  addItem() {
    this.createData.emit(this.newItemName);
  }

  //choose id
  ionChange(item: any) {
    this.item = item;
    this.itemId = item.id;
    this.nameChoose = item.name;
  }

  //choose Id and close modal
  confirmChanges() {
    this.chooseData.emit(this.item);

    this.isModalOpen = false;
  }

  //remove feeling
  removeItem() {
    this.nameChoose = '';
    this.item = {};
  }

  //close modal
  cancelChanges() {
    this.nameChoose = '';
    this.isModalOpen = false;
  }

  //search data
  handleSearch(event: any) {
    this.searchQuery.emit(event.target.value.toLowerCase());
    // this.query = event.target.value.toLowerCase();
    // if (this.lable === 'Chọn danh mục sản phẩm') {
    //   this.categoriesService
    //     .searchCategory(this.query)
    //     .subscribe((res: any) => {
    //       this.items = res.data.filter((item: ICategory) => item.name);
    //     });
    // }
    // if (this.lable === 'Chọn org') {
    //   this.organizationService
    //     .searchOrganizations(this.query)
    //     .subscribe((res: any) => {
    //       this.items = res.data.filter((item: IOrganization) => item.name);
    //     });
    // }
    // if (this.lable === 'Chọn chapter') {
    //   this.chapterService.searchChapters(this.query).subscribe((res: any) => {
    //     this.items = res.data.filter((item: IChapter) => item.name);
    //   });
    // }
  }
}
