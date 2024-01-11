import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

import * as dataFL from '../../../../assets/emoji/feelings.json';
import * as feelings from 'src/assets/emoji/feelings.json';
import { TranslateService } from '@ngx-translate/core';
import { removeVietnameseTones } from 'src/app/constant';

@Component({
  selector: 'app-feeling-create-new',
  templateUrl: './feeling-create-new.component.html',
  styleUrls: ['./feeling-create-new.component.scss'],
})
export class FeelingCreateNewComponent implements OnInit {
  @Input() title: string = '';

  @Output() feelingChoose = new EventEmitter();

  isModalOpen = false;
  feelings: any = (dataFL as any).default;
  feeling: any;
  selectedValue: any;

  constructor(private translate: TranslateService) {}

  ngOnInit() {}

  //open modal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  //choose id
  ionChange(item: any, selected: boolean) {
    this.feeling = item;
    this.feelings.forEach((el: any) => {
      if (el.id === item.id) el.isSelected = selected;
    });
  }

  //choose Id and close modal
  confirmChanges() {
    this.feelingChoose.emit(this.feeling);
    this.isModalOpen = false;
  }

  //close modal
  cancelChanges() {
    this.feeling = {};
    this.feelings = (dataFL as any).default;
    this.isModalOpen = false;
  }

  //remove feeling
  removeMention() {
    this.feeling = {};
  }

  searchFeelings(event: any) {
    const keyword = removeVietnameseTones(event.target.value.toLowerCase());
    if (keyword.trim() === '') {
      this.feelings = (dataFL as any).default;
    } else {
      this.feelings = (dataFL as any).default.filter((item: any) =>
        removeVietnameseTones(
          this.translate.instant(item.name).toLowerCase()
        ).includes(keyword)
      );
    }
  }
}
