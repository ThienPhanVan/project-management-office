import { UserDetail } from "../../interface/user.interface";

export interface LoginRequestBody {
    phone: string;
    password: string
}

export interface LoginResponse {
    access_token: string;
    user: UserDetail

}