import {dateType} from "aws-sdk/clients/iam";
import {ObjectId} from "mongoose";


export interface UserDetails {
    id: string;
    username: string;
    email: string;
    password: string;
    address: string;
    company: string;
    createdAt: Date,
    enquiredProperties: [];
    name: string;
    phone: string;
    photo: string;
    resetCode: string;
    role:  string;
    wishList: [];
    active: boolean;
}