import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAttachment, IImageGrid } from '../../../../interface';
import * as _ from 'lodash';

// The ratio is calculated as the horizontal divided by the vertical, and the standard ratio of a message is 2.4.
// The ratio of a image will be between 0.6 to 1.2 if the message want to show multiple images.
const MIN_RATIO = 0.6;
const MAX_RATIO = 1.2;
const MESSAGE_RATIO = 2.4;
const MAX_IMAGE_IN_ROW = 3;
const MESSAGE_WIDTH = 16.5;
const MAX_HEIGHT_GRID = 6.875;
const MAX_HEIGHT_SINGLE = 18;

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss'],
})
export class ImageGridComponent implements OnInit {
  @Input() images: IAttachment[] = [];
  @Input() imageGrid: IImageGrid[] = [];

  @Output() onImageClicked = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.getImageGrids();
  }

  getImageGrids() {
    if (this.images.length > 0) {
      const rowImages = this.images.slice(
        this.imageGrid.length,
        this.imageGrid.length + MAX_IMAGE_IN_ROW
      );
      this.updateImagesDimention(rowImages);
    }
  }

  updateImagesDimention(images: IAttachment[]) {
    const sumRatio = this.getSumImagesRatio(images);
    const imageGridToken: IImageGrid[] = [];
    let rowHeight = 0;

    if (images.length > 1) {
      if (sumRatio <= MESSAGE_RATIO) {
        // TODO: this will share the space remain for the images in the row by our ratio
        const ratioRemain = MESSAGE_RATIO - sumRatio;

        _.forEach(images, (image) => {
          const recomputedRatio =
            (this.getImageRatio(image) / sumRatio) * ratioRemain +
            this.getImageRatio(image);

          const itemWidth = MESSAGE_WIDTH * (recomputedRatio / MESSAGE_RATIO);

          const imageHeight = itemWidth / this.getImageRatio(image, false);

          if (rowHeight < imageHeight) {
            rowHeight = imageHeight;
          }

          imageGridToken.push({
            image,
            width: itemWidth,
            max_width: itemWidth,
            height: MAX_HEIGHT_GRID,
          });
        });
      } else {
        // TODO: this will remove the item when sum ratio of another items is closest to the message ratio
        this.updateImagesDimention(images.slice(0, images.length - 1));
      }

      _.forEach(imageGridToken, (item) => {
        item.height = this.validateImageHeight(rowHeight, images.length);
        this.imageGrid.push(item);
      });
      this.getImageGrids();


    } else if (images.length === 1) {
      this.imageGrid.push({
        image: images[0],
        height: this.validateImageHeight(
          this.convertPixelToRems(Number(images[0].height)),
          1
        ),
        max_width: MESSAGE_WIDTH,
        width: this.convertPixelToRems(Number(images[0].width)),
      });
    }
  }

  getSumImagesRatio(images: IAttachment[]) {
    return _.map(images, (img) => {
      return this.getImageRatio(img);
    }).reduce((sum, current) => sum + current, 0);
  }

  validateImageHeight(height: number, imageLength: number): number {
    if (imageLength > 1) {
      return height < MAX_HEIGHT_GRID && height ? height : MAX_HEIGHT_GRID;
    } else if (imageLength === 1) {
      return height < MAX_HEIGHT_SINGLE && height ? height : MAX_HEIGHT_SINGLE;
    } else {
      return 0;
    }
  }

  getImageRatio(image: IAttachment, validate = true) {
    if (image.height && image.width) {
      const ratio = image.width / image.height;
      if (validate) {
        if (ratio > MAX_RATIO) return MAX_RATIO;
        else if (ratio < MIN_RATIO) return MIN_RATIO;
        else return ratio;
      } else {
        return ratio;
      }
    }
    return 0;
  }

  convertPixelToRems(px: number) {
    return px / parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  onClick(image: IAttachment){
    this.onImageClicked.emit(image);
  }
}
