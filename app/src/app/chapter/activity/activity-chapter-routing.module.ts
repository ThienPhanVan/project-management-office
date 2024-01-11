import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityChapterPage } from './activity-chapter.page';


const routes: Routes = [
  {
    path: '',
    component: ActivityChapterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityChapterPageRoutingModule {}
