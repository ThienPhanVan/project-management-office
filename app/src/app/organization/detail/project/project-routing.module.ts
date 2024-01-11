import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectPage } from './project.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectPage,
  },
  {
    path: ':projectId',
    loadChildren: () =>
      import('./project-detail/project-detail.module').then(
        (m) => m.ProjectDetailPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
