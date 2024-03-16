import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {UserRegisterRequestDto} from "../dto/userRegister.dto";
import {Model} from 'mongoose'
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../entities/user.schema";
import {UserDetails} from "../entities/user.interface";
import {UpdateUserProfileDTO} from "../../auth/dto/userProfile.dto";
import {UserRoles} from "../enums/user.enum";


@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private readonly userModel:Model<User>
    ) {}
    _getUserDetails(user:UserDocument): UserDetails {
        return {
            id:user._id,
            username:user.username,
            password: user.password,
            email: user.email,
            address: user.address,
            company: user.company,
            enquiredProperties: user.enquiredProperties,
            name: user.name,
            phone: user.phone,
            photo: user.photo,
            resetCode: user.resetCode,
            role: user.role,
            wishList: user.wishList,
            active:user?.active,
            createdAt: user.createdAt,
        }
    }

    async userRegistration (userRegister: UserRegisterRequestDto):Promise<UserDocument> {
        const user = await new this.userModel(userRegister).save();
        return user;
    }

    async userProfileUpdate (username:string, updateUserProfile: UpdateUserProfileDTO):Promise<UserDetails> {
        let userProfile = await this.userModel.findOne({username}).exec();

        userProfile.email = updateUserProfile.email;
        userProfile.name = updateUserProfile.name;
        userProfile.company = updateUserProfile.company;
        userProfile.address = updateUserProfile.address;
        userProfile.phone = updateUserProfile.phone;
        userProfile.photo = updateUserProfile.photo;

        await new this.userModel(userProfile).save()
        return this._getUserDetails(userProfile);
    }

    async userActivation (userEmail:string):Promise<UserDetails | string | object> {
        let activeUser = await this.findUserByEmail(userEmail);
        activeUser.active = true;

        await new this.userModel(activeUser).save();
        return activeUser;
    }

    async findUserByEmail(email:string):Promise<UserDocument | null> {
        return this.userModel.findOne({email}).exec();
    }

    async findUserById(id:string):Promise<UserDetails | null> {
        const user = await this.userModel.findById(id).exec();
        if(!user) return null;
        return this._getUserDetails(user)
    }

    async findOne(username:string):Promise<UserDetails | null> {
        const user = await this.userModel.findOne({username}).exec();
        if(!user) return null;
        return this._getUserDetails(user)
    }

    async findOneAndUpdate (username:string, password:string):Promise<UserDetails | null> {
        const user = await this.userModel.findOneAndUpdate({username}, {password:password}).exec();
        if(!user) return null;
        return this._getUserDetails(user)
    }

    async findByIdAndUpdate (userId:string):Promise<any | null> {
        const user = await this.userModel.findByIdAndUpdate(userId, {$addToSet:{role:UserRoles.SELLER}},{new:true}).exec();
        if(!user) return null;
        return this._getUserDetails(user)
    }

    async addToWishList (userId:string, adId:string):Promise<UserDetails | null> {
        const user = await this.userModel.findByIdAndUpdate(userId, {$addToSet:{wishList:adId}},{new:true}).exec();
        if(!user) return null;
        return this._getUserDetails(user);
    }

    async removeFromWishList (userId:string, adId:any):Promise<UserDetails | null> {
        console.log(userId,adId)
        const user = await this.userModel.findByIdAndUpdate(userId, {$pull:{wishList:adId}},{new:true}).exec();
        if(!user) return null;
        console.log(user)
        return this._getUserDetails(user);
    }

}
