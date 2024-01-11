import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedModule } from '../../shared/shared.module';
import {UpgradeAccountComponent} from './upgrade-account/upgrade-account.component';
import { ProfileOrganizationListComponent } from './organization-list/organization-list.component';
import { ShortcutComponent } from './shortcut/shortcut.component';

@NgModule({
    declarations: [ProfilePage, UpgradeAccountComponent, ProfileOrganizationListComponent, ShortcutComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfilePageRoutingModule,
        SharedModule
    ]
})
export class ProfilePageModule {}
