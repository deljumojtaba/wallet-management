import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { VerifyCode, VerifyCodeSchema } from "./schema/verify-code.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: VerifyCode.name, schema: VerifyCodeSchema },
    ]),

    MailerModule.forRoot({
      transport: {
        service: "Gmail", // your email service
        auth: {
          user: "noreply@gmail/com", // your email account
          pass: "MW>qdL2S,y]9k$w7@S3D", // your email password
        },
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
