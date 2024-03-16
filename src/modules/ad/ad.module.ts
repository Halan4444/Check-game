import {forwardRef, Module} from '@nestjs/common';
import { AdController } from './ad.controller';
import { AdService } from './ad.service';
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {jwtConfig} from "../../config/jwt.config";
import {EmailModule} from "../email/email.module";
import {AuthService} from "../auth/auth.service";
import {LocalStrategy} from "../auth/strategies/local.strategy";
import {JwtStrategy} from "../auth/strategies/jwt.strategy";
import {AuthController} from "../auth/auth.controller";
import {AuthModule} from "../auth/auth.module";
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {AdSchema} from "./ad.schema";
import {UserSchema} from "../user/entities/user.schema";

@Module({
  imports: [AuthModule,UserModule, PassportModule,
    JwtModule.register(jwtConfig),
    forwardRef(() =>EmailModule),ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{name:'Ad',schema:AdSchema}])
  ],
  providers: [AdService],
  controllers: [AdController],
  exports: [AdService]
})
export class AdModule {

}
