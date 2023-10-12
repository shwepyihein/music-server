import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioEntity } from 'src/audio/model/audio.entity';

import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { AudioToGenreEntity, GenreEntity } from './model/genre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GenreEntity, AudioEntity, AudioToGenreEntity]),
  ],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
