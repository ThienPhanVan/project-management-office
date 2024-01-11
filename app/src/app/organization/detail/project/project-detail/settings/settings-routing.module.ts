import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'milestones',
    loadChildren: () => import('./milestones/milestones.module').then( m => m.MilestonesPageModule)
  },
  {
    path: 'types',
    loadChildren: () => import('./types/types.module').then( m => m.TypesPageModule)
  },
  {
    path: 'versions',
    loadChildren: () => import('./versions/versions.module').then( m => m.VersionsPageModule)
  },
  {
    path: 'status',
    loadChildren: () => import('./statuses/status.module').then( m => m.StatusPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
