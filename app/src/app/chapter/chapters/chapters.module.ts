import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChaptersPageRoutingModule } from './chapters-routing.module';

import { ChaptersPage } from './chapters.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [ChaptersPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ChaptersPageRoutingModule,
        SharedModule
    ]
})
export class ChaptersPageModule {}
