import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IAttachment } from '../../../../interface';
import { URL_PATTERN } from '../../../../constant';

@Component({
  selector: 'app-attachment-select',
  templateUrl: './attachment-select.component.html',
  styleUrls: ['./attachment-select.component.scss'],
})
export class AttachmentSelectComponent implements OnInit {
  @Output() attachmentSelected: EventEmitter<IAttachment> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  async attachmentChanged(event: any) {
    if (event.target.files) {
      const attachment = event.target.files[0];
      if (!attachment || attachment.length == 0) {
        return;
      }

      const mimeType = attachment.type;
      const reader = new FileReader();

      if (mimeType.match(/image\/*/)) {
        reader.onload = (rd) => {
          if (rd.target?.result) {
            const img = new Image();
            img.src = String(rd.target.result);
            img.onload = () => {
              this.attachmentSelected.emit({
                type: 'image',
                name: attachment.name,
                content: reader.result,
                width: img.width,
                height: img.height,
                size: this.byteConverter(attachment.size, 2),
              });
            };
          }
        };
      } else if (mimeType.match(/video\/*/)) {
        reader.onload = (rd) => {
          if (rd.target?.result) {
            this.attachmentSelected.emit({
              type: 'video',
              name: attachment.name,
              content: reader.result,
              size: this.byteConverter(attachment.size, 2),
            });
          }
        };
      } else {
        reader.onload = (rd) => {
          if (rd.target?.result) {
            this.attachmentSelected.emit({
              type: 'file',
              name: attachment.name,
              content: reader.result,
              size: this.byteConverter(attachment.size, 2),
            });
          }
        };
      }
      reader.readAsDataURL(attachment);
    }
  }

  byteConverter(bytes: number, decimals: number) {
    const K_UNIT = 1024;
    const SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

    if (bytes == 0) return '0 Byte';

    let i = Math.floor(Math.log(bytes) / Math.log(K_UNIT));
    let resp =
      parseFloat((bytes / Math.pow(K_UNIT, i)).toFixed(decimals)) +
      ' ' +
      SIZES[i];

    return resp;
  }
}
