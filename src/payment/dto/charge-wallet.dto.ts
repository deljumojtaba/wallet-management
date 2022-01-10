import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
import * as mongoose from "mongoose";

export class ChargeWalletDto {
  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "John Doe",
    required: false,
  })
  cardHolderName: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "5528790000000008",
    required: false,
  })
  cardNumber: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "12",
    required: false,
  })
  expireMonth: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "2030",
    required: false,
  })
  expireYear: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "123",
    required: false,
  })
  cvc: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "0",
    required: false,
  })
  registerCard: string;

  @Expose()
  @IsOptional()
  @ApiProperty({
    type: "string",
    default: "0",
    required: true,
  })
  price: string;
}
