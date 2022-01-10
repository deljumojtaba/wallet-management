import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  Put,
  Query,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Patch,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from "src/tools/baseApiResponse.dto";
import { PaginationDto } from "src/tools/dtos/pagination-query.dto";
import { Messages } from "src/tools/messages";
import { PaymentService } from "./payment.service";
import * as mongoose from "mongoose";
import { Request, Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";
import { AuthRequest } from "src/interfaces/auth-request.interface";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/tools/roles.guard";
import { Roles } from "src/auth/tools/roles.decorator";
import { ChargeWalletDto } from "./dto/charge-wallet.dto";

@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  /* :::::::::::::::::::::::::::::::  Charge wallet ::::::::::::::::::::::::::::: */

  @ApiTags("user")
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse({}),
  })
  @ApiOperation({
    summary: "Charge wallet by user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Post()
  async chargeWallet(
    @Res() res: Response,
    @Req() req: Request,
    @Body() chargeWalletDto: ChargeWalletDto
  ): Promise<BaseApiResponse<object>> {
    const data = await this.paymentService.chargeWallet(chargeWalletDto, req);
    if (data) {
      res.status(HttpStatus.CREATED).json({
        data,
        success: true,
        msg: Messages.PPD_SUCCESS,
        meta: {},
      });
      return;
    } else {
      throw new InternalServerErrorException(Messages.PPD_FAILURE);
    }
  }

  /* ::::::::::::::::::::::::::::::::::::: end :::::::::::::::::::::::::::::::::::: */
}
