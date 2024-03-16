import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import AWS, {S3, SES} from 'aws-sdk';
import {ConfigService} from "@nestjs/config";
import {AuthService} from "../auth/auth.service";
import {type} from "os";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import {UserDetails} from "../user/entities/user.interface";
import {CreateAdDto} from "./dto/createAd.dto";
import {GOOGLE_GEOCODER} from "../../config/app.config";
import {Ad} from "./ad.schema";
import {UserService} from "../user/services/user.service";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User} from "../user/entities/user.schema";
import slugify from "slugify";
import { nanoid } from 'nanoid'
import {geoBackup} from "../../app.utils";
@Injectable()
export class AdService {
    private s3: S3;
    constructor(private configService: ConfigService,
                private authService: AuthService,
                private userService: UserService,
                @InjectModel('Ad') private readonly adModel:Model<Ad>

    ) {
        this.s3 = new S3({
            region: process.env.REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }

    async uploadImage(file):Promise<null | string | object> {
        const {originalname} = file
        const bucketS3 = 'realist-bucket-lan';
        return await this.uploadS3(file.buffer,bucketS3,originalname);
    }

    async deleteImage (fileKey):Promise<null | string | object> {
        const {Key} = fileKey
        const bucketS3 = 'realist-bucket-lan';
        return await this.removeImageS3(bucketS3,Key);
    }


    async uploadS3(file, bucket,name):Promise<null | string | object> {

        const params = {
            Bucket:bucket,
            Key: name ,
            Body: file,
            ACL:"public-read",
            ContentEncoding:"base64",
            ContentType:`image/${type}`
        }

        return new Promise((resolve, reject) => {
             this.s3.upload(params,(err,data) =>{
                 if(err) {
                     Logger.error(err);
                     reject(err.message);
                 }
                 resolve(data)
             })
        })

    }

    async removeImageS3 (bucket,fileKey):Promise<null | string | object> {
        try {
            const deleteFile = await  this.s3.deleteObject({
                Bucket: bucket,
                Key: fileKey
            }).promise();
            return deleteFile
        } catch (err) {
            console.log(err)
            return "Cannot delete Image"
        }
    }

    async createAd(createAd: CreateAdDto, userId:string):Promise<null | string | object> {
        try{
            const {type, address, price} = createAd
            // let geo = await GOOGLE_GEOCODER.geocode(address)
            // console.log(geo)
            // if (!geo) {
            // }
            const geo = geoBackup

            const ad = await new this.adModel(
                {...createAd,
                    postedBy:userId,
                    location:{
                        type:["Point"],
                        coordinate: [geo?.[0]?.longitude, geo?.[0]?.latitude]
                    },
                    googleMap: geo,
                    slug: slugify(`${type}-${address}-${price}-${nanoid(6)}`)
            }).save()
            const user = await this.userService.findByIdAndUpdate(userId)
            return {user,ad}
        } catch (err) {
            console.log(err)
            return "Cannot Create Ad"
        }
    }

    async findAd ():Promise<null | string | object> {
        try {
           const findingAdForSell = await this.adModel.find({action:"Sell"})
               .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
               .sort({createdAt: -1})
               .limit(12);

            const findingAdForRent = await this.adModel.find({action:"Rent"})
                .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
                .sort({createdAt: -1})
                .limit(12);

           return {findingAdForSell,findingAdForRent }
        } catch (err) {
            console.log(err)
            return "Cannot find Ad"
        }
    }

    async detailedAd(req):Promise <null | string | object >{
        try {
            const ad:any = await this.adModel.findOne({slug: req.params.slug}).populate(
                "postedBy",
                "name username email phone company photo.Location"
            )

            //related
            const related = await this.adModel.find({
                _id:{$ne:ad?._id},
                action: ad?.action,
                type: ad?.type,
                address: {
                    $regex: ad?.googleMap[0]?.city,
                    $options:"i"
                }
            })
                .limit(3)
                .select("-photos.Key -photos.kry -photos.ETag -photos.Bucket -googleMap")

            return {ad, related}
        } catch (err) {
            console.log(err)
            return "Cannot Read Ad"
        }
    }


}
