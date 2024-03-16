import {Body, Controller, HttpStatus, Post, ValidationPipe, Req, UseGuards} from "@nestjs/common";
import {ApiBadGatewayResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {SendEmailDto} from "./dto/email.dto";
import {EmailService} from "./email.service";
import {AuthService} from "../auth/auth.service";
import {CreateUserDto} from "../auth/dto/create-user.dto";
import {LocalAuthGuard} from "../auth/guards/localAuth.guard";
import {LoginDto} from "../auth/dto/login.dto";


@ApiTags('Email')
@Controller('email')

export class EmailController {

    constructor(
        private emailService:EmailService,
        private authService:AuthService,
    ) {
    }


    @Post('login')
    @ApiCreatedResponse({
        description: 'Login into System ',
    })
    async login(@Body() loginDto: LoginDto): Promise<any> {
        return this.authService.generateEmailToken(loginDto);
    }


    @Post('/send-email')
    async sendEmail(@Body(new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),)registerEmail:SendEmailDto): Promise<string> {
        try {
            await this.emailService.sendEmail(registerEmail);
            return 'Email sent successfully!';
        } catch (error) {
            return 'Failed to send email';
        }
    }

    @Post('/register')
    async registerByEmail(@Body(new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),)registerEmail:SendEmailDto): Promise<string> {
        try {
            await this.emailService.registerUser(registerEmail);
            return 'Token Is!';
        } catch (error) {
            return 'Failed check token';
        }
    }





}
