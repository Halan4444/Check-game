import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, MaxLength} from "class-validator";

export class UpdateUserProfileDTO {
    @ApiProperty({
        description: 'Email address of the user',
        example: 'reachme@amitavroy.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;


    @ApiProperty({
        description: 'Username of the user',
        example: 'William Chen',
    })
    @IsNotEmpty()
    @IsEmail()
    username: string;


    @ApiProperty({
        description: 'Username of the user',
        example: 'William Chen',
    })
    address: string;

    @ApiProperty({
        description: 'Username of the user',
        example: 'William Chen',
    })
    company: string;


    @ApiProperty({
        description: 'Username of the user',
        example: 'William Chen',
    })
    name: string;

    @ApiProperty({
        description: 'Username of the user',
        example: 'William Chen',
    })
    @MaxLength(10)
    phone: string;

    @ApiProperty({
        description: 'Username of the user',
        example: 'William Chen',
    })
    photo: string;



}