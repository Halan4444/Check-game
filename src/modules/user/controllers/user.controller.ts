import {Body, Controller, Delete, HttpException, HttpStatus, Post, Put, Req, Res, ValidationPipe} from "@nestjs/common";
import {UserService} from "../services/user.service";
import {ApiTags} from "@nestjs/swagger";
import {UserRegisterRequestDto} from "../dto/userRegister.dto";
import { Request,Response } from 'express';

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {

    }

    @Post('/register')
    async userRegistration(@Body(
        new ValidationPipe({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    ) userRegister: UserRegisterRequestDto
    ){
        try {
            return await this.userService.userRegistration(userRegister)
        } catch (error) {
            throw new HttpException('User activation failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/wishlist')
    async addToWishList(@Body() addItem, @Res() res: Response):Promise<any| null> {
        try {
            const {userId,adId } = addItem;
            const user = await this.userService.addToWishList(userId,adId)
            return res.status(HttpStatus.OK).send(user);
        }catch (err) {
            throw new HttpException('Wishlist Adding Failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete ('/wishlist/:adId')
    async removeFromWishList(@Req() req: Request, @Res() res: Response ):Promise<any | null> {
        try {
            const {adId}  = req.params;
            const {userId} = req.body;
            const user = await this.userService.removeFromWishList(userId,adId);
            return res.status(HttpStatus.OK).send(user);
        }catch (err) {
            console.log(err)
        }
    }

}