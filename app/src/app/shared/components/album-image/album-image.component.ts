import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-album-image',
  templateUrl: './album-image.component.html',
  styleUrls: ['./album-image.component.scss'],
})
export class AlbumImageComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() images: any[] = [
    {
      src: 'https://fastly.picsum.photos/id/22/4434/3729.jpg?hmac=fjZdkSMZJNFgsoDh8Qo5zdA_nSGUAWvKLyyqmEt2xs0',
    },
    {
      src: 'https://fastly.picsum.photos/id/173/1200/737.jpg?hmac=ujJhJBX1oswhCjRKDEeHR3kHWi-wfK6Q6UhhHuJo9hY',
    },
    {
      src: 'https://fastly.picsum.photos/id/38/1280/960.jpg?hmac=HBrgyJHQOGVicaWoXgvdSfTakkAyv4BxAt4rF0DhWkU',
    },
    {
      src: 'https://fastly.picsum.photos/id/49/1280/792.jpg?hmac=NnUJy0O9-pXHLmY2loqVs2pJmgw9xzuixgYOk4ALCXU',
    },
    {
      src: 'https://fastly.picsum.photos/id/154/3264/2176.jpg?hmac=a4Q6dBKGy7G27ic7K1sEPr-KzMigvl-MQsZUEX9iFxM',
    },
    {
      src: 'https://fastly.picsum.photos/id/22/4434/3729.jpg?hmac=fjZdkSMZJNFgsoDh8Qo5zdA_nSGUAWvKLyyqmEt2xs0',
    },
  ];
  @Input() isUploadSuccess: boolean = false;

  @Output() addImage = new EventEmitter();
  @Output() removeImage = new EventEmitter();
  @Output() closeModal = new EventEmitter();

  dataImages: any[] = [];
  isPreview: boolean = false;
  indexPreview: number = 0;
  segment: number = 0;
  constructor() {}
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dataImages = this.images;
    console.log(12321, this.dataImages, this.images);

    if (this.isUploadSuccess) {
      this.segment = 0;
    }
  }

  changeSegment(event: any) {
    this.segment = Number(event.detail.value);
  }

  //upload image
  handleUpload(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }
    this.addImage.emit(event);
  }

  //remove image with id
  handleRemoveImage(id: string) {
    this.removeImage.emit(id);
  }

  //close modal
  hideModal() {
    this.isPreview = false;
    this.dataImages = this.images;
  }

  //zoom slide image
  zoomArrayImage(index: number) {
    this.isPreview = true;
    this.indexPreview = index;
    this.dataImages = this.images;
  }

  //zoom one image
  zoomImage(index: number) {
    this.isPreview = true;
    this.indexPreview = 0;
    this.dataImages = [this.images[index]];
    console.log(this.dataImages);
  }

  //prev next slide image
  actionImage(index: number) {
    let newClick = this.indexPreview;
    newClick += index;

    if (newClick <= 0) newClick = 0;
    else if (newClick >= this.dataImages.length - 1)
      newClick = this.dataImages.length - 1;

    return (this.indexPreview = newClick);
  }

  onCloseModal(value: boolean) {
    console.log(99, value);

    this.closeModal.emit(value);
  }
}
