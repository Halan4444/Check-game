import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Query,
    Req, Res,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./guards/jwtAuth.guard";
import {ApiBearerAuth, ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {LoginDto} from "./dto/login.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserDetails} from "../user/entities/user.interface";
import {EmailService} from "../email/email.service";
import {UserService} from "../user/services/user.service";
import {forgotPasswordTemplate} from "../../common/template/forgotPasswordTemplate";
import {UpdatePasswordDto} from "./dto/updatePassword.dto";
import {UpdateUserProfileDTO} from "./dto/userProfile.dto";
import { Response } from 'express';
import {JwtService} from "@nestjs/jwt";
import {HttpResponse} from "aws-sdk";
import * as http from "http";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(
        private authService:AuthService,
        private jwtService:JwtService,
        private emailService:EmailService,
        private userService:UserService,
    ) {
    }

    @Post('login')
    @ApiCreatedResponse({
        description: 'Login into System ',
        type:LoginDto,
    })
    async login(@Req() req, @Body() loginDto: LoginDto): Promise<any> {
        return this.authService.login(loginDto)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('user')
    async user(@Req() req):Promise<any> {
        return req.user;
    }

    @Post('register')
    async register (@Body() user:CreateUserDto):Promise<UserDetails | null | object> {

        const checkEmailExist = await this.authService.checkUserExist(user);
        console.log(checkEmailExist)
        if(!checkEmailExist) {
            const token = await this.emailService.sendEmail(user)
            const newUser:{username,email,password} = await this.authService.userJwt(token)
            const data = await this.authService.register(newUser);
            return { status: HttpStatus.OK, data: data }
        } else {
            throw new HttpException('Email Existed', HttpStatus.CONFLICT);
        }
    }


    @Post('active')
    async active(@Body() token: object): Promise<UserDetails | string | object> {
        try {
            // @ts-ignore
            const data = this.jwtService.decode(token.token)
            const email = data.email
            const user = await this.userService.userActivation(email);
            const {access_token, refresh_token} = await this.authService.generateToken(user)
            return {access_token, refresh_token, user}
        } catch (error) {
            console.log(error)
            throw new HttpException('User activation failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('forgotPassword')
    async forgotPassword (@Body('email')  email:string, @Res() response: Response):Promise<string | null | object> {
        const accessToken = await this.authService.forgotPassword(email)
        return response.status(HttpStatus.OK).send({sendEmail:"Ok",accessToken});
    }


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('resetPassword')
    async resetPassword(@Body()email:string, password:string):Promise<UserDetails | string | null> {
        return await this.authService.resetPassword(email, password)
    }



    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('currentUser')
    async currentUser(@Req()req):Promise<UserDetails | string | null> {
        const {email} = req.body
        return await this.authService.currentUser(email)
    }

    @Post('refresh-token')
    @ApiCreatedResponse({
        description: 'Create new Refresh Token ',
    })
    async refreshToken(@Body() refToken:any ): Promise<any> {
        try{
            const {_id} =  await this.jwtService.decode(refToken.refreshToken)
            const user =  await this.userService.findUserById(_id)
            const jwt = await this.authService.generateToken(user)
            return {jwt}
        } catch (err) {
            console.log(err)
            throw new BadRequestException({error:"Refresh Token Failed"})
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profile/:username')
    async publicUserProfile(@Param('username')username:string):Promise<UserDetails | string | null> {
        return await this.authService.publicProfile(username)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('profile/:username/updatePassword')
    async updatePassword(@Param('username')username:string, @Body() updatePassword: UpdatePasswordDto, @Res()res):Promise<UserDetails | string | object> {
        return await this.authService.updatePassword(username, updatePassword, res)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('profile/:username/updateProfile')
    async updateProfile(@Param('username')username:string, @Body() updateProfile: UpdateUserProfileDTO):Promise<UserDetails | string | object> {
        return await this.authService.updateProfile(username, updateProfile)
    }

}
