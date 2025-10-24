export interface RegisterData {
    full_name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    id: number;
    full_name: string;
    email: string;
}
