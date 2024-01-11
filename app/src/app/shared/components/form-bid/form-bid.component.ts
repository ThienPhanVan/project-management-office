import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Editor, Toolbar, toHTML } from 'ngx-editor';
import { AlertDialog } from 'src/app/interface';

@Component({
  selector: 'app-form-bid',
  templateUrl: './form-bid.component.html',
  styleUrls: ['./form-bid.component.scss'],
})
export class FormBidComponent implements OnInit {
  @Input() newsDetail: any;
  @Output() closeBid = new EventEmitter();
  @Output() getValues = new EventEmitter();
  @Output() deleteBid = new EventEmitter();

  titlePage: string = '';
  user: any;
  form: FormGroup;
  editor: Editor;
  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike', 'blockquote'],
    // ['code', 'blockquote'],
    // ['ordered_list', 'bullet_list'],
    // ['link'],
    // ['text_color', 'background_color'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
    // ['horizontal_rule', 'format_clear'],
  ];
  classNameThumbnail: string = 'list';
  // isLogo: boolean = true;
  showModal: boolean = false;
  imagesString: string = '';
  isActionSheetOpen: boolean = false;
  isUpdate: boolean = false;
  isValidPrice: boolean = true;
  isValidContent: boolean = false;
  minimumPrice: any;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private alertController: AlertController
  ) {
    this.editor = new Editor({
      keyboardShortcuts: true,
    });
    this.form = this.formBuilder.group({
      description: ['', [Validators.required]],
      price: [0],
    });
  }

  public actionSheetButtons = [
    {
      text: this.translate.instant('BUTTON.UPDATE'),
      role: 'edit',
      data: {
        action: 'edit',
      },
    },
    {
      text: this.translate.instant('BUTTON.DELETE'),
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  ngOnInit(): void {
    this.titlePage =
      this.isUpdate && this.newsDetail
        ? this.translate.instant('TAB.HOME.UPDATE')
        : !this.isUpdate && !this.newsDetail
        ? this.translate.instant('TAB.HOME.BIDDING')
        : this.translate.instant('TAB.HOME.DETAIL_TAB_VIEW');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
    if (this.newsDetail) {
      this.isValidPrice = false;
      this.form.patchValue({
        description: this.newsDetail?.description,
        price: this.newsDetail?.price,
      });
    }
  }

  onPrice(price: any) {
    if (price === -1) {
      this.isValidPrice = true;
      // console.log('false');
    } else {
      this.isValidPrice = false;
      this.minimumPrice = price;
      this.form.patchValue({
        price: price,
      });
    }
  }

  editorChange(ev: any) {
    if (ev === '<p></p>') {
      this.isValidContent = true;
    } else {
      this.isValidContent = false;
    }
  }

  onCloseModal(value: boolean) {
    this.closeBid.emit(value);
  }

  getSrcImage(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }

  get isNotCanSave() {
    if (
      (this.form.invalid && this.isValidContent) ||
      this.form.invalid ||
      this.isValidContent
    )
      return true;
    else return false;
  }

  submit() {
    // console.log(this.form.value);
    const values = {
      data: this.form.value,
      type: this.isUpdate ? 'update' : 'create',
    };
    this.getValues.emit(values);
  }

  setOpenActionSheet(value: boolean) {
    this.isActionSheetOpen = value;
  }

  //action detail news
  setResult(ev: any) {
    if (ev?.detail?.data?.action === 'edit') {
      this.isUpdate = true;
      this.setOpenActionSheet(false);
    } else if (ev?.detail?.data?.action === 'delete') {
      let alertDialog = {
        header: this.translate.instant('NOTIFICATION.HEADER'),
        message: this.translate.instant('NOTIFICATION.QUESTION.DELETE'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              let alertDialog = {
                header: this.translate.instant('NOTIFICATION.HEADER'),
                message: this.translate.instant(
                  'NOTIFICATION.CONTENT.DELETE_SUCCESS'
                ),
                buttons: [
                  {
                    text: this.translate.instant('BUTTON.OK'),
                    role: 'confirm',
                    handler: () => {
                      this.deleteBid.emit(true);
                    },
                  },
                ],
              };
              this.presentAlert(alertDialog);
            },
          },
          {
            text: this.translate.instant('BUTTON.CANCEL'),
            role: 'cancel',
            handler: () => {},
          },
        ],
      };

      this.presentAlert(alertDialog);
    } else {
      this.setOpenActionSheet(false);
      this.isUpdate = false;
    }
  }

  //alert
  async presentAlert(alertDialog: AlertDialog) {
    const alert = await this.alertController.create({
      header: alertDialog.header,
      subHeader: alertDialog.subHeader,
      message: alertDialog.message,
      buttons: alertDialog.buttons,
    });

    await alert.present();
  }
}
