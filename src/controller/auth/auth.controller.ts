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

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  private readonly ACCESS_TOKEN_MAX_AGE = parseInt(
    process.env.ACCESS_TOKEN_EXPIRES_IN ?? '86400',
    10,
  );
  private readonly REFRESH_TOKEN_MAX_AGE = parseInt(
    process.env.REFRESH_TOKEN_EXPIRES_IN ?? '2592000',
    10,
  );

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie('access_token', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: this.ACCESS_TOKEN_MAX_AGE * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: this.REFRESH_TOKEN_MAX_AGE * 1000,
    });
  }

  @HttpCode(201)
  @Post('web/register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, expiresIn } =
      await this.authService.register(registerUserDto);

    this.setAuthCookies(res, accessToken, refreshToken);

    return {
      message: 'Registration successful',
      statusCode: 201,
      expiresIn,
    };
  }

  @HttpCode(200)
  @Post('web/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, expiresIn } =
      await this.authService.login(loginUserDto);

    this.setAuthCookies(res, accessToken, refreshToken);

    return {
      message: 'Login successful',
      statusCode: 200,
      expiresIn,
    };
  }

  @HttpCode(200)
  @Post('web/refresh')
  async refreshToken(@Res({ passthrough: true }) res: Response) {
    const refreshToken = (res.req.cookies as Record<string, string>)[
      'refresh_token'
    ];
    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    } = await this.authService.refresh({ refreshToken });
    this.setAuthCookies(res, accessToken, newRefreshToken);

    return {
      message: 'Token refreshed successfully',
      statusCode: 200,
      expiresIn,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
