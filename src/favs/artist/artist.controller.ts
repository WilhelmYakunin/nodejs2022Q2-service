import {
  Controller,
  HttpCode,
  Param,
  Post,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import dataSource from '../../data.source';
import paths from '../../enums/constants.api';
import { validate } from 'uuid';
import { Album } from '../../album/types';

@Controller(paths.FAVS + '/' + paths.ARTIST)
export class ArtistController {
  @Post(':id')
  @HttpCode(StatusCodes.CREATED)
  create(@Param('id') id: string): Album | string {
    if (!validate(id)) {
      throw new HttpException('artist id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const album = dataSource.favs.artists.find((artist) => artist.id === id);
    if (!album) {
      throw new HttpException(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    dataSource.favs.artists.push(album);
    return album;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id') id: string): Album[] {
    if (!validate(id)) {
      throw new HttpException('artist id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const album = dataSource.favs.artists.find((artist) => artist.id === id);
    if (!album) {
      throw new HttpException('artist not found', HttpStatus.NOT_FOUND);
    }
    const newFavArtists = dataSource.favs.artists.filter(
      (artist) => artist.id !== id,
    );
    return (dataSource.favs.artists = newFavArtists);
  }
}
