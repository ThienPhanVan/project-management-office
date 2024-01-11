import { Component, OnInit } from '@angular/core';
import { AlertDialog } from '../../interface';
import { AlertController } from '@ionic/angular';
import { ACTIVITY_NAME_ORGANIZATION } from './activity-organization.page.i';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { THUMBNAIL_URL } from '../../constant';

@Component({
  selector: 'app-activity-organization',
  templateUrl: './activity-organization.page.html',
  styleUrls: ['./activity-organization.page.scss'],
})
export class ActivityOrganizationPage implements OnInit {
  user: any = {}
  path: string = "";
  classNameAvatar: string ="list";
  isAvatar: boolean = true
  constructor(
    private alertController: AlertController,
    private router: ActivatedRoute,
    private location: Location
  ) {
    const userStr = localStorage.getItem('user')
    
    if(userStr) {
      this.user = JSON.parse(userStr);
    }    
  }
  nameActivity = ACTIVITY_NAME_ORGANIZATION
  data: any = [
    
    {
      name: 'CREATE_ORGANIZATION', 
      old_data: {},
      new_data: { }, 
      detail_change: { 
        name: { 
          old_value: "Chapter", 
          new_value: "Chapter 1"
        },
        description: {
          old_value: "string", 
          new_value: "string 1"
        },
        type: {
          old_value: "string", 
          new_value: "string 1"
        },
        parent_id: {
          old_value: "string", 
          new_value: "string 1"
        },
        display_order: {
          old_value: 0, 
          new_value: 1
        }
      }, 
      relations: {}, 
      created_at: "21/07/2023 19:20",
      user: {
        "id": "93a475b9-9a56-4631-bb4e-680021a2d281",
        "name": null,
        "description": null,
        "display_order": null,
        "color": null,
        "code": null,
        "created_date": null,
        "created_by": null,
        "updated_date": "2023-07-19T12:24:58.000Z",
        "email": "khanhtmd97@gmail.com",
        "phone": "0123456789",
        "address": null,
        "thumbnail": THUMBNAIL_URL,
        "user_type": 0,
        "language": "vi",
        "timezone": null,
        "organization_id": null,
        "username": "Nguyễn Văn Khánh",
        "verified_flag": 0,
        "birthday": "1997-02-16T08:38:00.000Z",
        "gender": 2
      }
    },
    {
      name: 'UPDATE_ORGANIZATION', 
      old_data: {},
      new_data: {}, 
      detail_change: {}, 
      relations: {
        user: [
          {
            address: null,
            birthday: "1997-02-16T08:38:00.000Z",
            chapters: [],
            organizations: [],
            description: null,
            email: "khanhtmd97@gmail.com",
            gender: 2,
            id: "93a475b9-9a56-4631-bb4e-680021a2d281",
            language: "vi",
            name: null,
            organization_id: null,
            phone: "0123456789",
            thumbnail: null,
            timezone: null,
            username: "Nguyễn Văn Khánh",
            verified_flag: 0,
            updated_date: "2023-07-19T12:24:58.000Z",
            display_order: null,
            code: null,
            color: null,
            created_by: null,
            created_date: null,
            user_type: 0,
          }
        ],
        chapter: {
          name: "Chapter 1"
        },
        organization: []
      }, 
      created_at: "20/07/2023 07:20",
      user: {
        "id": "93a475b9-9a56-4631-bb4e-680021a2d281",
        "name": null,
        "description": null,
        "display_order": null,
        "color": null,
        "code": null,
        "created_date": null,
        "created_by": null,
        "updated_date": "2023-07-19T12:24:58.000Z",
        "email": "khanhtmd97@gmail.com",
        "phone": "0123456789",
        "address": null,
        "thumbnail": THUMBNAIL_URL,
        "user_type": 0,
        "language": "vi",
        "timezone": null,
        "organization_id": null,
        "username": "Văn Khánh",
        "verified_flag": 0,
        "birthday": "1997-02-16T08:38:00.000Z",
        "gender": 2
      }
    },
    {
      name: 'SET_OWNER_ORGANIZATION', 
      old_data: {},
      new_data: {}, 
      detail_change: {}, 
      relations: {
        user: [
          {
            address: null,
            birthday: "1997-02-16T08:38:00.000Z",
            chapters: [],
            organizations: [],
            description: null,
            email: "khanhtmd97@gmail.com",
            gender: 2,
            id: "93a475b9-9a56-4631-bb4e-680021a2d281",
            language: "vi",
            name: null,
            organization_id: null,
            phone: "0123456789",
            thumbnail: null,
            timezone: null,
            username: "Nguyễn Văn Khánh",
            verified_flag: 0,
            updated_date: "2023-07-19T12:24:58.000Z",
            display_order: null,
            code: null,
            color: null,
            created_by: null,
            created_date: null,
            user_type: 0,
          }
        ],
        chapter: {
          name: "Chapter 1"
        },
        organization: []
      }, 
      created_at: "20/07/2023 07:20",
      user: {
        "id": "93a475b9-9a56-4631-bb4e-680021a2d281",
        "name": null,
        "description": null,
        "display_order": null,
        "color": null,
        "code": null,
        "created_date": null,
        "created_by": null,
        "updated_date": "2023-07-19T12:24:58.000Z",
        "email": "khanhtmd97@gmail.com",
        "phone": "0123456789",
        "address": null,
        "thumbnail": THUMBNAIL_URL,
        "user_type": 0,
        "language": "vi",
        "timezone": null,
        "organization_id": null,
        "username": "Văn Khánh",
        "verified_flag": 0,
        "birthday": "1997-02-16T08:38:00.000Z",
        "gender": 2
      }
    },
    {
      name: 'VERIFY_ORGANIZATION', 
      old_data: {},
      new_data: {}, 
      detail_change: {}, 
      relations: {
        user: [],
        chapter: {
          name: "Chapter 1"
        },
        organization: [
          {
            name: "Organization 1"
          }
        ]
      }, 
      created_at: "20/07/2023 07:20",
      user: {
        "id": "93a475b9-9a56-4631-bb4e-680021a2d281",
        "name": null,
        "description": null,
        "display_order": null,
        "color": null,
        "code": null,
        "created_date": null,
        "created_by": null,
        "updated_date": "2023-07-19T12:24:58.000Z",
        "email": "khanhtmd97@gmail.com",
        "phone": "0123456789",
        "address": null,
        "thumbnail": THUMBNAIL_URL,
        "user_type": 0,
        "language": "vi",
        "timezone": null,
        "organization_id": null,
        "username": "Văn Khánh",
        "verified_flag": 0,
        "birthday": "1997-02-16T08:38:00.000Z",
        "gender": 2
      }
    },
    {
      name: 'INVITE_USER_ORGANIZATION', 
      old_data: {},
      new_data: {}, 
      detail_change: {}, 
      relations: {
        user: [],
        chapter: {
          name: "Chapter 1"
        },
        organization: [
          {
            name: "Organization 1"
          }
        ]
      }, 
      created_at: "20/07/2023 07:20",
      user: {
        "id": "93a475b9-9a56-4631-bb4e-680021a2d281",
        "name": null,
        "description": null,
        "display_order": null,
        "color": null,
        "code": null,
        "created_date": null,
        "created_by": null,
        "updated_date": "2023-07-19T12:24:58.000Z",
        "email": "khanhtmd97@gmail.com",
        "phone": "0123456789",
        "address": null,
        "thumbnail": THUMBNAIL_URL,
        "user_type": 0,
        "language": "vi",
        "timezone": null,
        "organization_id": null,
        "username": "Văn Khánh",
        "verified_flag": 0,
        "birthday": "1997-02-16T08:38:00.000Z",
        "gender": 2
      }
    },
    {
      name: 'ACCEPT_ORGANIZATION_USER', 
      old_data: {},
      new_data: {}, 
      detail_change: {}, 
      relations: {
        user: [],
        chapter: {
          name: "Chapter 1"
        },
        organization: [
          {
            name: "Organization 1"
          }
        ]
      }, 
      created_at: "20/07/2023 07:20",
      user: {
        "id": "93a475b9-9a56-4631-bb4e-680021a2d281",
        "name": null,
        "description": null,
        "display_order": null,
        "color": null,
        "code": null,
        "created_date": null,
        "created_by": null,
        "updated_date": "2023-07-19T12:24:58.000Z",
        "email": "khanhtmd97@gmail.com",
        "phone": "0123456789",
        "address": null,
        "thumbnail": THUMBNAIL_URL,
        "user_type": 0,
        "language": "vi",
        "timezone": null,
        "organization_id": null,
        "username": "Văn Khánh",
        "verified_flag": 0,
        "birthday": "1997-02-16T08:38:00.000Z",
        "gender": 2
      }
    },
    {
      name: 'REMOVE_USER_ORGANIZATION', 
      old_data: {},
      new_data: {}, 
      detail_change: {}, 
      relations: {
        user: [],
        chapter: {
          name: "Chapter 1"
        },
        organization: [
          {
            name: "Organization 1"
          }
        ]
      }, 
      created_at: "20/07/2023 07:20",
      user: {
        "id": "93a475b9-9a56-4631-bb4e-680021a2d281",
        "name": null,
        "description": null,
        "display_order": null,
        "color": null,
        "code": null,
        "created_date": null,
        "created_by": null,
        "updated_date": "2023-07-19T12:24:58.000Z",
        "email": "khanhtmd97@gmail.com",
        "phone": "0123456789",
        "address": null,
        "thumbnail": THUMBNAIL_URL,
        "user_type": 0,
        "language": "vi",
        "timezone": null,
        "organization_id": null,
        "username": "Văn Khánh",
        "verified_flag": 0,
        "birthday": "1997-02-16T08:38:00.000Z",
        "gender": 2
      }
    },
    {
      name: 'ADD_ORGANIZATION_CHAPTER', 
      old_data: {},
      new_data: {}, 
      detail_change: {}, 
      relations: {
        user: [],
        chapter: {
          name: "Chapter 1"
        },
        organization: [
          {
            name: "Organization 1"
          }
        ]
      }, 
      created_at: "20/07/2023 07:20",
      user: {
        "id": "93a475b9-9a56-4631-bb4e-680021a2d281",
        "name": null,
        "description": null,
        "display_order": null,
        "color": null,
        "code": null,
        "created_date": null,
        "created_by": null,
        "updated_date": "2023-07-19T12:24:58.000Z",
        "email": "khanhtmd97@gmail.com",
        "phone": "0123456789",
        "address": null,
        "thumbnail": THUMBNAIL_URL,
        "user_type": 0,
        "language": "vi",
        "timezone": null,
        "organization_id": null,
        "username": "Văn Khánh",
        "verified_flag": 0,
        "birthday": "1997-02-16T08:38:00.000Z",
        "gender": 2
      }
    },
    {
      name: 'REMOVE_ORGANIZATION_CHAPTER', 
      old_data: {},
      new_data: {}, 
      detail_change: {}, 
      relations: {
        user: [],
        chapter: {
          name: "Chapter 1"
        },
        organization: [
          {
            name: "Organization 1"
          }
        ]
      }, 
      created_at: "20/07/2023 07:20",
      user: {
        "id": "93a475b9-9a56-4631-bb4e-680021a2d281",
        "name": null,
        "description": null,
        "display_order": null,
        "color": null,
        "code": null,
        "created_date": null,
        "created_by": null,
        "updated_date": "2023-07-19T12:24:58.000Z",
        "email": "khanhtmd97@gmail.com",
        "phone": "0123456789",
        "address": null,
        "thumbnail": THUMBNAIL_URL,
        "user_type": 0,
        "language": "vi",
        "timezone": null,
        "organization_id": null,
        "username": "Văn Khánh",
        "verified_flag": 0,
        "birthday": "1997-02-16T08:38:00.000Z",
        "gender": 2
      }
    }
  ]

  ngOnInit() {
    // const userStr = localStorage.getItem('user')
    
    // if(userStr) {
    //   this.userService.getActivitiesProfile(JSON.parse(userStr).id)
    //     .subscribe(res => {
    //       if(res && res.data) {
    //         res?.data?.map((el: any) => {
    //           if(ACTIVITY_NAME_CHAPTER.includes(el.name)) {
    //             this.dataChapter.push(el)
    //           }
    //         })
    //       }
    //     })
    // }
  }

    goBack() {
    this.location.back();
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
