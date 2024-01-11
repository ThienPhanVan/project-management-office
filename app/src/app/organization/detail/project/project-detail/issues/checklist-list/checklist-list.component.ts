import { Component, Input, OnInit } from '@angular/core';
import { ChecklistService } from 'src/app/services/checklist.service';

@Component({
  selector: 'pmo-checklist-list',
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.scss'],
})
export class ChecklistListComponent implements OnInit {
  @Input() issueId = '';

  checklists: any[] = [];
  constructor(private checklistService: ChecklistService) {}

  ngOnInit() {
    this.getChecklists();
  }

  getChecklists() {
    if (this.issueId) {
      this.checklistService
        .getChecklists({ issue_id: this.issueId })
        .subscribe((res: any) => {
          this.checklists = res.data;
        });
    }
  }

  remove(item: any) {
    this.checklistService.deleteChecklist(item.id).subscribe((res: any) => {
      this.getChecklists();
    });
  }

  update(item: any) {
    item.status = !item.status;
    item.issue_id = this.issueId;
    item.description = '';
    this.checklistService
      .updateChecklist(item, item.id)
      .subscribe((res: any) => {
        this.getChecklists();
      });
  }

  save(item: any) {
    item.issue_id = this.issueId;
    item.description = '';
    this.checklistService
      .updateChecklist(item, item.id)
      .subscribe((res: any) => {
        this.getChecklists();
      });
  }

  onCreated() {
    this.getChecklists();
  }
}
