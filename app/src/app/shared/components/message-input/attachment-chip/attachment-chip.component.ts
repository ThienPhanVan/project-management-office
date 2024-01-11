import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAttachment } from '../../../../interface';

@Component({
  selector: 'app-attachment-chip',
  templateUrl: './attachment-chip.component.html',
  styleUrls: ['./attachment-chip.component.scss'],
})
export class AttachmentChipComponent  implements OnInit {
  @Input() attachments: IAttachment[] = []
  @Output() attachmentRemoved: EventEmitter<IAttachment> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  attachmentRemove(item: any){
    this.attachmentRemoved.emit(item);
  }

}
