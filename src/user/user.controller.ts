import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  HttpException,
  HttpStatus,
  Delete,
  Put,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import dataSource from '../data.source';
import paths from '../enums/constants.api';
import { v4, validate } from 'uuid';

interface user {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

interface CreateUserDto {
  login: string;
  password: string;
}

interface UpdatePasswordDto {
  oldPassowrd: string;
  newPassword: string;
}

@Controller(paths.USER)
export class UserController {
  @Get()
  @HttpCode(StatusCodes.OK)
  getAll() {
    return dataSource.users;
  }

  @Get(':id')
  @HttpCode(StatusCodes.OK)
  getOne(@Param('id') id: string): user | string {
    if (!validate(id)) {
      throw new HttpException('id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const user = dataSource.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() CreateUserDto: CreateUserDto): user | string {
    const { login, password } = CreateUserDto;
    if (login === undefined || password === undefined) {
      throw new HttpException(
        'not contain all required fileds',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUserId = v4();
    const newUser = {
      id: newUserId,
      login,
      password,
      version: 0,
      createdAt: Date.parse(String(new Date())),
      updatedAt: Date.parse(String(new Date())),
    };
    dataSource.users.push(newUser);
    return newUser;
  }

  @Put(':id')
  @HttpCode(StatusCodes.OK)
  update(
    @Body() UpdatePasswordDto: UpdatePasswordDto,
    @Param('id') id: string,
  ): user | string {
    if (!validate(id)) {
      throw new HttpException('id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const user = dataSource.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const { oldPassowrd, newPassword } = UpdatePasswordDto;
    if (user.password !== oldPassowrd) {
      throw new HttpException('wrong old password', HttpStatus.FORBIDDEN);
    }
    user.password = newPassword;
    user.version = user.version += 1;
    user.updatedAt = Date.parse(String(new Date()));
    return user;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id') id: string): user[] {
    if (!validate(id)) {
      throw new HttpException('id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const user = dataSource.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const newUsers = dataSource.users.filter((user) => user.id !== id);
    return (dataSource.users = newUsers);
  }
}
