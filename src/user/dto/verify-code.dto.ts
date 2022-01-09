import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class VerifyCodeDto{
    @Expose()
    @IsNotEmpty()
    @ApiProperty({
        description: 'verify code',
    })
    code: string;
}