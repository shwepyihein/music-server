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
import { AuthorService } from './author.service';
import { createAuthorDto } from './model/author.dto';
import { SortByType } from './model/author.enum';

@Controller('author')
@ApiTags('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}
  @Get()
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  @ApiQuery({ name: 'order', required: false, enum: SortByType })
  OrderList(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('order') order?: string,
  ) {
    return this.authorService.getAuthorList(page, limit, order);
  }

  @Get('all')
  getAllAuthor() {
    return this.authorService.getAllAuthor();
  }

  @Get(':id')
  OrderDetailById(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.getAuthorById(id);
  }

  @Post()
  async createGenre(@Body() data: createAuthorDto) {
    return await this.authorService.creatAuthor(data);
  }
}
