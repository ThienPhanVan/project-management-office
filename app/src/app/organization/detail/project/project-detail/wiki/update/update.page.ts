import { Component, OnInit } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ProjectWikiService } from '../../../../../../services/project-wiki.service';
import { ProjectWikiDataService } from '../../../../../../shared/services/project-wiki-data.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {
  editor: Editor;
  form: FormGroup;

  wikiId: string;
  projectId: string;

  wikis: any = [];
  wikiName: string = '';

  isUpdating: boolean = false;

  toastMessage: string = '';

  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear'],
  ];

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projectWikiService: ProjectWikiService,
    private projectWikiDataService: ProjectWikiDataService,
  ) {
    this.form = this.initFormGroup();
    this.projectId = this.getProjectId();
    this.wikiId = this.getWikiId();

    this.editor = new Editor({
      keyboardShortcuts: true,
    });
  }

  ngOnInit(): void {
    this.getAllWikis();
    this.allWikisSubscribe();
    this.getWikiDetail();
  }

  actionUpdate() {
    const wiki = { ...this.form.value };
    this.projectWikiService.updateWiki(wiki, this.wikiId).subscribe(
      () => {
        this.isUpdating = false;
        this.toastMessage = 'Update successfully';
        this.getWikiDetail();
        this.getWikis();
        this.goBack();
      },
      () => {
        this.isUpdating = false;
        this.toastMessage = 'There was an error updating';
      }
    );
  }

  actionCreateNewVersion(version: string) {
    const wiki = { ...this.form.value, code: version };
    this.projectWikiService.createWikiVersion(wiki, this.wikiId).subscribe(
      () => {
        this.isUpdating = false;
        this.toastMessage = 'Update successfully';
        this.getWikiDetail();
        this.getWikis();
        this.goBack();
      },
      () => {
        this.isUpdating = false;
        this.toastMessage = 'There was an error updating';
      }
    );    
  }

  initFormGroup() {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      code: [''],
      description: [''],
      parent_id: [null],
      project_id: [null],
    });
  }

  getAllWikis() {
    this.projectWikiService
      .getWikis(this.projectId, { include: 'children' })
      .subscribe((res: any) => {
        const wikis = _.concat(res.data, _.flatten(_.map(res.data, 'children')))
        this.projectWikiDataService.setAllWikis(wikis);
      });
  }

  getWikis() {
    this.projectWikiService
      .getWikis(this.projectId, { include: 'children' })
      .subscribe((res: any) => {
        this.projectWikiDataService.setAllWikis(res.data);
      });
  }

  allWikisSubscribe() {
    this.projectWikiDataService.allWikis$.subscribe((res) => {
      this.wikis = res;
    });
  }

  getWikiDetail() {
    this.projectWikiService
      .getWiki(this.wikiId, { include: 'project,children,version' })
      .subscribe((res) => {
        this.projectWikiDataService.setMyWikiDetail(res);
        this.form.patchValue(res);
        this.wikiName = this.form.value.name;
      });
  }

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  getWikiId() {
    return this.route.snapshot.paramMap.get('wikiId')?.toString() || '';
  }

  parentChange(parentId: string | null) {
    if (!this.form.value.parent_id && parentId) {
      this.form.patchValue({ project_id: null });
    }
    this.form.patchValue({ parent_id: parentId });
    if (!parentId) {
      this.form.patchValue({ project_id: this.projectId });
    }

  }

  closeToast() {
    this.toastMessage = '';
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  goBack() {
    this.location.back();
  }
}
