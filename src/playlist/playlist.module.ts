import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioEntity } from 'src/audio/model/audio.entity';
import { PlayListEntity, PlayListToAudio } from './model/playlist.entity';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayListEntity, AudioEntity, PlayListToAudio]),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
