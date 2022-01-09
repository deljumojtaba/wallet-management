import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  Query,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { diskStorage } from "multer";
import { Roles } from "src/auth/tools/roles.decorator";
import { RolesGuard } from "src/auth/tools/roles.guard";
import {
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from "src/tools/baseApiResponse.dto";
import { Messages } from "src/tools/messages";
import { AvatarOperationDto, ProfileDto } from "./dto/profile.dto";
import { VerifyCodeDto } from "./dto/verify-code.dto";
import { UserService } from "./user.service";
import { Request, Response } from "express";
import { imageFileFilter } from "src/tools/file-filter";
import { UpdateUserDto, UserAvatarDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  /* ::::::::::::::::::::::::::::::::: send email verify ::::::::::::::::::::::::::::::: */

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
    summary: "send email verify by user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Get("/send-email-verify")
  async sendEmailVerify(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<BaseApiResponse<object>> {
    const data = await this.userService.sendEmailVerify(req);
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

  /* ::::::::::::::::::::::::::::::: check email verify ::::::::::::::::::::::::::: */

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
    summary: "check email verify by user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Post("/check-email-verify")
  async checkEmailVerify(
    @Req() req: Request,
    @Res() res: Response,
    @Body() verifyCodeDto: VerifyCodeDto
  ): Promise<BaseApiResponse<object>> {
    const data = await this.userService.checkEmailVerifyCode(
      req,
      verifyCodeDto
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

  /* ::::::::::::::::::::::::::::::::: get profile ::::::::::::::::::::::::::::::: */

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
    summary: "get profile user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Get("/profile")
  async getProfile(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<BaseApiResponse<{}>> {
    const data = await this.userService.getProfile(req);
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

  /* ::::::::::::::::::::::::::::::::: uodate user profile ::::::::::::::::::::::::::::: */

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
    summary: "update profile by user",
    description:
      "For change gender fild send one string from [male, female, other] ==== for change password send old password and new password ofter change email isEmailVerified==> false",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Put("/update-profile")
  async registerSection2(
    @Res() res: Response,
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<BaseApiResponse<object>> {
    const data = await this.userService.updateProfile(req, updateUserDto);
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

  /* :::::::::::::::::::::::::: update and delete user image :::::::::::::::::::::: */

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
    summary: "update and delete user avatar by user",
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("userAvatar", {
      dest: "./uploads/users",
      fileFilter: imageFileFilter,
    })
  )
  @Put("/avatar")
  async updateAndDeleteUser(
    @Res() res: Response,
    @Body() userAvatarDto: UserAvatarDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Query() avatarOperationDto: AvatarOperationDto
  ): Promise<BaseApiResponse<{}>> {
    const data = await this.userService.updateAndDeleteUserImage(
      req,
      file,
      userAvatarDto,
      avatarOperationDto
    );
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
