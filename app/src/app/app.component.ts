import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services';
import { MasterDataService, ResourceAcessDataService } from './shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  languageDefault: string = 'vi';

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private masterDataService: MasterDataService,
    private resourceAcessDataService: ResourceAcessDataService,
    private route: Router
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    // translate.setDefaultLang('vi');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    // translate.use(localStorage.getItem('language') ? JSON.parse(JSON.stringify(localStorage.getItem('language'))): 'vi');
    this.getMe();
    this.getResouceAccess();
  }

  getMe() {
    this.authService.me().subscribe(
      (res: any) => {
        this.masterDataService.setMe(res);
        if (res.language) this.languageDefault = res.language;
        else this.languageDefault = 'vi';
        this.translate.setDefaultLang(this.languageDefault);
      },
      () => {
        //this.route.navigate(['/login']);
      }
    );
  }

  getResouceAccess() {
    this.authService.resourceAccess().subscribe(
      (res: any) => {
        this.resourceAcessDataService.setResourceAcess(res);
      },
      () => {
        //this.route.navigate(['/login']);
      }
    );
  }
}
