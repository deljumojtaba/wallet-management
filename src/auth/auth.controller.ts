import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
  Put,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
  Patch,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from "src/tools/baseApiResponse.dto";
import { Messages } from "src/tools/messages";
import { AuthService } from "./auth.service";
import { SuperAdminDto } from "./dto/superadmin.dto";
import { LoginDto, UserDto } from "./dto/user.dto";
import { Response } from "express";
import {
  ForgotPasswordDto,
  VerifyForgotPasswordDto,
} from "./dto/forgot-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  /* :::::::::::::::::::::::::::: register super admin :::::::::::::::::::::::::::: */

  @ApiTags("superadmin")
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse({}),
  })
  @ApiOperation({
    summary: "register for super admin",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Post("/superadmin")
  async registerSuperAdmin(
    @Res() res: Response,
    @Body() superAdminDto: SuperAdminDto
  ): Promise<BaseApiResponse<object>> {
    const data = await this.authService.registerSuperAdmin(superAdminDto);
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

  /* ::::::::::::::::::::::::::::::::: register user :::::::::::::::::::::::::::::: */

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
    summary: "register for user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Post("/signup")
  async registerUser(
    @Res() res: Response,
    @Body() userDto: UserDto
  ): Promise<BaseApiResponse<object>> {
    const data = await this.authService.registerUser(userDto);
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

  /* :::::::::::::::::::::::::::::::: login all user :::::::::::::::::::::::::::::: */

  @ApiTags("user", "superadmin")
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse({}),
  })
  @ApiOperation({
    summary: "login for all user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Post("/login")
  async loginAllUser(
    @Res() res: Response,
    @Body() loginDto: LoginDto
  ): Promise<BaseApiResponse<object>> {
    const data = await this.authService.loginAllUser(loginDto);
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

  /* :::::::::::::::::::::::::::::::: forgot password all user :::::::::::::::::::::::::::::: */

  @ApiTags("user", "superadmin")
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse({}),
  })
  @ApiOperation({
    summary: "forgot password for all user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Post("forgot-password")
  async forgotPassword(
    @Res() res: Response,
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<BaseApiResponse<object>> {
    const data = await this.authService.forgotPassword(forgotPasswordDto);
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

  /* ::::::::::::::::::::::verify forgot password all user :::::::::::::::::::::::::::::: */

  @ApiTags("user", "superadmin")
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse({}),
  })
  @ApiOperation({
    summary: "verify forgot password for all user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Post("verify-forgot-password")
  async verifyForgotPassword(
    @Res() res: Response,
    @Body() verifyForgotPasswordDto: VerifyForgotPasswordDto
  ): Promise<BaseApiResponse<object>> {
    const data = await this.authService.verifyForgotPassword(
      verifyForgotPasswordDto
    );
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
