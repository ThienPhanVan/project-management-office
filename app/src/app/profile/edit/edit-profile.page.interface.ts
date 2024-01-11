export interface UserRequest {
    img: string | ArrayBuffer;
    fullName: string;
    email: string;
    address: string;
    introduce: string
}

export interface UserResponse {
    id: string | number;
    img: string | ArrayBuffer;
    fullName: string;
    email: string;
    address: string;
    introduce: string
}