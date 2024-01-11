import { IIAMGroup } from './iam-group.interface';

export interface ListUsers {
  data: UserDetail[];
  paging: ListUsersPaging;
}

export interface ListUsersPaging {
  offset: string;
  limit: string;
  count: number;
}

export interface UserDetail {
  address: string;
  code: string;
  color: string;
  created_by: string;
  created_date: string;
  description: string;
  display_order: string;
  email: string;
  id: string;
  name: string;
  organization_id: string;
  phone: string;
  thumbnail: string;
  updated_date: string;
  user_type: number;
  username: string;
  verified_flag: number;
  iam_group?: IIAMGroup;
  organization_user?: any;
  user_chapter?: any;
  position_id?: any;
  socials?: string
  isInvited?: boolean;
  role? : string
}

export interface ListHistory {
  data: HistoryDetail[];
}

export interface HistoryDetail {
  code: string;
  color: string;
  created_by: string;
  created_date: string;
  description: string;
  display_order: number;
  id: string;
  info: string;
  name: string;
  updated_date: string;
  user_id: string;
}
