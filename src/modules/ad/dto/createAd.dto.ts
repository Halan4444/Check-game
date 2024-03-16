import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import {Prop} from "@nestjs/mongoose";
import {ObjectId} from "mongoose";

export class CreateAdDto {
    @ApiProperty({
        description: 'Photo of land',
        example: 'reachme@amitavroy.com',
    })
    @IsNotEmpty()
    photos:  [{}];

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    address: string;

    bedrooms: number;

    bathrooms: number;

    carpark: number;

    landsize: number;

    title: string;

    @IsNotEmpty()
    description: string;

    action: string;

    @IsNotEmpty({ message: "Is property house or land?" })
    type: string;

}
