import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { GenreService } from './genre.service';
import { UpdateGenreDto, createGenreDto } from './model/genre.dto.';
import { SortByType } from './model/genre.enum';

@Controller('gerne')
@ApiTags('gerne')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  @ApiQuery({ name: 'order_by', required: false, enum: SortByType })
  @ApiQuery({ name: 'order', required: false, enum: SortByType })
  OrderList(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('order_by') order_by?: string,
    @Query('order') order?: string,
  ) {
    return this.genreService.getGenreList(page, limit, order_by, order);
  }

  @Get('all')
  getAllGenre() {
    return this.genreService.getAllGenre();
  }

  @Get(':id')
  greneDetailById(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.getGenreById(id);
  }

  @Delete(':id')
  gerneDelete(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.deleteGenreWithCascade(id);
  }

  @Put('update/:id')
  updateGreneDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateGenreDto,
  ) {
    return this.genreService.UpdateGenreById(id, data);
  }

  @Post()
  async createGenre(@Body() data: createGenreDto) {
    return await this.genreService.createGenre(data);
  }
}
