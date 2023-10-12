import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AudioService } from './audio.service';
import { createAudioDto } from './model/audio.dto.';
import { SortByType } from './model/audio.enum';

@Controller('audio')
@ApiTags('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  @ApiQuery({ name: 'order', required: false, enum: SortByType })
  OrderList(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,

    @Query('order') order?: string,
  ) {
    return this.audioService.getAudioList(page, limit, order);
  }

  @Get(':id')
  OrderDetailById(@Param('id', ParseIntPipe) id: number) {
    return this.audioService.getAudioById(id);
  }

  @Post()
  async createGenre(@Body() data: createAudioDto) {
    return await this.audioService.CreateAudio(data);
  }
}
