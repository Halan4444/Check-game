import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from '@nestjs/mongoose'
import { UserModule } from './modules/user/user.module';
import {EmailService} from "./modules/email/email.service";
import {EmailModule} from "./modules/email/email.module";
import {ConfigModule} from "@nestjs/config";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {jwtConfig} from "./config/jwt.config";
import {PassportModule} from "@nestjs/passport";
import {EmailController} from "./modules/email/email.controller";
import {AuthService} from "./modules/auth/auth.service";
import {UserService} from "./modules/user/services/user.service";
import {LocalStrategy} from "./modules/auth/strategies/local.strategy";
import {JwtStrategy} from "./modules/auth/strategies/jwt.strategy";
import {AuthModule} from "./modules/auth/auth.module";
import {AuthController} from "./modules/auth/auth.controller";
import {UserController} from "./modules/user/controllers/user.controller";
import { AdModule } from './modules/ad/ad.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/realist-udemy'),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register(jwtConfig),
    PassportModule,
    EmailModule,
    AdModule,
  ],

  controllers: [AppController,EmailController,AuthController,UserController],
  providers: [AppService],
})
export class AppModule {
}
