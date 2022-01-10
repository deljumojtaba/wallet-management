import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

@Schema({ timestamps: true })
export class Pay {
  @Prop({ type: mongoose.Types.ObjectId, ref: "User" })
  user: mongoose.Types.ObjectId;

  @Prop({ type: String, trim: true })
  code: string;

  @Prop({ type: String, trim: true })
  price: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: "Card", required: false })
  card: mongoose.Types.ObjectId;

  @Prop({ type: String, trim: true, required: false })
  paymentId: string;

  @Prop({ type: String, trim: true, required: false })
  conversationId: string;

  @Prop({ type: String, trim: true })
  status: string;

  @Prop({ type: String, trim: true, required: false })
  errorCode: string;

  @Prop({ type: Boolean, trim: true, default: false })
  verify: boolean;
}

export const PaySchema = SchemaFactory.createForClass(Pay);
