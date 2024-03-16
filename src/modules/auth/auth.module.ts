import {forwardRef, Inject, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {LocalStrategy} from "./strategies/local.strategy";
import {UserModule} from "../user/user.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {jwtConfig} from "../../config/jwt.config";
import {EmailModule} from "../email/email.module";


@Module({
    imports: [UserModule, PassportModule,
        JwtModule.register(jwtConfig),
    forwardRef(() =>EmailModule)

    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
}
)
export class AuthModule {}
