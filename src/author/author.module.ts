import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioEntity } from 'src/audio/model/audio.entity';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { AuthorEntity } from './model/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AudioEntity, AuthorEntity])],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
