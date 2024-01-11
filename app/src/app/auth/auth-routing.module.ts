import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthPage,
    children: [
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadChildren: () =>
          import('../page/login/login.module').then((m) => m.LoginPageModule),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('../page/register/register.module').then(
            (m) => m.RegisterPageModule
          ),
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('../page/forgot-password/forgot-password.module').then(
            (m) => m.ForgotPasswordPageModule
          ),
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('../page/reset-password/reset-password.module').then(
            (m) => m.ResetPasswordPageModule
          ),
      },
      {
        path: 'verify-register',
        loadChildren: () =>
          import('../page/verify-register/verify-register.module').then(
            (m) => m.VerifyRegisterPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
