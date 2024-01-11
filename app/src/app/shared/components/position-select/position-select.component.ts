import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPosition } from '../../../interface';
import { PositionsService } from '../../../services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-position-select',
  templateUrl: './position-select.component.html',
  styleUrls: ['./position-select.component.scss'],
})
export class PositionSelectComponent implements OnInit {
  @Input() positionId: string = '';

  @Output() selectionChange = new EventEmitter<IPosition>();
  @Output() selectionCancel = new EventEmitter<void>();

  positions: IPosition[] = [];
  toastMessage: string = '';
  newPositionName: string = '';

  isCreating: Boolean = false;

  constructor(
    private positionsService: PositionsService,
    private translate: TranslateService
    ) {}

  ngOnInit() {
    this.getPositions();
  }

  getPositions() {
    this.positionsService.getPositions().subscribe((res: any) => {
      this.positions = res.data.filter(
        (item: IPosition) => item.name
      );
    });
  }

  createPosition(params: any) {
    this.isCreating = true;
    this.positionsService.addPosition(params).subscribe(
      (res: any) => {
        this.getPositions();
        this.newPositionName = '';
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

  changeNewPosition(event: any) {
    this.newPositionName = event.detail.value;
  }

  closeToast() {
    this.toastMessage = '';
  }

  addItem() {
    const params = {
      name: this.newPositionName,
    };
    this.createPosition(params);
  }

  trackItems(index: number, item: IPosition) {
    return item.id;
  }

  ionChange(ev: any) {
    const { checked, value } = ev.detail;
    this.positionId = value;
  }

  confirmChanges() {
    const position =
      this.positions.find((position) => position.id === this.positionId) ||
      ({} as IPosition);
    this.selectionChange.emit(position);
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  isChecked(positionId: any) {
    return this.positionId === positionId;
  }
}
