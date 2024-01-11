import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChapterPageRoutingModule } from './chapter-routing.module';

import { ChapterPage } from './chapter.page';

@NgModule({
  declarations: [ChapterPage],
  imports: [CommonModule, FormsModule, IonicModule, ChapterPageRoutingModule],
})
export class ChapterPageModule {}
