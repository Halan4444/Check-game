import { Injectable, NestMiddleware } from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import { Morgan } from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
    constructor(private morgan: Morgan<any, any>) {}

    use(req: Request, res: Response, next: NextFunction) {
        this.morgan('dev', { stream: process.stdout })(req, res, next);
    }
}
