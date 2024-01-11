import { UserResponse } from "../profile/edit/edit-profile.page.interface";
import { IBaseItem } from "./base-item.interface";
import { IChapter } from "./chapter.interface";
import { UserDetail } from "./user.interface";

export interface IOrganizationSocial {
  facebook: string;
  instagram: string;
  youtube: string;
}

export interface IOrganizationInviteUserBody {
  user_ids: string[];
  position_id: string;
}

export interface IOrganizationResponseInvitedBody {
  status: number;
}

export interface IOrganizationList {
 
  data: IOrganization[],
  paging: {
      count: number;
      litmit: number;
      offset: number
  }

}

export interface IOrganization {
  id: string,
  name: string,
  description: string,
  display_order: string,
  color: string,
  code: string,
  created_date: string,
  created_by: string,
  updated_date: string,
  phone: string,
  address: string,
  thumbnail: string,
  status: number,
  images: string,
  websites: string,
  socials: string,
  grade: string,
  rate: number,
  cover: string,
  avatar: string,
  vision: string,
  mission: string,
  core_values:string,
  city_id:string,
  country_id:string,
  users: UserDetail[],
  industries: IBaseItem,
  services: IBaseItem,
  country: IBaseItem,
  chapters: IChapter[],
}
