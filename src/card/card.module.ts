import { Module } from "@nestjs/common";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema, User } from "src/user/schema/user.schema";
import { CardSchema, Card } from "./schema/card.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
