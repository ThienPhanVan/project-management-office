import { UserDetail } from "./user.interface";

export interface IChapter {
    code?: string | null,
    color?: string | null,
    created_by?: string | null,
    created_date?: string | null,
    description: string,
    display_order: null | string,
    id?: string,
    name: string,
    updated_date?: string,
    users: UserDetail[],
    organizations: []
}