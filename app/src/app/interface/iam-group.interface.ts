import { IBaseItem } from "./base-item.interface";

export interface IIAMGroup extends IBaseItem{
    iam_permissions?: IIAMPermission[],
    level: number,
    disabled?: boolean
}

export interface IIAMPermission extends IBaseItem{
}






