import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ChecklistService } from 'src/app/services/checklist.service';

@Component({
  selector: 'pmo-checklist-create',
  templateUrl: './checklist-create.component.html',
  styleUrls: ['./checklist-create.component.scss'],
})
export class ChecklistCreateComponent implements OnInit {
  name: string = '';
  @Input() issueId: string = '';

  @Output() onCreated: EventEmitter<any> = new EventEmitter();
  constructor(private checklistService: ChecklistService) {}

  ngOnInit() {}

  create() {
    this.checklistService
      .addChecklist({
        name: this.name,
        issue_id: this.issueId,
      })
      .subscribe((res) => {
        this.onCreated.emit(res);
        this.name = '';
      });
  }
}
