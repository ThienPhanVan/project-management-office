import { UserDetail } from "./user.interface"

export interface IMessage {
  id: string|number,
  content: string,
  user_id: string,
  time: string,
  replies: any,
  emojis: IEmojiUsers[],
  status?: number,
  attachments?: IAttachment[]
}

export interface IAttachment {
  type: string,
  name: string,
  content?: string | ArrayBuffer | null,
  size?: string,
  height?: number,
  width?: number
}

export interface IImageGrid {
  image: IAttachment,
  height: number,
  max_width: number,
  width: number
}

export interface IEmoji {
  codes: string,
  char: string,
  name: string,
  category: string,
  group: string
  subgroup: string
}


export interface IEmojiUsers {
  emoji: IEmoji,
  user_ids: string[]
}

export interface IEmojiGroup {
  codes: string,
  count: number,
  char: string,
  user_ids: string[]
}

export interface Message {
  message_reactions?: Reactions[];
  replies?: any,
  emojis?: IEmojiUsers[]
  id : string ;
  created_by?: string;
  username? : string;
  description?: string;
  message_group_id?: string;
  parent_id?: string;
  images?: Image[];
  attachments?: IAttachment[]
  status?: number;
  user? : UserDetail
  message_pin?: Pinned[];
  video? : Video[]
}

export interface Reactions {
  react_emoji: string,
}

export interface Image {
  name?: string;
  image_url: string;
  message_id?: string;
  message_group_id?: string;
  parent_id?: string;
  description?: string;
}

export interface Video {
  name?: string;
  video_url: string;
  message_id?: string;
  message_group_id?: string;
  parent_id?: string;
  description?: string;
}

export interface Pinned {
  id: string;
  created_by: string;
  created_date: string | null;
  deleted_date: string | null;
  description: string | null;
  display_order: number | null;
  name: string | null;
  parent_id: string | null;
  updated_date: string;
  color: string | null;
}




