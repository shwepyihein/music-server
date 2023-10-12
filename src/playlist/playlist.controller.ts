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
import { createPlayListDto } from './model/playlist.dto';
import { SortByType } from './model/playlist.enum';
import { PlaylistService } from './playlist.service';

@Controller('playlist')
@ApiTags('playList')
export class PlaylistController {
  constructor(private readonly playListService: PlaylistService) {}
  @Get()
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  @ApiQuery({ name: 'order', required: false, enum: SortByType })
  OrderList(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('order') order?: string,
  ) {
    return this.playListService.getPlayList(page, limit, order);
  }

  @Get(':id')
  OrderDetailById(@Param('id', ParseIntPipe) id: number) {
    return this.playListService.getPlayListById(id);
  }

  @Post()
  async createGenre(@Body() data: createPlayListDto) {
    return await this.playListService.CreatePlayList(data);
  }
}
