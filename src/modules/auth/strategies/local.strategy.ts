import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import {LoginDto} from "../dto/login.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(loginUser:LoginDto): Promise<any> {
        const user = await this.authService.validateUser(loginUser);
        console.log(user)
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

    async authenticate(req: any, options?: any): Promise<void> {
        super.authenticate(req, options);
    }
}
