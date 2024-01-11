import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },
      // {
      //   path: 'users',
      //   loadChildren: () =>
      //     import('../user/user.module').then((m) => m.UserPageModule),
      // },
      {
        path: '',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      // {
      //   path: 'community',
      //   loadChildren: () =>
      //     import('../community/community.module').then(
      //       (m) => m.CommunityPageModule
      //     ),
      // },
      // {
      //   path: 'organizations',
      //   loadChildren: () =>
      //     import('../organization/organization.module').then(
      //       (m) => m.OrganizationPageModule
      //     ),
      // },
      {
        path: 'my-issues',
        loadChildren: () =>
          import(
            '../organization/detail/project/project-detail/issues/issues.module'
          ).then((m) => m.IssuesPageModule),
      },
      // {
      //   path: 'timeline',
      //   loadChildren: () =>
      //     import('../timeline/timeline.module').then(
      //       (m) => m.TimelinePageModule
      //     ),
      // },
      {
        path: 'projects',
        loadChildren: () =>
          import('../organization/detail/project/project.module').then(
            (m) => m.ProjectModule
          ),
      },
      // {
      //   path: 'chapters',
      //   loadChildren: () =>
      //     import('../chapter/chapter.module').then((m) => m.ChapterPageModule),
      // },
      {
        path: 'notification',
        loadChildren: () =>
          import('../notification/notification.module').then(
            (m) => m.NotificationPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
