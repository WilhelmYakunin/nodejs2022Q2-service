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

@Controller(paths.FAVS + '/' + paths.ALBUM)
export class AlbumController {
  @Post(':id')
  @HttpCode(StatusCodes.CREATED)
  create(@Param('id') id: string): Album | string {
    if (!validate(id)) {
      throw new HttpException('Album id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const album = dataSource.favs.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    dataSource.favs.albums.push(album);
    return album;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id') id: string): Album[] {
    if (!validate(id)) {
      throw new HttpException('Album id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const album = dataSource.favs.albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    const newFavAlbums = dataSource.favs.albums.filter(
      (album) => album.id !== id,
    );
    return (dataSource.favs.albums = newFavAlbums);
  }
}
