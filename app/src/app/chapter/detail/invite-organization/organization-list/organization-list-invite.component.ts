import { Component, Input } from '@angular/core';
import { IIAMGroup } from '../../../../interface';
import * as _ from 'lodash';
import { ChapterDataService } from '../../../../shared/services';
import { ChapterService } from '../../../../services/chapter.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-organization-list-chapter-invite',
  templateUrl: './organization-list-invite.component.html',
  styleUrls: ['./organization-list-invite.component.scss'],
})
export class OrganizationListChapterInviteComponent {
  @Input() data: any = [];

  iamGroups: IIAMGroup[] = [];
  selectedUserIds: string[] = [];
  chapterOrganizations: any[] = [];

  classNameThumbnail: string = "list";

  toastMessage: string = '';
  isLogo: boolean = true;
  
  constructor(
    private chapterDataService: ChapterDataService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private chapterService: ChapterService
  ) {
    this.getIAMGroups();
    this.getChapterDetail();
  }

  getIAMGroups() {
    this.chapterDataService.iamGroups$.subscribe((iamGroups) => {
      this.iamGroups = iamGroups;
    });
  }

  getChapterDetail() {
    this.chapterDataService.chapterDetail$.subscribe((chapter) => {
      this.chapterOrganizations = chapter.organizations;
    });
  }

  isChapterOrganization(organization: any){
    return _.includes(_.map(this.chapterOrganizations, 'id'), organization.id)
  }

  actionInvite(org: any) {
    const data = {
      organization_ids: [org.id],
    };

    org.isInvited = true;

    this.sendInvite(data);
  }

  sendInvite(data: any) {
    this.chapterService
      .inviteOrganizationChapter(this.route.snapshot.params['id'], data)
      .subscribe(
        (res) => {
          this.toastMessage = this.translate.instant(
            'NOTIFICATION.CONTENT.ADD_SUCCESS'
          );
          this.refreshChapter();
        },
        () => {
          this.toastMessage = this.translate.instant(
            'NOTIFICATION.CONTENT.ADD_FAILURE'
          );
        }
      );
  }

  refreshChapter() {
    this.chapterService
      .getChapter(this.route.snapshot.params['id'])
      .subscribe((res) => {
        this.chapterDataService.setChapterDetail({
          ...res,
          updated_date: this.convertDate(res.updated_date),
        });
      });
  }

  convertDate(value: string) {
    var d = new Date(value),
      dformat =
        [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') +
        ' ' +
        [d.getHours(), d.getMinutes()].join(':');
    return dformat;
  }

  closeToast() {
    this.toastMessage = '';
  }
  
  showModal: boolean = false;
  imagesString: string = ""
  getSrcImage(thumbnail: string) {
    this.showModal = true
    this.imagesString = thumbnail
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = ''
  }
}
