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
import { Album, CreateAlbumDto, UpdateAlbumDto } from './types';

@Controller(paths.ALBUM)
export class AlbumController {
  @Get()
  @HttpCode(StatusCodes.OK)
  getAll() {
    return dataSource.albums;
  }

  @Get(':id')
  @HttpCode(StatusCodes.OK)
  getOne(@Param('id') id: string): Album | string {
    if (!validate(id)) {
      throw new HttpException('Album id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const album = dataSource.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() CreateAlbumDto: CreateAlbumDto): Album | string {
    const { name, year, artistId } = CreateAlbumDto;

    if (name === undefined || year === undefined || artistId === undefined) {
      throw new HttpException(
        'not contain all required fileds',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof name !== 'string' || typeof year !== 'number') {
      throw new HttpException(
        'not contain all required fileds',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newAlbumId = v4();
    const newAlbum = {
      id: newAlbumId,
      name,
      year,
      artistId,
    };
    dataSource.users.push(newAlbum);
    return newAlbum;
  }

  @Put(':id')
  @HttpCode(StatusCodes.OK)
  update(
    @Body() UpdateAlbumDto: UpdateAlbumDto,
    @Param('id') id: string,
  ): Album | string {
    if (!validate(id)) {
      throw new HttpException('id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const album = dataSource.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const { name, year, artistId } = UpdateAlbumDto;

    if (name === undefined || year === undefined || artistId === undefined) {
      throw new HttpException(
        'not contain all required fileds',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof name !== 'string' || typeof year !== 'number') {
      throw new HttpException(
        'not contain all required fileds',
        HttpStatus.BAD_REQUEST,
      );
    }

    album.name = name;
    album.year = year;
    album.artistId = artistId;
    return album;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id') id: string): Album[] {
    if (!validate(id)) {
      throw new HttpException('Album id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const album = dataSource.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const newAlbums = dataSource.albums.filter((album) => album.id !== id);
    return (dataSource.albums = newAlbums);
  }
}
