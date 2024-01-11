import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-information',
  templateUrl: './app-information.page.html',
  styleUrls: ['./app-information.page.scss'],
})
export class AppInformationPage implements OnInit {
  appVersion: string;
  appOrganizations = [
    {
      name: 'TST ECO JSC',
      phone: '0964 120 079',
      thumbnail: 'https://tstmart.com/assets/images/logo/tsteco-text.png',
    },
  ];

  constructor() {
    const appInfo = require('../../../package.json');
    this.appVersion = appInfo.version;
  }

  showModal: boolean = false;
  imagesString: string = ""
  getImageSrc(thumbnail: string) {
    this.showModal = true
    this.imagesString = thumbnail
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = ''
  }

  ngOnInit() {}
}
