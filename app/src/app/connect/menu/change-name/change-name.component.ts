import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.scss'],
})
export class ChangeNameComponent implements OnInit {
  @ViewChild('modal') modal!: IonModal;
  @Input() name: string = '';
  @Input() groupId: string = '';
  @Output() nameChanged = new EventEmitter<string>(); 

  constructor(private groupService: GroupService) {}

  ngOnInit() {}

  actionSubmit() {
    this.changeNameGroup(this.groupId, this.name);
    this.nameChanged.emit(this.name);
    this.modal.dismiss();
  }

  actionDismiss() {
    this.modal.dismiss();
  }

  changeNameGroup(id: string, newName: string) {
    this.groupService.changeGroupName(id, newName).subscribe()
  }
}
