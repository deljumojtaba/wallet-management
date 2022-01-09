import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
import * as mongoose from "mongoose";

export class CardDto {
  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "untitled cardHolderName",
    required: false,
  })
  cardHolderName: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "untitled cardNumber",
    required: false,
  })
  cardNumber: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "untitled expireMonth",
    required: false,
  })
  expireMonth: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "untitled expireYear",
    required: false,
  })
  expireYear: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "untitled cvc",
    required: false,
  })
  cvc: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "untitled registerCard",
    required: false,
  })
  registerCard: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "boolean",
    default: false,
    required: false,
  })
  defeultCard: string;
}
