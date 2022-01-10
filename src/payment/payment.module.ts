import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema, User } from "src/user/schema/user.schema";
import { Pay, PaySchema } from "./schema/pay.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Pay.name, schema: PaySchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
