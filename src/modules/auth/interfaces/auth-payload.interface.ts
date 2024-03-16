export interface AuthPayload {
    _id:number,
    username:string
}

export interface EmailPayload {
    username:string;
    email: string;
    password: string;
    sub:number;
    message:string;
}
