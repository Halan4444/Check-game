import {JwtModuleOptions} from "@nestjs/jwt";
import appConfig from "./app.config";

export const jwtConfig: JwtModuleOptions = {
    secret: appConfig().appSecret,
    signOptions:{expiresIn:'1d'},
}
