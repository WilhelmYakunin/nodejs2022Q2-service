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

interface Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

interface CreateArtistDto {
  name: string;
  grammy: boolean;
}

@Controller(paths.ARTIST)
export class ArtistController {
  @Get()
  @HttpCode(StatusCodes.OK)
  getAll() {
    return dataSource.users;
  }

  @Get(':id')
  @HttpCode(StatusCodes.OK)
  getOne(@Param('id') id: string): Artist | string {
    if (!validate(id)) {
      throw new HttpException('artistId is not uuid', HttpStatus.BAD_REQUEST);
    }
    const artist = dataSource.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() CreateArtistDto: CreateArtistDto): Artist | string {
    const { name, grammy } = CreateArtistDto;
    if (name === undefined || grammy === undefined) {
      throw new HttpException(
        'not contain all required fileds',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newArtistId = v4();
    const newArtist = {
      id: newArtistId,
      name,
      grammy,
    };
    dataSource.artists.push(newArtist);
    return newArtist;
  }

  @Put(':id')
  @HttpCode(StatusCodes.OK)
  update(
    @Body() CreateArtistDto: CreateArtistDto,
    @Param('id') id: string,
  ): Artist | string {
    if (!validate(id)) {
      throw new HttpException('artistId is not uuid', HttpStatus.BAD_REQUEST);
    }

    const artist = dataSource.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException('artist not found', HttpStatus.NOT_FOUND);
    }

    const { name, grammy } = CreateArtistDto;

    if (name === undefined || grammy === undefined) {
      throw new HttpException(
        'not contain all required fileds',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof name !== 'string' || typeof grammy !== 'boolean') {
      throw new HttpException(
        'not contain all required fileds',
        HttpStatus.BAD_REQUEST,
      );
    }

    artist.name = name;
    artist.grammy = grammy;
    return artist;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id') id: string): Artist[] {
    if (!validate(id)) {
      throw new HttpException('Artist id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const artist = dataSource.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    const newArtists = dataSource.artists.filter((artist) => artist.id !== id);
    return (dataSource.artists = newArtists);
  }
}
