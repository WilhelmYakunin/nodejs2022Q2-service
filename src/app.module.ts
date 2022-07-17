import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { TrackController } from './track/track.controller';
import { ArtistController } from './artist/artist.controller';
import { AlbumController } from './album/album.controller';
import { FavsController } from './favs/favs.controller';
import { TrackController as FavsTrack } from './favs/track/track.controller';
import { AlbumController as FavsAlbum } from './favs/album/album.controller';
import { ArtistController as FavsArtist } from './favs/artist/artist.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
    TrackController,
    ArtistController,
    AlbumController,
    FavsController,
    FavsTrack,
    FavsAlbum,
    FavsArtist,
  ],
  providers: [AppService],
})
export class AppModule {}
