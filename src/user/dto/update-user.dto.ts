import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
} from "class-validator";
import * as mongoose from "mongoose";

export class UpdateUserDto {
  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty({
    required: false,
    default: "",
  })
  fullName: string;

  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty({
    required: false,
    default: "",
  })
  mobile: string;

  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty({
    required: false,
    default: "20/3/2000",
  })
  birthday: string;

  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty({
    required: false,
    enum: ["male", "female", "other", "unknown"],
    default: "unknown",
    description: '"edit" OR "delete"',
  })
  gender: string;

  @IsOptional()
  @Expose()
  @IsEmail()
  @IsString()
  @ApiProperty({
    required: false,
    default: "",
  })
  email: string;

  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty({
    required: false,
    default: "",
  })
  newPassword: string;

  @IsOptional()
  @Expose()
  @IsString()
  @ApiProperty({
    required: false,
    default: "",
  })
  oldPassword: string;
}
//user avatar dto
export class UserAvatarDto {
  @Expose()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: "string",
    format: "binary",
  })
  userAvatar: string;
}

//user setting dto
export class UserSettingDto {
  @Expose()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: false,
  })
  block: boolean;
}
