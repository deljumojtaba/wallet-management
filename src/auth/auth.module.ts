import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { User, UserSchema } from "src/user/schema/user.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { MailerModule } from "@nestjs-modules/mailer";
import {
  VerifyCode,
  VerifyCodeSchema,
} from "src/user/schema/verify-code.schema";
import { Card, CardSchema } from "src/card/schema/card.schema";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: VerifyCode.name, schema: VerifyCodeSchema },
      { name: Card.name, schema: CardSchema },
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
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
