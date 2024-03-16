import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, Length, Matches} from 'class-validator';
import {REGEX} from "../../../app.utils";

export class EmailActiveDto {

    @IsNotEmpty({message: 'Register Email must have'})
    @Length(3,255)
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8,24)
    @Matches(REGEX.PASSWORD_RULE, {
        message: 'Password should have 1 upper case, lowcase'
    })
    password: string;

    @ApiProperty({
        description: 'Username of the user',
        example: 'William Chen',
    })
    @IsNotEmpty()
    @IsEmail()
    username: string;
}
