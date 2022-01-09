import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ForgotPasswordDto {
  @Expose()
  @IsEmail()
  @ApiProperty({
    default: "user@gmail.com",
    description: "The email of the User",
    type: "string",
  })
  email: string;
}

export class VerifyForgotPasswordDto {
  @Expose()
  @IsString()
  @IsEmail()
  @ApiProperty({
    default: "user@gmail.com",
    description: "The email of the User",
    type: "string",
    required: true,
  })
  email: string;

  @Expose()
  @IsString()
  @ApiProperty({
    default: "123456",
    description: "The 6 digit verify code senden to email",
    type: "string",
    required: true,
  })
  code: string;

  @Expose()
  @IsString()
  @ApiProperty({
    default: "123456",
    description: "The new password of the User",
    type: "string",
  })
  password: string;
}
