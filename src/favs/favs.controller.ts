import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import dataSource from '../data.source';
import paths from '../enums/constants.api';
import { validate } from 'uuid';
import { Artist } from 'src/artist/types';
import { Album } from 'src/album/types';
import { Track } from '../track/types';

interface FavoritesRepsonse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

@Controller(paths.FAVS)
export class FavsController {
  @Get()
  @HttpCode(StatusCodes.OK)
  getAll(): FavoritesRepsonse {
    return dataSource.favs;
  }
}
