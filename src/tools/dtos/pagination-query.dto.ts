import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Expose } from "class-transformer";

export class PaginationDto {
  @IsOptional()
  @Expose()
  @ApiProperty({
    required: false,
  })
  page?: number;

  @IsOptional()
  @Expose()
  @ApiProperty({
    required: false,
  })
  search?: string;
}
