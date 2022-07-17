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

interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

interface TrackDto {
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

@Controller(paths.TRACK)
export class TrackController {
  @Get()
  @HttpCode(StatusCodes.OK)
  getAll(): Track[] {
    return dataSource.tracks;
  }

  @Get(':trackId')
  @HttpCode(StatusCodes.OK)
  getOne(@Param('trackId') trackId: string): Track | string {
    if (!validate(trackId)) {
      throw new HttpException('trackId is not uuid', HttpStatus.BAD_REQUEST);
    }
    const track = dataSource.tracks.find((track) => track.id === trackId);
    if (!track) {
      throw new HttpException('track not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() TrackDto: TrackDto): Track | string {
    const { name, artistId, albumId, duration } = TrackDto;
    if (
      name === undefined ||
      duration === undefined ||
      artistId === undefined ||
      albumId === undefined
    ) {
      throw new HttpException(
        'not contain all required fileds',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newTrackId = v4();
    const newTrack = {
      id: newTrackId,
      name,
      artistId,
      albumId,
      duration,
    };
    dataSource.tracks.push(newTrack);
    return newTrack;
  }

  @Put(':trackId')
  @HttpCode(StatusCodes.OK)
  update(
    @Body() TrackDto: TrackDto,
    @Param('trackId') trackId: string,
  ): Track | string {
    if (!validate(trackId)) {
      throw new HttpException('trackId is not uuid', HttpStatus.BAD_REQUEST);
    }
    const track = dataSource.tracks.find((track) => track.id === trackId);
    if (!track) {
      throw new HttpException('track not found', HttpStatus.NOT_FOUND);
    }
    const { name, artistId, albumId, duration } = TrackDto;
    track.name = name;
    track.artistId = artistId;
    track.albumId = albumId;
    track.duration = duration;
    return track;
  }

  @Delete(':trackId')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('trackId') trackId: string): Track[] {
    if (!validate(trackId)) {
      throw new HttpException('trackId is not uuid', HttpStatus.BAD_REQUEST);
    }
    const track = dataSource.tracks.find((track) => track.id === trackId);
    if (!track) {
      throw new HttpException('track not found', HttpStatus.NOT_FOUND);
    }
    const newTracks = dataSource.tracks.filter((track) => track.id !== trackId);
    return (dataSource.tracks = newTracks);
  }
}
