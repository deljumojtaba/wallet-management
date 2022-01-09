import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDto } from "src/auth/dto/user.dto";
import { Messages } from "src/tools/messages";
import { deleteFile } from "src/tools/utils";
import * as _ from "lodash";
import { ProfileDto, AvatarOperationDto } from "./dto/profile.dto";
import { User } from "./schema/user.schema";
import { VerifyCode } from "./schema/verify-code.schema";
import { mailer } from "src/tools/mailer";
import { VerifyCodeDto } from "./dto/verify-code.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { Request } from "express";
import { uploadImage } from "src/tools/upload-image";
import * as bcrypt from "bcrypt";
import { UpdateUserDto, UserAvatarDto } from "src/user/dto/update-user.dto";
import { unlinkFile } from "src/tools/unlinkFile";
import { comparePassword } from "src/tools/utils";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(VerifyCode.name) private verifyCodeModel: Model<VerifyCode>,
    private readonly mailerService: MailerService
  ) {}

  /* :::::::::::::::::::::::::::: send email verify :::::::::::::::::::::::::::::::: */

  async sendEmailVerify(req: any): Promise<{}> {
    const userId = req.user["_id"];

    /* get user from db */
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ConflictException(Messages.USER_NOT_FOUND);
    }

    const email: string = user.email;
    let fullName: string = user.fullName;

    if (user.isEmailVerified) {
      throw new ConflictException(
        "The requested email has already been verified"
      );
    }

    const verifyCode = await this.verifyCodeModel.findOne({ user: userId });
    if (verifyCode) {
      throw new ConflictException("The activation code has already been sent");
    }

    /* generate code for verfy email */
    let code = String(Math.floor(100000 + Math.random() * 900000));

    const createVerifyCode = await this.verifyCodeModel.create({
      user: userId,
      code,
    });
    if (!createVerifyCode) {
      throw new ConflictException("make verify code has problem");
    }

    const sendEmail = mailer(fullName, code, email, this.mailerService);
    if (!sendEmail) {
      throw new ConflictException("Unsuccessful submission");
    }

    return { message: "Submission successfuly" };
  }
  /* :::::::::::::::::::::::::::::::: end ::::::::::::::::::::::::::::::::::: */

  /* :::::::::::::::::::::::: check email verify code ::::::::::::::::::::::: */

  async checkEmailVerifyCode(
    req,
    verifyCodeDto: VerifyCodeDto
  ): Promise<object> {
    const { code }: VerifyCodeDto = verifyCodeDto;
    const userId: string = req.user["_id"];

    /* get user from db */
    const user = await this.userModel
      .findById(userId)
      .select("-password -__v -updatedAt")
      .populate("interests", "description image title")
      .select("-__v -updatedAt")
      .select("-password -__v -updatedAt")
      .populate("accounts", "type")
      .select("-__v -updatedAt");
    if (!user) {
      throw new ForbiddenException(Messages.PREMISSION_DENIED);
    }

    if (user.isEmailVerified) {
      throw new ConflictException(
        "The requested email has already been verified"
      );
    }

    const findCode = await this.verifyCodeModel.findOneAndDelete(
      { code, user: userId },
      { new: true }
    );
    if (!findCode) {
      throw new NotFoundException(
        "Validation code is incorrect ! please try again"
      );
    }

    user.isEmailVerified = true;
    const item = await user.save();

    return item;
  }
  /* :::::::::::::::::::::::::::::::: end ::::::::::::::::::::::::::::::::::: */

  /* ::::::::::::::::::::::::::: get profile :::::::::::::::::::::::::::::: */

  async getProfile(req: Request): Promise<object> {
    const id = req.user["_id"];

    const item = await this.userModel
      .findById(id)
      .select("-password -__v -updatedAt")
      .lean();

    if (!item) {
      throw new ForbiddenException(Messages.PREMISSION_DENIED);
    }

    return item;
  }

  /* :::::::::::::::::::::::::::::::: end :::::::::::::::::::::::::::::::::: */

  /* :::::::::::::::::::::::::::: update profile ::::::::::::::::::::::::::: */

  async updateProfile(
    req: Request,
    updateUserDto: UpdateUserDto
  ): Promise<object> {
    let {
      fullName,
      newPassword,
      oldPassword,
      email,
      gender,
      birthday,
      mobile,
    } = updateUserDto;

    const id = req.user["_id"];

    const getUser = await this.userModel
      .findById(id)
      .select("+password -__v -updatedAt");

    if (!getUser) {
      throw new NotFoundException(Messages.USER_NOT_FOUND);
    }
    getUser.fullName = fullName || getUser.fullName;
    getUser.email = email || getUser.email;
    getUser.birthday = birthday || getUser.birthday;
    getUser.mobile = mobile || getUser.mobile;
    getUser.gender = gender || getUser.gender;

    const existEmail = await this.userModel.findOne({
      email: email,
      _id: { $ne: id },
    });

    if (existEmail) {
      throw new ConflictException(Messages.EMAIL_ALREADY_EXISTS);
    }
    //email verified handle
    email
      ? (getUser.isEmailVerified = false)
      : (getUser.isEmailVerified = getUser.isEmailVerified);

    // check old password
    // .................................. change password ........................//

    if (newPassword && oldPassword) {
      const isMatch = await comparePassword(oldPassword, getUser.password);
      if (!isMatch) {
        throw new ConflictException(Messages.WRONG_CREDENTIALS);
      }
      //hash password
      const salt = await bcrypt.genSalt();
      const newPass = await bcrypt.hash(newPassword, salt);

      getUser.password = newPass || getUser.password;
    }
    await getUser.save();

    const item = JSON.parse(JSON.stringify(getUser));
    delete item["password"];

    return item;
  }

  /* :::::::::::::::::::::::::::::::::::: end :::::::::::::::::::::::::::::::::::: */

  /* :::::::::::::::::::::::::: update and delete user image :::::::::::::::::::::::: */

  async updateAndDeleteUserImage(
    req: Request,
    file: Express.Multer.File,
    userAvatarDto: UserAvatarDto,
    avatarOperationDto: AvatarOperationDto
  ): Promise<string> {
    const id = req.user["_id"];

    //edit avatar
    if (avatarOperationDto.operation === "edit") {
      const getUser = await this.userModel.findById(id);

      if (file) {
        uploadImage(file, userAvatarDto, "users", getUser);
        getUser.userAvatar = userAvatarDto.userAvatar;
      } else {
        getUser.userAvatar = getUser.userAvatar;
      }

      await getUser.save();
      return getUser.userAvatar;
    }

    //delete avatar
    if (avatarOperationDto.operation === "delete") {
      const getUser = await this.userModel.findById(id);
      const imageName = getUser.userAvatar.split("/")[1];

      let isDeleted = unlinkFile("users", imageName);
      isDeleted
        ? (getUser.userAvatar = "defaults/userAvatar.png")
        : (isDeleted = isDeleted);
      await getUser.save();

      return isDeleted ? "image deleted" : null;
    }

    return null;
  }

  /* ::::::::::::::::::::::::::::::::::::: end :::::::::::::::::::::::::::::::::::::: */
}
