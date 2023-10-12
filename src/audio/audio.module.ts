import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from 'src/author/model/author.entity';
import { AudioToGenreEntity, GenreEntity } from 'src/genre/model/genre.entity';
import { PlayListEntity } from 'src/playlist/model/playlist.entity';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { AudioEntity } from './model/audio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AudioEntity,
      GenreEntity,
      AuthorEntity,
      AudioToGenreEntity,
      PlayListEntity,
    ]),
  ],
  controllers: [AudioController],
  providers: [AudioService],
  exports: [AudioService],
})
export class AudioModule {}
