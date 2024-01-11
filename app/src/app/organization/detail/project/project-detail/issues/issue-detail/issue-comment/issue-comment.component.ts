import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { CommentService, UserService } from 'src/app/services';
import { UserDetail } from '../../../../../../../interface/user.interface';
import { MasterDataService } from '../../../../../../../shared/services';

@Component({
  selector: 'app-issue-comment',
  templateUrl: './issue-comment.component.html',
  styleUrls: ['./issue-comment.component.scss'],
})
export class IssueCommentComponent implements OnInit {
  @Input() id = '';

  organizationId: string = '';
  organizationUsers: UserDetail[] = [];
  comments = [{}, {}];
  text: any = '';

  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private route: ActivatedRoute,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit() {
    this.getComments();
    this.getOrganizationId();
    this.getOrganizationUsers();
  }

  getOrganizationId() {
    this.organizationId =
      this.route.snapshot.paramMap.get('organizationId')?.toString() || '';
  }

  getComments() {
    if (this.id) {
      this.commentService.getComments(this.id).subscribe((res) => {
        this.comments = res.data;
      });
    }
  }

  createComment() {
    const comment = {
      name: this.id,
      resource_id: this.id,
      description: this.text,
    };

    this.commentService.addComment(comment).subscribe((res) => {
      this.text = '';

      this.getComments();
    });
  }

  getOrganizationUsers() {
    this.userService.getUsers({organization_id: this.organizationId}).subscribe((res) => {
      this.organizationUsers = res.data;
    });
  }

  getUser(id: string){
    if(this.organizationUsers && this.organizationUsers.length){
      return _.find(this.organizationUsers, (user) => user.id === id);
    }
    return {} as UserDetail
  }

  getMyDetail() {
    return this.masterDataService.meBus$.value || '';
  }
}
