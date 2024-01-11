import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services';
import { MasterDataService, ResourceAcessDataService } from '../shared/services';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {

  languageDefault: string = 'vi';
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private masterDataService: MasterDataService,
    private resourceAcessDataService: ResourceAcessDataService,
    private route: Router) {   this.getMe();
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
          this.route.navigate(['/auth/login']);
        }
      );
    }
  
    getResouceAccess() {
      this.authService.resourceAccess().subscribe(
        (res: any) => {
          this.resourceAcessDataService.setResourceAcess(res);
        },
        () => {
          this.route.navigate(['auth/login']);
        }
      );
    }
  }
  