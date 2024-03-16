import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import mongoose from "mongoose";
export type AdDocument = Ad & Document;


@Schema()
export class Ad extends Document {
    @Prop({  type: [{}], default:null  })
    photos: [{}];

    @Prop({type: Number, trim: true, required: true,default: 0  })
    price: number;

    @Prop({type: String, trim: true, required: true, maxLength: 255,default: "" })
    address: string;

    @Prop({ type: Number, default: null})
    bedrooms: number;

    @Prop({ type: Number, default: null })
    bathrooms: number;

    @Prop({ type: Number, default: null })
    landsize: number;

    @Prop({ type: Number, default: null })
    carpark: number;

    // @Prop({ type:[String], default: ["Point"], enum: ["Point"],
    //     coordinate: {type:[String], default: [-33.86882, 151.20929]}})
    @Prop({type:[{}], default: [{type:"Point",coordinates:[-33.86882, 151.20929]}]})
    location: [{}];

    @Prop({type: String, trim: true, maxLength: 255,default: "" })
    title: string;

    @Prop({type: String, lowercase:true,unique:true,default: "" })
    slug: string;

    @Prop({type: String,default: "" })
    description: string;

    @Prop({type: String,ref: "User" })
    postedBy: string;

    @Prop({type: Boolean, default:false })
    sold: string;

    @Prop({type: [{}], default:"" })
    googleMap: [{}];

    @Prop({type: String, default:"Other" })
    type: string;

    @Prop({type: String, default:"Sell" })
    action: string;

    @Prop({type: Number, default:0 })
    views: number;

    @Prop({ default: Date.now })
    createdAt: Date;

}

export const AdSchema = SchemaFactory.createForClass(Ad);
