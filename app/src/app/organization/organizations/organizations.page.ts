import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  InfiniteScrollCustomEvent,
} from '@ionic/angular';
import { OrganizationsService } from '../../services/organization.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateFollowParams } from 'src/app/interface';
import { AuthService, FollowService } from 'src/app/services';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.page.html',
  styleUrls: ['./organizations.page.scss'],
})
export class OrganizationsPage implements OnInit {
  organizations: any[] = [];

  limit = 10;
  offset = 0;
  count = 0;
  isLoading: boolean = true;
  searchValue: any = '';
  isFollow: boolean = false;
  resourceAccess: any;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private organizationsService: OrganizationsService,
    private location: Location,
    private followService: FollowService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.router.queryParams.subscribe((params: any) => {
      this.searchValue =
        params['q']?.replaceAll('%', '') ||
        (params['tag']?.replaceAll('%', '')
          ? `#${params['tag']?.replaceAll('%', '')}`
          : '');
      let query: any = {
        offset: 0,
        limit: 10,
        q: this.searchValue.replaceAll('%', '')
          ? `%${this.searchValue.replaceAll('%', '')}%`
          : '',
      };

      this.getInitOrganizationsData(query);
    });
    // this.getResourceAccess();
  }

  getInitOrganizationsData(query: any) {
    this.organizationsService.getOrganizations(query).subscribe((res: any) => {
      if (res && res.data) {
        this.organizations = res.data;

        this.limit = +res.paging.limit;
        this.offset = +res.paging.limit;
        this.count = +res.paging.count;

        this.isLoading = false;
      }
    });
  }

  loadOrganizationsData(ev: any) {
    if (this.offset < this.count) {
      this.organizationsService
        .getOrganizations({ limit: this.limit, offset: this.offset })
        .subscribe((res: any) => {
          if (res && res.data) {
            this.offset += +res.paging.limit;
            this.count = +res.paging.count;
            this.organizations = this.organizations.concat(res.data);
          }
          setTimeout(() => {
            (ev as InfiniteScrollCustomEvent).target.complete();
          }, 500);
        });
    } else {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }
  }

  goBack() {
    this.location.back();
  }

  onIonInfinite(ev: any) {
    this.loadOrganizationsData(ev);
  }

  // search
  showSearchOrganizationModel() {
    this.route.navigate(['/', 'tabs', 'organizations', 'search']);
  }

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Share',
          data: {
            action: 'share',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }

  showModal: boolean = false;
  imagesString: string = '';
  getImageSrc(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }

  followOrganization(id: string) {
    let params: CreateFollowParams = {
      resource_id: id,
      resource_type: 'organization',
    };
    this.followService.addFollow(params).subscribe((res) => {
      this.organizations.forEach((org: any) => {
        if (org.id === id) {
          org.has_followed = !org.has_followed;
        }
      });
    });
  }
}
