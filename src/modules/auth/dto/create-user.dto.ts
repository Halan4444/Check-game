import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, Length, Matches, MaxLength} from 'class-validator';
import {REGEX} from "../../../app.utils";

export class CreateUserDto {
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

    @MaxLength(24)
    @IsNotEmpty()
    @IsEmail()
    username: string;

    @Matches(REGEX.PASSWORD_RULE, {
        message: 'Password should have 1 upper case, lowcase'
    })
    @ApiProperty({
        description: 'Password in plain text',
        example: 'Password@123',
    })
    @IsNotEmpty()
    password: string;
}
