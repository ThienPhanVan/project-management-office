import { Component, OnDestroy, OnInit } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ProjectWikiService } from '../../../../../../services/project-wiki.service';
import { ProjectWikiDataService } from '../../../../../../shared/services/project-wiki-data.service';

@Component({
  selector: 'app-wiki-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class WikiCreatePage implements OnInit, OnDestroy {
  editor: Editor;
  form: FormGroup;
  projectId: string;

  wikis: any = [];

  isCreating: boolean = false;
  isAutoSave: boolean = true;

  toastMessage: string = '';
  descriptionInterval: any

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
    private projectWikiDataService: ProjectWikiDataService
  ) {
    this.form = this.initFormGroup();
    this.projectId = this.getProjectId();

    this.editor = new Editor({
      keyboardShortcuts: true,
    });

    this.descriptionSubscribe();
    this.startInterval()
  }

  ngOnInit(): void {
    this.getAllWikis();
    this.allWikisSubscribe();
    this.paramsSubscribe();
  }

  actionSubmit() {
    let wiki = this.removeUnvaluableFields(this.form.value);
    if (!wiki.parent_id) {
      wiki = { ...wiki, project_id: this.projectId };
    }
    this.create(wiki);
  }

  initFormGroup() {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      parent_id: [null],
    });
  }

  create(wiki: any) {
    this.projectWikiService.addWiki(wiki).subscribe(
      () => {
        this.isCreating = false;
        this.toastMessage = 'Create successfully';
        this.getWikis();
        this.setDescription('');
        this.goBack();
      },
      () => {
        this.isCreating = false;
        this.toastMessage = 'There was an error creating';
      }
    );
  }

  removeUnvaluableFields(form: any) {
    let fields: any = {};
    _.forEach(_.keys(form), (key) => {
      if (form[key] || form[key] === '') {
        fields[key] = form[key];
      }
    });
    return fields;
  }

  autoSaveChange(event: any){
    const checked = event.detail.checked
    if(checked){
      this.startInterval()
    }
    else{
      clearInterval(this.descriptionInterval);
    }
  }

  startInterval(){
    if(!this.descriptionInterval)
    {
      this.descriptionInterval = setInterval(()=>this.setDescription(this.form.value.description), 1000);
    }
  }

  setDescription(description: string) {
    this.projectWikiDataService.setMyDraftWikiDescription(description);
  }

  descriptionSubscribe() {
    this.projectWikiDataService.myDraftWikiDescription$.subscribe((res) => {
      if (this.isAutoSave) {
        this.form.patchValue({ description: res });
      }
    });
  }

  getAllWikis() {
    this.projectWikiService
      .getWikis(this.projectId, { include: 'children', limit: 0 })
      .subscribe((res: any) => {
        const wikis = _.concat(
          res.data,
          _.flatten(_.map(res.data, 'children'))
        );
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

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  allWikisSubscribe() {
    this.projectWikiDataService.allWikis$.subscribe((res) => {
      this.wikis = res;
    });
  }

  paramsSubscribe() {
    this.route.queryParams.subscribe((params) => {
      this.form.patchValue(params);
    });
  }

  parentChange(parentId: string | null) {
    this.form.patchValue({ parent_id: parentId });
  }

  closeToast() {
    this.toastMessage = '';
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
    clearInterval(this.descriptionInterval);
  }

  goBack() {
    this.location.back();
  }
}
