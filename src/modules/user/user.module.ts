import { Module } from '@nestjs/common';
import {UserService} from "./services/user.service";
import {UserController} from "./controllers/user.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "./entities/user.schema";
import {AuthModule} from "../auth/auth.module";



@Module({
    controllers: [UserController],
    imports:[MongooseModule.forFeature([{name:'User',schema:UserSchema}])],
    exports: [UserService],
    providers: [UserService]})
export class UserModule {

}
