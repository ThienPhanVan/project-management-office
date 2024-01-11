import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'security',
        loadChildren: () =>
          import('./security/security.module').then(
            (m) => m.SecurityPageModule
          ),
      },
      {
        path: 'edit',
        loadChildren: () =>
          import('./edit/edit-profile.module').then(
            (m) => m.EditProfilePageModule
          ),
      },
      {
        path: 'change-phone',
        loadChildren: () =>
          import('./change-phone/change-phone.module').then(
            (m) => m.ChangePhonePageModule
          ),
      },
      {
        path: 'history',
        loadChildren: () =>
          import('./history-login/history-login.module').then(
            (m) => m.HistoryLoginPageModule
          ),
      },
      {
        path: 'activity',
        loadChildren: () =>
          import('./activity/activity-user.module').then(
            (m) => m.ActivityUserPageModule
          ),
      },
      {
        path: 'change-password',
        loadChildren: () =>
          import('./change-password/change-password.module').then(
            (m) => m.ChangePasswordPageModule
          ),
      },
      {
        path: 'news',
        loadChildren: () =>
          import('./news/news.module').then((m) => m.NewsPageModule),
      },
      {
        path: 'commerce',
        loadChildren: () =>
          import('./commerce/commerce.module').then(
            (m) => m.CommercePageModule
          ),
      },
      {
        path: 'commerce',
        loadChildren: () =>
          import('../commerce/commerce.module').then(
            (m) => m.CommercePageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/profile',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
