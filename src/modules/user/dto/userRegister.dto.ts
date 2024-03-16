import {IsEmail, IsNotEmpty, Length, Matches} from "class-validator";
import {REGEX} from "../../../app.utils";
import {ApiProperty} from "@nestjs/swagger";


export class UserRegisterRequestDto {

    @ApiProperty({
        description:'The name of user',
        example:'Jhon Done'
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description:'The email address of user',
        example:'Halan4444c@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @ApiProperty({
        description:'The password of user',
        example:'Bao12345@.'
    })
    @IsNotEmpty()
    @Length(8,24)
    @Matches(REGEX.PASSWORD_RULE, {
        message: 'Password should have 1 upper case, lowcase'
    })
    password: string;


}
