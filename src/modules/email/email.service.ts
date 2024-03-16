// src/email/email.service.ts

import {forwardRef, Inject, Injectable} from '@nestjs/common';
import AWS, {SES} from 'aws-sdk';
import {ConfigService} from '@nestjs/config';
import * as dotenv from 'dotenv';
import {AuthService} from "../auth/auth.service";
import {emailTemplate} from "../../common/template/emailTemplate";
import {EmailActiveDto} from "./dto/emailActive.dto";
import $ from "jquery-deferred";

dotenv.config();


@Injectable()
export class EmailService {
    private ses: SES;

    constructor(private configService: ConfigService,
                private authService: AuthService
    ) {
        this.ses = new SES({
            region: process.env.REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }


    async sendEmail(sendEmail:EmailActiveDto): Promise<void | string | {token:string}> {
        try {
        const token = await this.authService.generateEmailToken(sendEmail);

        const content = `<style>
                            .btn-link {
                                border: none;
                                outline: none;
                                background: none;
                                cursor: pointer;
                                color: #0000EE;
                                padding: 0;
                                text-decoration: underline;
                                font-family: inherit;
                                font-size: inherit;
                            }
                        </style>
                         <p>Please click the link below to active your account</p>
                         <form action="${process.env.MAIL_URL}/auth/account-active/${token.token}" method="get">
                            <button type="submit" class="btn-link">Active my account</button>
                         </form>
`

        const replyTo = process.env.EMAIL_FROM

        const params: SES.SendEmailRequest = emailTemplate(sendEmail, content,replyTo, "Active Your Account")

        console.log('Sending email with params:', params, token);

        token.toString()

            await this.ses.sendEmail(params).promise();
            return token
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Error sending email');
        }
    }

    async sendEmailResetPassword (token:string,email:string): Promise<void | string> {
        try {
            const content = `<style>
                            .btn-link {
                                border: none;
                                outline: none;
                                background: none;
                                cursor: pointer;
                                color: #0000EE;
                                padding: 0;
                                text-decoration: underline;
                                font-family: inherit;
                                font-size: inherit;
                            }
                        </style>
                         <p>Please click the link below to get your new password</p>
                         <form id="form-id" action="${process.env.MAIL_URL}/auth/access-account/${email}/${token}" method="get">
                            <button type="submit" class="btn-link">Reset Password</button>
                         </form>
                            `

            const replyTo = process.env.EMAIL_FROM

            const sendEmail = {email}

            const params: SES.SendEmailRequest = emailTemplate(sendEmail, content,replyTo, "Reset Your Password")

            console.log('Sending email with params:', params);

            await this.ses.sendEmail(params).promise();
            return
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Error sending email');
        }
    }

    async registerUser(token:any):Promise<any> {
        const decode = await this.authService.userJwt(token);
        return decode
    }

}
