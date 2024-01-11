export interface CreateNewsParams {
  name?: string;
  content?: string;
  mentions: Array<string>;
  feeling: string;
  tags?: Array<string>;
  description?: string;
  type?: string;
  media?: string;
  chapter_id?: string;
  user_id?: string;
  organization_id?: string;
  price?: string;
  images?: {
    name: string;
    image_url: string;
    resource_id?: string;
    description: string;
  };
}

export interface UpdateNewsParams {
  name?: string;
  content: string;
  mentions: Array<string>;
  feeling: string;
  tags: Array<string>;
  description?: string;
  type: string;
  media: string;
  chapter_id?: string;
  user_id?: string;
  organization_id?: string;
  id: string;
}

export interface QueryNewsList {
  offset: number;
  limit: number;
  q?: string;
  includes?: string;
  type?: number;
}

export interface NewsResponse {
  id: string;
  name: string;
  description: string | null;
  display_order: number | null;
  color: string | null;
  code: string | null;
  created_date: string | null;
  created_by: string | null;
  updated_date: string;
  deleted_date: string | null;
  content: string;
  number_of_likes: number | null;
  number_of_comments: number | null;
  number_of_shares: number | null;
  post_date: string | null;
  status: number | null;
  tags?: Array<string>;
  avatar: string | null;
  media: string;
  user: string;
  listImages: Array<string>;
  username?: string;
  thumbnail?: string;
  type?: string;
  user_id: string;
  chapter_id: string;
  organization_id: string;
  author: {
    username: string;
    thumbnail: string;
  };
}
export interface IdIndexImageEmit {
  id: number;
  index: number;
  isCreate?: boolean;
}

export interface ZoomImageNews {
  index: number;
  images: Array<string>;
}

export interface UploadImage {
  isCreate: boolean;
  event: any;
}

export interface RemoveIndexImage {
  isCreate: boolean;
  index: number;
}

export interface NewsListResponse {
  data: NewsData[];
  paging: {
    limit: string;
    offset: string;
    count: number;
  };
}

export interface NewsData {
  active_status: string;
  avatar: string;
  code: string;
  color: string;
  content: string;
  cover: string;
  created_by: string;
  created_date: string;
  creator: string;
  deleted_date: string;
  description: string;
  display_order: string;
  end_time: string;
  event_date: string;
  hagtags: string;
  id: string;
  images: string;
  inspector: string;
  interested: number;
  location: string;
  media: string;
  minimum_price: string;
  name: string;
  number_of_comments: number;
  number_of_likes: number;
  number_of_shares: number;
  post_date: string;
  start_time: string;
  status: string;
  type: number;
  updated_date: string;
  user: string;
  listImages?: {
    name: string;
    description: string;
    image_url: string;
    resource_id?: string;
  }[];
  username?: string;
  thumbnail?: string;
  tags?: string[];
  summary?: {
    number_of_reactions: number;
  };
  has_reacted?: boolean;
  isShow?: boolean;
}
