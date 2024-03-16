import {
    BadRequestException,
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import {UserService} from "../user/services/user.service";
import * as bcrypt from 'bcrypt'
import {JwtService} from "@nestjs/jwt";
import {AuthPayload, EmailPayload} from "./interfaces/auth-payload.interface";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserDetails} from "../user/entities/user.interface";
import {LoginDto} from "./dto/login.dto";
import {EmailService} from "../email/email.service";
import {UpdatePasswordDto} from "./dto/updatePassword.dto";
import {UpdateUserProfileDTO} from "./dto/userProfile.dto";

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        @Inject(forwardRef(() =>EmailService))
        private emailService: EmailService,

    ) {
    }
    
    async hashPassword(password:string): Promise<string> {
        return bcrypt.hash(password,12)
    }
    
    async register(user: Readonly<CreateUserDto>): Promise<UserDetails | any> {

        try {

            const {username, email, password} = user;

            const existingUser = await this.userService.findUserByEmail(email);

            if (existingUser) throw new HttpException('An account with that email already exists!', HttpStatus.CONFLICT)

            const hashedPassword = await this.hashPassword(password)

            const newUser = await this.userService.userRegistration({username, email, password: hashedPassword});

            const token = this.jwtService.sign({_id: newUser._id}, {expiresIn: "1h"});
            const refreshToken = this.jwtService.sign({_id: newUser._id}, {expiresIn: "7d"});

            const registeredUser = this.userService._getUserDetails(newUser)

            return {registeredUser,token, refreshToken}
        } catch (err) {
            console.log(err);
            return { error: "Something went wrong. Try again." };
        }
    }

    async login(loginUser: LoginDto):Promise<{ user: UserDetails | object; jwt: object} | string> {
        const user = await this.validateUser(loginUser);
        if(!user) {
            throw new HttpException('Credentials invalid',HttpStatus.UNAUTHORIZED)
        }
        const jwt = await this.generateToken(user);
        return {jwt,user}
    }


    async generateToken(user:any) {
        const payload:AuthPayload = {
            _id: user.id,
            username: user.username
        }
        return {
            access_token: this.jwtService.sign(payload, {expiresIn:'2h'}),
            refresh_token: this.jwtService.sign(payload, {expiresIn:'7d'})
        }
    }

    async generateEmailToken(request:any) {
        const payload:EmailPayload = {
            username:request.username,
            email: request.email,
            password: request.password,
            sub: request.sub,
            message:request.message
        }
        return {
            token: this.jwtService.sign(payload),
        }
    }

    async userJwt(signedJwtAccessToken:any){
        try {
            const tokenBody = this.jwtService.decode(signedJwtAccessToken.token)
            console.log(tokenBody)
            return tokenBody
        } catch (err) {
            console.log(err)
            return ({error:"Something went wrong. Try again"})
        }
    }

    async doesPasswordMatch(password:string, hashedPassword:string):Promise<boolean> {
        return bcrypt.compare(password,hashedPassword)
    }
    async validateUser(loginUser:LoginDto): Promise<UserDetails | null | object> {

        try {
            const user = await this.userService.findUserByEmail(loginUser.email);
            if (!user) throw new BadRequestException('User not found');

            const isMatch = await this.doesPasswordMatch(loginUser.password, user.password);
            if(!isMatch) throw new UnauthorizedException('Invalid password');

            return this.userService._getUserDetails(user)

        } catch (err) {
            console.log(err)
            return
        }
    }

    async checkUserExist(user:CreateUserDto): Promise<boolean> {

        try {
            const userEmail = user.email
            const registeredUser = await this.userService.findUserByEmail(userEmail);
            if (!registeredUser) return false

            else return true

        } catch (err) {
            console.log(err)
            return
        }
    }

    async forgotPassword (email:string):Promise<string | void> {
        try {
            const user = await this.userService.findUserByEmail(email)

            if(!user) {
                return "Could not find user with that email"
            } else {
                const resetCode = Math.floor((Math.random()+900000)+1000000).toString();

                user.resetCode = resetCode;
                await user.save();
                const accessToken = this.jwtService.sign({resetCode});

                return await this.emailService.sendEmailResetPassword(accessToken,email)
            }
        }
        catch (err) {
            console.log(err)
            return err
            }
    }

    async resetPassword (email:string, newPassword:string):Promise<UserDetails | string> {

        try {
            const user = await this.userService.findUserByEmail(email)

            if(!user) {
                return "Could not find user with that email"
            } else {

                user.password = await this.hashPassword(newPassword);
                await user.save();

                return this.userService._getUserDetails(user)
            }
        }
        catch (err) {
            console.log(err)
            return
        }
    }

    async currentUser (email:string):Promise<UserDetails | string> {
        try {
            const user = await this.userService.findUserByEmail(email)
            if(!user) {
                throw new HttpException('User activation failed', HttpStatus.UNAUTHORIZED);
            } else {
                return this.userService._getUserDetails(user)
            }
        } catch (err) {
            console.log(err)
            return "There is no user that you are finding"
        }
    }

    async publicProfile (username:string):Promise<UserDetails | string> {
        try {
            const user = await this.userService.findOne(username)
            if(!user) {
                throw new HttpException('User activation failed', HttpStatus.UNAUTHORIZED);
            } else {
                return user
            }
        } catch (err) {
            return "There is no user that you are finding"
        }
    }

    async updatePassword (username:string, updatePassword:UpdatePasswordDto, res):Promise<UserDetails | string | object> {
        try {
            const oldPassword =  updatePassword.oldPassword

            const newPassword =  await this.hashPassword(updatePassword.newPassword)
            let user = await this.userService.findOne(username)
            if(!user) {
                throw new HttpException('User activation failed', HttpStatus.UNAUTHORIZED);
            } else {
                // validate old password
                const isValidPassword = await bcrypt.compare(oldPassword, user.password);
                if (!isValidPassword) {
                    return res.status(400).send('Please enter correct old password');
                }
                user = await this.userService.findOneAndUpdate(username, newPassword)
                return {ok:true , user}
            }

        } catch (err) {
            return res.status(501).send(err + ' Sorry for inconvenience');
        }
    }

    async updateProfile (username:string, updateProfile: UpdateUserProfileDTO):Promise<UserDetails | string | object> {
        try {
            let user = await this.userService.findOne(username)
            if(!user) {
                throw new HttpException('User activation failed', HttpStatus.UNAUTHORIZED);
            } else {
                user = await this.userService.userProfileUpdate(username, updateProfile)
                return {ok:true , user}
            }

        } catch (err) {
            return "There is no user that you are finding";
        }
    }

}
