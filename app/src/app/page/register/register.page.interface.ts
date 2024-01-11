export interface RegisterRequestBody {
    username: string;
    email: string;
    phone: string;
    password: string;
}

export interface RegisterResponse {
    message: string,
    code?: string
}

export interface SendMailResponse {
    data: string
}