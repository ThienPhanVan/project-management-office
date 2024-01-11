import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { IIssueType } from '../interface/issue.interface';
import * as _ from 'lodash';
import * as standardEmojis from '../../assets/emoji/standard-emoji.json';

export const phoneRegex = /^[0-9\-\+]{10,11}$/;
export const numberRegex = /^(\+)?(\d+\s?)$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const URL_PATTERN =
  /(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.)[^\s]+|([^\s]+(.com|.vn|.net))/g;

export const LOGO_ORG_URL = '../../assets/logo/logo-org-default.jpg';
export const THUMBNAIL_URL = '../../assets/avatar/man.png';
export const GROUP_THUMBNAIL_URL = '../../assets/avatar/group-thumbnail.jpeg';
export const COVER_URL = '../../assets/avatar/cover.png';
export const NOT_FOUND = '../../assets/images/not-found.jpg';
export const WELCOME_IMG = '../../assets/images/welcome.jpg';
export const TST_URL = 'https://tstmart.com/home';

export const DEFAULT_BIRTHDAY = new Date(315507600).toISOString();

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export const USER_ORGANIZATION_STATUS = Object.assign({
  MEMBER: 0,
  INVITING_USER: 1,
});

export const MESSAGE_STATUS = Object.assign({
  SENT: 1,
  DELIVERED: 2,
  READED: 3,
  ERROR: 0,
});

export const ISSUE_TYPES: IIssueType[] = Object.assign([
  {
    id: 1,
    name: 'Task',
  },
  {
    id: 2,
    name: 'Bug',
  },
  {
    id: 3,
    name: 'QA',
  },
  {
    id: 4,
    name: 'Story',
  },
]);

export function convertTimeToFromNow(date: string) {
  let language = '';
  const userStr = localStorage.getItem('user');
  if (userStr) {
    language = JSON.parse(userStr).language ?? 'vi';
  }
  if (language === 'vi') {
    moment.locale('vi');
  } else if (language === 'en') {
    moment.locale('en');
  }
  let dateTime = moment(date).fromNow();
  return dateTime;
}

export function convertDateTimeYYYYMMDD(date: string) {
  const today = moment(date);
  return today.format('YYYY-MM-DD');

  // const yyyy = today.getFullYear();
  // let mm: number | string = today.getMonth() + 1; // Months start at 0!
  // let dd: number | string = today.getDate();
  // if (dd < 10) dd = '0' + dd;
  // if (mm < 10) mm = '0' + mm;

  // return yyyy + '-' + mm + '-' + dd;
}

export function convertDateTimeWithHourMinutes(date: string) {
  const today = new Date(date);
  const yyyy = today.getFullYear();
  let mm: number | string = today.getMonth() + 1; // Months start at 0!
  let dd: number | string = today.getDate();
  let h = today.getHours();
  let s = today.getMinutes();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return dd + '/' + mm + '/' + yyyy + ' ' + h + ':' + s;
}

export function convertDataNewsList(data: any) {
  const user = getUserLocalStorage();
  data.forEach((item: any) => {
    // let listImages = [];
    // if (item.media) {
    //   if (item.media.indexOf(',') > -1) {
    //     listImages = item.media.split(',');
    //   } else {
    //     listImages = [item.media];
    //   }
    // }
    const images: any[] = [];
    if (item.images?.length) {
      item.images.forEach((el: any) => {
        images.push({
          name: el.name,
          image_url: el.image_url,
          resource_id: el.resource_id,
          description: el.description,
        });
      });
    }
    item.isShow = true;
    item.updated_date = convertTimeToFromNow(item.updated_date);
    item.listImages = images;
    item.event_date_start = item?.start_time
      ? moment(item?.event_date_start).format('DD/MM/YYYY') +
        ' ' +
        moment(item?.start_time, 'HH:mm').format('HH:mm')
      : moment(item?.event_date_start).format('DD/MM/YYYY');
    item.event_date_end =
      item?.end_time && item?.event_date_end
        ? moment(item?.event_date_end).format('DD/MM/YYYY') +
          ' ' +
          moment(item?.end_time, 'HH:mm').format('HH:mm')
        : null;
    item.username = item?.author?.username ?? item.created_by;
    item.thumbnail = item?.author?.thumbnail ?? THUMBNAIL_URL;
    item.cover = item.cover ?? THUMBNAIL_URL;
    item.minimum_price = item.minimum_price ? Number(item.minimum_price) : 0;
    item.author = {
      ...item.author,
      thumbnail: item.author.thumbnail ?? THUMBNAIL_URL,
    };
    if (item && item.participates) {
      const findParticipate = item?.participates.find(
        (el: any) => el.user_id === user.id && el.news_id === item.id
      );
      if (findParticipate) {
        item.has_participated = true;
      } else {
        item.has_participated = false;
      }
    }
  });

  return data;
}

function getUserLocalStorage() {
  const userStr = localStorage.getItem('user');
  let user: any;
  if (userStr) {
    user = JSON.parse(userStr);
  }
  return user;
}

export function convertDataNewsDetail(item: any) {
  const user = getUserLocalStorage();
  if (item && item.participates) {
    const findParticipate = item?.participates.find(
      (el: any) => el.user_id === user.id && el.news_id === item.id
    );
    if (findParticipate) {
      item.has_participated = true;
    } else {
      item.has_participated = false;
    }
  }
  const images: any[] = [];
  if (item.images?.length) {
    item.images.forEach((el: any) => {
      images.push({
        name: el.name,
        image_url: el.image_url,
        resource_id: item.id,
        description: el.description,
      });
    });
  }
  return {
    ...item,
    isShow: true,
    updated_date: convertTimeToFromNow(item.updated_date),
    listImages: images,
    start_date_event: item.event_date_start,
    event_date_start: item?.start_time
      ? moment(item?.event_date_start).format('DD/MM/YYYY') +
        ' ' +
        moment(item?.start_time, 'HH:mm').format('HH:mm')
      : moment(item?.event_date_start).format('DD/MM/YYYY'),

    end_date_event: item.event_date_end,
    event_date_end:
      item?.end_time && item?.event_date_end
        ? moment(item?.event_date_end).format('DD/MM/YYYY') +
          ' ' +
          moment(item?.end_time, 'HH:mm').format('HH:mm')
        : null,
    username: item?.author?.username ?? item.created_by,
    thumbnail: item?.author?.thumbnail ?? THUMBNAIL_URL,
    cover: item.cover ?? THUMBNAIL_URL,
    minimum_price: item.minimum_price === '-1' ? 0 : Number(item.minimum_price),
    fee_type: item.fee_type === -1 ? 0 : Number(item.fee_type),
    author: {
      ...item.author,
      thumbnail: item.author.thumbnail ?? THUMBNAIL_URL,
    },
  };
}

export function convertComment(data: any) {
  const emojiGroups = _(standardEmojis)
    .groupBy((x) => x.group)
    .map((emojis, group) => ({
      group,
      emojis,
    }))
    .value();

  data.forEach((element: any) => {
    element.updated_date = convertTimeToFromNow(element.updated_date);
    if (element.replies && element.replies.length) {
      element.replies.forEach((el: any, i: number) => {
        el.updated_date = convertTimeToFromNow(el.updated_date);
        el.isShow = false;
      });

      element.isShowAll = false;
    }

    emojiGroups.forEach((groups: any) => {
      groups.emojis.find((emoiji: any) => {
        if (element.name.includes(emoiji.codes)) {
          element.name = element.name.replaceAll(
            emoiji.codes,
            `${emoiji.char}`
          );
        }
        if (element.replies && element.replies.length) {
          element.replies.forEach((el: any, i: number) => {
            if (el.name.includes(emoiji.codes)) {
              el.name = el.name.replaceAll(emoiji.codes, `${emoiji.char}`);
            }
          });
        }
      });
    });
  });

  return data;
}

export function convertProductsList(data: any) {
  return data.map((item: any) => {
    return {
      ...item,
      cover: item.image ?? COVER_URL,
      listImages: item.images,
      created_date: convertTimeToFromNow(item.created_date),
      author: {
        ...item.author,
        thumbnail: item.author?.thumbnail ?? THUMBNAIL_URL,
      },
    };
  });
}

export function convertProductDetail(data: any) {
  return {
    ...data,
    cover: data.image ?? COVER_URL,
    listImages: data.images ?? [],
    created_date: convertTimeToFromNow(data.created_date),
    author: {
      ...data?.author,
      thumbnail: data?.author?.thumbnail ?? THUMBNAIL_URL,
    },
    amount: +data?.amount,
  };
}

export function convertDataCarItems(data: any) {
  if (data.length === 0) {
    return [];
  }
  data[0].product = {
    ...data[0].product,
    checked: true,
  };
  const result = [
    {
      user_sell: data[0].user_sell,
      organization_sell: data[0].organization_sell,
      cartItems: [data[0]],
      checked: true,
    },
  ];

  for (let i = 1; i < data.length; i++) {
    data[i].product = {
      ...data[i].product,
      checked: true,
    };
    let count = 0;
    for (let j = 0; j < result.length; j++) {
      if (
        data[i].user_sell?.id === result[j].user_sell?.id &&
        data[i].organization_sell?.id === result[j].organization_sell?.id
      ) {
        result[j].cartItems.push(data[i]);
      } else {
        count += 1;
      }
    }
    if (count === result.length) {
      result.push({
        user_sell: data[i].user_sell,
        organization_sell: data[i].organization_sell,
        cartItems: [data[i]],
        checked: true,
      });
    }
  }
  return result;
}

export function convertDataOrdersList(data: any) {
  return data.map((item: any) => {
    return {
      ...item,
      status: 'TAB.COMMERCE.ORDER.CHILD.' + item.status,
    };
  });
}

export function convertDataOrderDetail(data: any) {
  let language = '';
  const userStr = localStorage.getItem('user');
  if (userStr) {
    language = JSON.parse(userStr).language ?? 'vi';
  }
  if (language === 'vi') {
    moment.locale('vi');
  } else if (language === 'en') {
    moment.locale('en');
  }
  let result: any = {};
  result = {
    ...data,
    status: 'TAB.COMMERCE.ORDER.CHILD.' + data.status,
    updated_date: moment(data.update_date).format('lll'),
  };

  result.status_history.forEach((el: any) => {
    el.updated_date = moment(el.update_date).format('lll');
  });

  return result;
}

export function convertNotificationList(data: any) {
  return data.map((item: any) => {
    return {
      ...item,
      updated_date: convertTimeToFromNow(item.updated_date),
      user: {
        ...item?.user,
        thumbnail: item?.user?.thumbnail ?? THUMBNAIL_URL,
      },
    };
  });
}

export function convertToLink(str: string) {
  const regex = /(https?:\/\/[^\s]+)/g;
  return str.replace(regex, '<a class="text-blue-600" href="$1">$1</a>');
}

export function extractHTTPSURL(input: string): string | null {
  let str = input.replace(/<a[^>]*>(.*?)<\/a>/g, '$1');
  const regex = /(https?:\/\/[^\s]+)/g;
  const match = str.match(regex);
  return match ? match[0] : null;
}

export function removeVietnameseTones(str: string) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' '
  );
  return str;
}
