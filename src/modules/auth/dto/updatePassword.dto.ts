import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, Matches} from 'class-validator';
import {REGEX} from "../../../app.utils";

export class UpdatePasswordDto {
    @ApiProperty({
        description: 'Email address of the user',
        example: 'reachme@amitavroy.com',
    })
    @IsNotEmpty()
    oldPassword: string;


    @Matches(REGEX.PASSWORD_RULE, {
        message: 'Password should have 1 upper case, lowcase'
    })
    @ApiProperty({
        description: 'Password in plain text',
        example: 'Password@123',
    })
    @IsNotEmpty()
    newPassword: string;
}
