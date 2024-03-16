import {IsEmail, isEmail, IsNotEmpty, Length, Matches} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {REGEX} from "../../../app.utils";

export class SendEmailDto {

    @ApiProperty({
        description: 'Email',
        example: 'Halan4444b@gmail.com',
    })
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
        description: 'Email Subject',
        example: '123456',
    })
    @IsNotEmpty()
    @Length(5,255)
    subject: string;

    @ApiProperty({
        description: 'Email Subject',
        example: '123456',
    })
    @IsNotEmpty()
    @Length(5,255)
    username: string;


    @ApiProperty({
        description: 'Email Subject',
        example: '123456',
    })
    message: string;

}
