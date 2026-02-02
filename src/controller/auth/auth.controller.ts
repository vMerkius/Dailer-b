import type { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService, UserService } from 'src/service';
import { RegisterUserDto, LoginUserDto } from 'src/integration';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(201)
  @Post('web/register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.register(registerUserDto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Registration successful',
      statusCode: 201,
    };
  }

  @Post('web/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.login(loginUserDto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      statusCode: 200,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
