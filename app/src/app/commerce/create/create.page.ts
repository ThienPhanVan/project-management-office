import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  COVER_URL,
  THUMBNAIL_URL,
  convertProductDetail,
  convertProductsList,
  removeVietnameseTones,
} from '../../constant';
import { Location } from '@angular/common';
import { IdIndexImageEmit } from '../../interface/news.interface';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommerceService, OrganizationsService } from '../../services';
import { CommerceDataService } from '../../shared/services/commerce-data.service';
import { AlertDialog } from '../../interface';
import { AlertController } from '@ionic/angular';
import { query } from '@angular/animations';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreateCommercePage implements OnInit {
  form: FormGroup;
  data: any = {
    listImages: [],
  };

  isLoading: boolean = true;
  productCategories: any[] = [];
  organizations: any[] = [];
  organization: any;
  product_category_id: string = '';

  isUploadImageBg: boolean = false;
  isBackground: boolean = true;
  showModal: boolean = false;
  imagesString: string = '';
  isCreate: boolean = true;
  isEdit: boolean = false;
  isLoadingUpload: boolean = false;
  isPriceTo: boolean = false;
  titlePage: string = '';
  labelEventType: string = this.translate.instant('TAB.COMMERCE.SALE');
  // isCheckType: boolean = false;
  isSubmit: boolean = false;
  query: any;
  typePrice: number = 0;
  isGetPrice: boolean = false;
  isNotImageCover: boolean = true;
  isValidPrice: boolean = false;
  discountDisplay: string = '0';
  categoriesFilter: any[] = [];

  coverImage: any = {
    name: '',
    resource_type: 'products',
    image_url: '',
    description: '',
  };
  queryCategory: any = {
    include: 'user_favorite',
  };

  queryProducts: any = {
    limit: 10,
    offset: 0,
    include: 'author,summary,user,product_category,images',
  };

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private router: ActivatedRoute,
    private translate: TranslateService,
    private commerceService: CommerceService,
    private commerceDataService: CommerceDataService,
    private organizationsService: OrganizationsService,
    private alertController: AlertController
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0],
      percent_discount: [0],
      amount: [0],
      // cover: [COVER_URL, [Validators.required]],
      // type: [0, [Validators.required]],
      // location: [''],
      product_category_id: ['', [Validators.required]],
      organization_id: [''],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;

    if (this.router.snapshot.params['id']) {
      this.titlePage =
        this.translate.instant('TAB.COMMERCE.UPDATE') +
        ' ' +
        this.translate.instant('TAB.COMMERCE.PRODUCTS').toLowerCase();
      this.isEdit = true;
      this.isCreate = false;
      this.commerceService
        .getProductDetail(this.router.snapshot.params['id'])
        .subscribe((res: any) => {
          if (res) {
            const data = convertProductDetail(res);
            this.data = data;
            this.discountDisplay = data.percent_discount;
            this.form.patchValue({
              name: data.name,
              description: data.description,
              price: data.price,
              // cover:
              //   data.images && data.images.length
              //     ? data.images[0].image_url
              //     : COVER_URL,
              // type: data.type,
              // location: data.location,
              percent_discount: data.percent_discount,
              amount: data.amount,
              product_category_id: data.product_category_id,
              organization_id: data.organization_id,
              // chapter_id: data.chapter_id,
            });
            // this.coverImage = data.images[0];
            // this.data.listImages.shift();
            // this.productCategory = data.product_category;

            // if (data.type === 0) {
            //   this.labelEventType = this.translate.instant('TAB.COMMERCE.BUY');
            //   this.isCheckType = true;
            // } else {
            //   this.labelEventType = this.translate.instant('TAB.COMMERCE.SALE');
            //   this.isCheckType = false;
            // }
            if (data.price > 0) {
              this.typePrice = 1;
              this.isGetPrice = true;
            } else {
              this.typePrice = data.price;
              this.isGetPrice = false;
            }
            // this.productCategoriesService
            //   .getCategory(data.product_category_id)
            //   .subscribe((res: any) => {
            //     this.productCategory = res;
            //   });

            this.isNotImageCover = false;
          }
        });
      this.isLoading = false;
    } else {
      this.titlePage =
        this.translate.instant('TAB.COMMERCE.CREATE') +
        ' ' +
        this.translate.instant('TAB.COMMERCE.PRODUCTS').toLowerCase();
      this.isEdit = false;
      this.isCreate = true;
      // if (this.form.value.type === 0) {
      //   this.labelEventType = this.translate.instant('TAB.COMMERCE.BUY');
      //   this.isCheckType = true;
      // } else {
      //   this.labelEventType = this.translate.instant('TAB.COMMERCE.SALE');
      //   this.isCheckType = false;
      // }
      this.typePrice = 0;
      this.isGetPrice = false;
      this.isLoading = false;
    }
    const queryStr = localStorage.getItem('searchQueryProducts');
    if (queryStr) {
      this.query = JSON.parse(queryStr);
    }

    const userStr = localStorage.getItem('user');
    let user;
    if (userStr) {
      user = JSON.parse(userStr);
    }

    if (this.query?.organization_id) {
      const orgQuery = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,iam_groups,chapters,childen_organization_users,children_organization_users_position,children_organization_users_iam_group,summary',
      };
      this.organizationsService
        .getOrganization(this.query?.organization_id, orgQuery)
        .subscribe((res) => {
          this.organization = res;
        });
    }

    this.getProductCategories();
    this.getOrgs(user);
    // this.getChapters(user);
  }

  getProduct() {
    this.isLoading = true;
    this.commerceService
      .getProductDetail(this.router.snapshot.params['id'])
      .subscribe((res: any) => {
        if (res) {
          // const data = convertProductDetail(res);
          this.commerceDataService.setProductDetail(res);
        }
      });
    this.isLoading = false;
  }
  isLoadingProductCategories = false;
  dataElCategory: any = [];
  //get categories
  getProductCategories() {
    this.isLoadingProductCategories = true;
    this.commerceService
      .getProductCategories(this.queryCategory)
      .subscribe((res: any) => {
        if (res) {
          const sortedArr = _.sortBy(res, (item) => {
            if (item.name === 'Khác') {
              return 1;
            }
            return 0;
          });

          this.categoriesFilter = sortedArr;
          this.dataElCategory = sortedArr;
          this.commerceDataService.setCategories(this.categoriesFilter);
          const data: any = [];
          let count = 0;
          res.forEach((el: any) => {
            if (el.has_user_favorite) {
              data.push(el);
              count++;
            }
          });
          if (count === 0) {
            this.productCategories = [
              {
                id: 'all',
                name: 'All',
              },
              ...res,
            ];
          } else {
            this.productCategories = [
              {
                id: 'all',
                name: 'All',
              },
              ...data,
            ];
          }
        }

        this.queryProducts = {
          ...this.queryProducts,
          product_category_id: _.filter(
            _.map(this.productCategories, 'id'),
            (id) => id !== 'all'
          ).join(','),
        };
        this.getProducts(this.queryProducts);

        this.isLoadingProductCategories = false;
      });
  }

  getOrgs(user: any) {
    const query = {
      offset: 0,
      user_id: user.id,
    };
    this.organizationsService.getOrganizations(query).subscribe((res: any) => {
      if (res && res.data) {
        this.organizations = res.data;
      }
    });
  }

  async setCoverImage(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }

    var mimeType = event.target.files[0].type;
    if (
      mimeType.match(/image\/*/) !== null ||
      mimeType.match(/video\/*/) !== null
    ) {
      this.isNotImageCover = false;
      await this.commerceService
        .onFileSelected(event.target.files[0], new Date().getDate())
        .subscribe((res: any) => {
          if (res.body && res.body.Location) {
            this.form.controls['cover'].patchValue(res.body.Location);
            this.coverImage = {
              name: res.body.Key,
              resource_type: 'products',
              image_url: res.body.Location,
              description: res.body.key,
            };
          }
        });
    }
  }

  goBack() {
    this.location.back();
  }

  getSrcImage(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }

  //remove image in array
  handleRemoveImage(object: IdIndexImageEmit) {
    const dataImages: any = [];
    if (object.isCreate) {
      this.data.listImages.forEach((el: any, i: number) => {
        if (i !== object.index) dataImages.push(el);
      });
      this.data.listImages = dataImages;
    } else {
      this.data.listImages.forEach((el: any, i: number) => {
        if (i !== object.index) dataImages.push(el);
      });
      this.data.listImages = dataImages;
    }
  }

  //add image for array
  // async handleAddImage(event: any) {
  //   this.isLoadingUpload = true;
  //   let dataImages = [...this.data.listImages];
  //   dataImages.push({
  //     name: '',
  //     image_url: THUMBNAIL_URL,
  //     description: '',
  //   });
  //   if (!event.target.files[0] || event.target.files[0].length == 0) {
  //     return;
  //   }

  //   var mimeType = event.target.files[0].type;
  //     if (mimeType.match(/image\/*/) !== null || mimeType.match(/video\/*/) !== null) {
  //     await this.commerceService
  //       .onFileSelected(event.target.files[0], new Date().getDate())
  //       .subscribe((res: any) => {
  //         if (res.body && res.body.Location) {
  //           dataImages[dataImages.length - 1] = {
  //             name: res.body.Key,
  //             resource_type: 'products',
  //             image_url: res.body.Location,
  //             description: res.body.key,
  //           };
  //         }

  //         this.isLoadingUpload = false;
  //       });

  //     this.data.listImages = dataImages;
  //   }
  // }

  //add image for array
  async handleAddImage(event: any) {
    this.isLoadingUpload = true;
    let dataImages: any = [...this.data.listImages];
    if (dataImages.length === 0) {
      dataImages.push({
        name: '',
        resource_type: 'products',
        image_url: '',
        description: '',
      });
    }

    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }

    for (let i: number = 0; i < event.target.files.length; i++) {
      if (
        i === 0 &&
        dataImages.length === 1 &&
        dataImages[0].image_url === ''
      ) {
        var mimeType = event.target.files[i].type;
        if (
          mimeType.match(/image\/*/) !== null ||
          mimeType.match(/video\/*/) !== null
        ) {
          await this.commerceService
            .onFileSelected(event.target.files[i], new Date().getDate())
            .subscribe((res: any) => {
              if (res.body && res.body.Location) {
                dataImages[i] = {
                  name: res.body.Key,
                  resource_type: 'products',
                  image_url: res.body.Location,
                  description: res.body.key,
                };
              }
              this.isLoadingUpload = false;
            });
          this.data.listImages = dataImages;
        }
      } else {
        var mimeType = event.target.files[i].type;
        if (
          mimeType.match(/image\/*/) !== null ||
          mimeType.match(/video\/*/) !== null
        ) {
          await this.commerceService
            .onFileSelected(event.target.files[i], new Date().getDate())
            .subscribe((res: any) => {
              if (res.body && res.body.Location) {
                dataImages.push({
                  name: res.body.Key,
                  resource_type: 'products',
                  image_url: res.body.Location,
                  description: res.body.key,
                });
              }

              this.isLoadingUpload = false;
            });

          this.data.listImages = dataImages;
        }
      }
    }
  }

  //choose categories id
  onChooseData(item: any) {
    this.form.controls['product_category_id'].patchValue(item.id);
  }

  //search categories
  onSearchQuery(q: string) {
    const keyword = removeVietnameseTones(q.toLowerCase());
    if (keyword.trim() === '') {
      this.categoriesFilter = this.dataElCategory;
    } else {
      this.categoriesFilter = this.dataElCategory.filter((item: any) =>
        removeVietnameseTones(
          this.translate.instant(item.name).toLowerCase()
        ).includes(keyword)
      );
    }
  }

  removeName: boolean = false;
  //create categories
  onCreateData(name: string) {
    this.isLoadingProductCategories = true;
    const params = {
      name,
    };
    this.commerceService.addCategory(params).subscribe((res: any) => {
      if (res) {
        this.getProductCategories();
        this.removeName = true;
      }
    });
  }

  //clear choose org
  clearOrg() {
    this.form.patchValue({
      organization_id: '',
    });
  }

  //get Price
  onPrice(price: any) {
    if (price === -1) {
      this.isValidPrice = true;
    } else {
      this.isValidPrice = false;
      this.form.patchValue({
        price: price,
        amount: price - (price * this.form.value.percent_discount) / 100,
      });
    }
  }

  get isNotCanSave() {
    if (
      (this.form.invalid && this.isSubmit && this.isValidPrice) ||
      this.isSubmit ||
      this.form.invalid ||
      this.isValidPrice
    )
      return true;
    else return false;
  }

  submit() {
    this.isSubmit = true;
    if (this.form.value.cover === COVER_URL) {
      const alertDialog = {
        header: this.translate.instant('NOTIFICATION.HEADER'),
        message: this.translate.instant('FORM.VALID.COVER.REQUIRED'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.isSubmit = false;
            },
          },
        ],
      };
      this.presentAlert(alertDialog);
      this.isNotImageCover = true;
    } else {
      const newImageUpload = [...this.data.listImages];
      let lastImageUpload = [];
      if (this.coverImage.image_url !== '') {
        newImageUpload.unshift(this.coverImage);
      }
      lastImageUpload = newImageUpload;

      let body: {
        name: string;
        description: string;
        price: number;
        // type: number;
        // location: string;
        percent_discount: number;
        amount: number;
        product_category_id: string;
        organization_id?: string;
        chapter_id?: string;
        user_id?: string;
        id?: string;
        images: Array<{
          name: string;
          image_url: string;
          resource_type: string;
          resource_id: string;
          description: string;
        }>;
      } = {
        name: this.form.value.name,
        description: this.form.value.description,
        price:
          // this.typePrice === -1
          //   ? -1
          //   :
          this.typePrice === 0 ? 0 : +this.form.value.price,

        // image: this.form.value.cover,
        // type: this.form.value.type,
        // location: this.form.value.location,
        percent_discount:
          this.typePrice === 0 ? 0 : +this.form.value.percent_discount,
        amount: +this.form.value.amount,
        product_category_id: this.form.value.product_category_id,
        organization_id: this.form.value.organization_id,
        images: lastImageUpload,
      };

      if (this.query?.organization_id) {
        body = {
          ...body,
          organization_id: this.query?.organization_id,
        };
      }

      if (this.query?.chapter_id) {
        body = {
          ...body,
          chapter_id: this.query?.chapter_id,
        };
      }
      if (this.query?.user_id) {
        body = {
          ...body,
          user_id: this.query?.user_id,
        };
      }
      let alertDialog = {
        header: this.translate.instant('NOTIFICATION.HEADER'),
        message: '',
        buttons: [
          {
            text: this.translate.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {},
          },
        ],
      };

      if (this.router.snapshot.params['id']) {
        body = {
          ...body,
          id: this.router.snapshot.params['id'],
        };

        this.commerceService.putProduct(body).subscribe((res: any) => {
          if (res) {
            alertDialog = {
              ...alertDialog,
              message: this.translate.instant(
                'NOTIFICATION.CONTENT.UPDATE_SUCCESS'
              ),
              buttons: [
                {
                  text: this.translate.instant('BUTTON.OK'),
                  role: 'confirm',
                  handler: () => {
                    this.isSubmit = false;
                    res = {
                      ...res,
                      author: this.data.author,
                    };
                    const data = convertProductDetail(res);
                    this.commerceDataService.setProductDetail(data);
                    this.getProductCategories();
                    this.goBack();
                  },
                },
              ],
            };
          } else {
            alertDialog = {
              ...alertDialog,
              message: this.translate.instant(
                'NOTIFICATION.CONTENT.UPDATE_FAILURE'
              ),
            };
            this.isSubmit = false;
          }
          this.presentAlert(alertDialog);
        });
      } else {
        this.commerceService.postProduct(body).subscribe((res) => {
          if (res) {
            alertDialog = {
              ...alertDialog,
              message: this.translate.instant(
                'NOTIFICATION.CONTENT.CREATE_SUCCESS'
              ),
              buttons: [
                {
                  text: this.translate.instant('BUTTON.OK'),
                  role: 'confirm',
                  handler: () => {
                    this.isSubmit = false;
                    if (this.query?.chapter_id) {
                      this.queryProducts = {
                        ...this.queryProducts,
                        chapter_id: this.query?.chapter_id,
                      };
                    }
                    this.getProductCategories();
                    this.goBack();
                  },
                },
              ],
            };
          } else {
            alertDialog = {
              ...alertDialog,
              message: this.translate.instant(
                'NOTIFICATION.CONTENT.CREATE_FAILURE'
              ),
            };
            this.isSubmit = false;
          }
          this.presentAlert(alertDialog);
        });
      }

      const query = {
        limit: 10,
        offset: 0,
        include: 'author,summary,user,product_category,images',
      };

      localStorage.setItem('searchQueryProducts', JSON.stringify(query));
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

  getProducts(query?: any) {
    localStorage.setItem('searchQueryProducts', JSON.stringify(query));
    this.commerceService.getProducts(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertProductsList(res.data);
        this.commerceDataService.setProducts(data);
      }
    });
  }

  // changeType(event: any) {
  //   let type;
  //   if (event.detail.checked) {
  //     this.labelEventType = this.translate.instant('TAB.COMMERCE.BUY');
  //     type = 0;
  //     this.isCheckType = true;
  //   } else {
  //     this.labelEventType = this.translate.instant('TAB.COMMERCE.SALE');
  //     type = 1;
  //     this.isCheckType = false;
  //   }
  //   this.form.patchValue({
  //     type,
  //   });
  // }

  //on discount
  onDiscount(ev: any) {
    if (ev.target.value !== '0') {
      let discount = ev.target.value
        .replace(/[a-zA-Z]/g, '')
        .replace(/,/g, '')
        .replace(/\s/g, '')
        .replace(/^0+/, '');

      const regex = /^\d+$/;
      if (regex.test(discount)) {
        if (discount.length >= 3) {
          discount = '99';
        }
        this.discountDisplay = discount;
        this.form.patchValue({
          percent_discount: discount,
          amount:
            this.form.value.price - (this.form.value.price * discount) / 100,
        });
      } else {
        this.discountDisplay = '0';
        this.form.patchValue({
          percent_discount: 0,
          amount: this.form.value.price - (this.form.value.price * 0) / 100,
        });
      }
    } else {
      this.discountDisplay = '0';
      this.form.patchValue({
        percent_discount: 0,
        amount: this.form.value.price - (this.form.value.price * 0) / 100,
      });
    }
  }

  checkTypePrice(event: any) {
    this.typePrice = event.detail.value;
    if (event.detail.value === 1) {
      this.isGetPrice = true;
      this.isValidPrice = true;
    } else {
      this.isGetPrice = false;
      this.isValidPrice = false;
      this.discountDisplay = '0';
      this.form.patchValue({
        amount: 0,
      });
    }
  }
}
