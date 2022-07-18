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
import { Track } from '../../track/types';

@Controller(paths.FAVS + '/' + paths.TRACK)
export class TrackController {
  @Post(':id')
  @HttpCode(StatusCodes.CREATED)
  create(@Param('id') id: string): Track | string {
    if (!validate(id)) {
      throw new HttpException('Track id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const track = dataSource.tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    dataSource.favs.tracks.push(track);
    return track;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id') id: string): Track[] {
    if (!validate(id)) {
      throw new HttpException('Track id is not uuid', HttpStatus.BAD_REQUEST);
    }
    const track = dataSource.tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    const newFavTracks = dataSource.favs.tracks.filter(
      (track) => track.id !== id,
    );
    return (dataSource.favs.tracks = newFavTracks);
  }
}
