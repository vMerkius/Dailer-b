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
import { UserService } from '../../service/user/user.service';
import { CreateUserDto } from '../../integration/user/dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(201)
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.userService.register(createUserDto);

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

  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.userService.login(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
