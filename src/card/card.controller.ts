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
import { CardService } from "./card.service";
import * as mongoose from "mongoose";
import { Request, Response } from "express";
import { CardDto } from "./dto/card.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";
import { AuthRequest } from "src/interfaces/auth-request.interface";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/tools/roles.guard";
import { Roles } from "src/auth/tools/roles.decorator";

@Controller("card")
export class CardController {
  constructor(private cardService: CardService) {}

  /* ::::::::::::::::::::::::::::::: create card ::::::::::::::::::::::::::::: */

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
    summary: "add card by user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Post()
  async addCard(
    @Res() res: Response,
    @Req() req: Request,
    @Body() cardDto: CardDto
  ): Promise<BaseApiResponse<object>> {
    const data = await this.cardService.addCard(cardDto, req);
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

  /* ::::::::::::::::::::::::::::::::: update card :::::::::::::::::::::::::::::::: */

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
    summary: "update card user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Put("/:id")
  async updateCard(
    @Param("id") id: string,
    @Res() res: Response,
    @Body() cardDto: CardDto,
    @Req() req: Request
  ): Promise<BaseApiResponse<object>> {
    const data = await this.cardService.updateCard(id, cardDto, req);
    if (data) {
      res.status(HttpStatus.OK).json({
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

  /* ::::::::::::::::::::::::::::::: get all card ::::::::::::::::::::::::::::: */

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
    summary: "get all card by user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Get()
  async getAllCard(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<BaseApiResponse<object>> {
    const data = await this.cardService.getAllCard(req);
    if (data) {
      res.status(HttpStatus.OK).json({
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

  /* ::::::::::::::::::::::::::::::::::: get card ::::::::::::::::::::::::::::::::: */

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
    summary: "get card by user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Get("/:id")
  async getCard(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<BaseApiResponse<object>> {
    const data = await this.cardService.getCard(id, req);
    if (data) {
      res.status(HttpStatus.OK).json({
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

  /* :::::::::::::::::::::::::::::::::: delete card ::::::::::::::::::::::::::::::: */

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
    summary: "delete card by user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Delete("/:id")
  async deleteCard(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<BaseApiResponse<object>> {
    const data = await this.cardService.deleteCard(id, req);
    if (data) {
      res.status(HttpStatus.OK).json({
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
