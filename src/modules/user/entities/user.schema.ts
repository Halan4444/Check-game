import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from "mongoose";
import {UserRoles} from "../enums/user.enum";

export type UserDocument = User & Document;

const BUYER = UserRoles.BUYER
const ADMIN = UserRoles.ADMIN
const SELLER = UserRoles.SELLER

@Schema()
export class User extends Document {
    @Prop({  type: String, trim: true, required: true, unique: true, lowercase: true, default: ""  })
    username: string;

    @Prop({type: String, trim: true, default: ""  })
    name: string;

    @Prop({type: String, trim: true, required: true, maxLength: 255 })
    password: string;

    @Prop({ type: String, default: "" })
    address: string;

    @Prop({ type: String, default: "" })
    phone: string;

    @Prop({ type: String, default: "" })
    company: string;

    @Prop({type: String, trim: true, required: true, unique: true, lowercase: true})
    email: string;

    @Prop({  })
    photo: string;

    @Prop({type: mongoose.Types.ObjectId, ref: "Ad"  })
    enquiredProperties: [];

    @Prop({ type: mongoose.Types.ObjectId, ref: "Ad"  })
    wishList: [];

    @Prop({ type: [String],
        default: [BUYER],
        enum: [BUYER, SELLER,ADMIN],  })
    role: string;

    @Prop({  type: String, default: "" })
    resetCode: string;

    @Prop({  type: Boolean, default: false })
    active: boolean;

    @Prop({ default: Date.now })
    createdAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);
