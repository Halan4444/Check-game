import {Body, Controller, Get, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {EmailService} from "./modules/email/email.service";
import {SendEmailDto} from "./modules/email/dto/email.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly emailService: EmailService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api')
  getData():string {
    return 'hello from nodeJs'
  }

  @Post('/send-email')
  async sendEmail(@Body()registerEmail:SendEmailDto): Promise<string> {
    try {
      await this.emailService.sendEmail(registerEmail);
      return 'Email sent successfully!';
    } catch (error) {
      return 'Failed to send email';
    }
  }
}
