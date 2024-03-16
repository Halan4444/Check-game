import {
    BadRequestException,
    Body,
    Controller, Get, HttpStatus,
    Post,
    Req, Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthService} from "../auth/auth.service";
import {EmailService} from "../email/email.service";
import {UserService} from "../user/services/user.service";
import {JwtAuthGuard} from "../auth/guards/jwtAuth.guard";
import {UserDetails} from "../user/entities/user.interface";
import {AdService} from "./ad.service";
import * as http from "http";
import {nanoid} from "nanoid";
import {config} from "aws-sdk";
import {FileInterceptor} from "@nestjs/platform-express";
import {Response} from "express";
import {Ad} from "./ad.schema";

@ApiTags('Ad')
@Controller('ad')
export class AdController {
    constructor(
        private authService:AuthService,
        private adService:AdService,
    ) {}

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('upload-image')
    async uploadImage(@UploadedFile() file, @Res() response: Response):Promise<any| null> {
        try {
            const uploadImage = await this.adService.uploadImage(file)
            return response.status(HttpStatus.OK).send({uploadStatus:"Ok",uploadImage});
        } catch (err) {
            console.log(err)
            throw new BadRequestException({error:"Upload Image Failed"})
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('delete-image')
    async deleteImage(@Body()fileKey , @Res() response: Response):Promise<any| null> {
        try {
            const deleteFile = await this.adService.deleteImage(fileKey)
            return response.status(HttpStatus.OK).send({deleteStatus:"Ok",deleteFile});
        } catch (err) {
            console.log(err)
            throw new BadRequestException({error:"Delete Image Failed"})
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('createAd')
    async createAd(@Req() postAd , @Res() response: Response):Promise<any| null> {
        try {
            const createAd = postAd.body
            const userId = postAd.user.id
            const ad = await this.adService.createAd(createAd,userId)
            return response.status(HttpStatus.OK).send({createStatus:"Ok",ad});
        } catch (err) {
            console.log(err)
            throw new BadRequestException({error:"Cannot Create Ad"})
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('ads')
    async getAd( @Res() response: Response):Promise<any| null> {
        try {
            const findingAds = await this.adService.findAd()
            return response.status(HttpStatus.OK).send({findingStatus:"Ok",findingAds});
        } catch (err) {
            console.log(err)
            throw new BadRequestException({error:"Cannot Find Ad"})
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('ads/:slug')
    async getDetailedAd(@Req()req, @Res() response: Response):Promise<any| null> {
        try {
            const detailedAd = await this.adService.detailedAd(req)
            return response.status(HttpStatus.OK).send({findingStatus:"Ok",detailedAd});
        } catch (err) {
            console.log(err)
            throw new BadRequestException({error:"Cannot Find Detail Ad"})
        }
    }
}
