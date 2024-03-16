

import {PassportStrategy} from '@nestjs/passport'
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Strategy} from "passport-jwt";
import { ExtractJwt } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.TOKEN_KEY
        });
    }

    async validate(payload: any) {
        try {
            return {
                id: payload._id,
                username: payload.username,
                tenant: 'amitav'
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid token', error.message);
        }
    }

}


