import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

@Schema({ timestamps: true })
export class Card {
  @Prop({ type: mongoose.Types.ObjectId, ref: "User" })
  user: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        cardHolderName: String,
        cardNumber: String,
        expireMonth: String,
        expireYear: String,
        cvc: String,
        registerCard: String,
        defeultCard: Boolean,
      },
    ],
    required: true,
    default: [],
  })
  cards: [
    {
      cardHolderName: String;
      cardNumber: String;
      expireMonth: String;
      expireYear: String;
      cvc: String;
      registerCard: String;
      defeultCard: Boolean;
    }
  ]; // array of cards
}

export const CardSchema = SchemaFactory.createForClass(Card);
