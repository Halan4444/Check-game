// src/email/email.module.ts

import {forwardRef, Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import {EmailController} from "./email.controller";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";

@Module({
    imports: [UserModule,ConfigModule.forRoot({ isGlobal: true }),AuthModule
    ],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
