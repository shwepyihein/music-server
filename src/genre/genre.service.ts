import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map } from 'rxjs';
import { Repository } from 'typeorm';
import { GenreEntity } from './model/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepo: Repository<GenreEntity>,
  ) {}

  getGenreList(page, limit, order_by, order) {
    const skip = limit * (page - 1);
    const orderFiled = order_by ? order_by : 'id';
    const orderAsc = order ? order : 'desc';
    const orderData = { order: {} };
    orderData.order[`${orderFiled}`] = orderAsc;
    return from(
      this.genreRepo.findAndCount({
        select: ['id', 'name'],
        skip: skip,
        take: limit,
        ...orderData,
      }),
    ).pipe(
      map(async ([orders, count]) => {
        const data = JSON.parse(JSON.stringify(orders));
        console.log(order);

        return { data, total_page: Math.round(count / limit) };
      }),
    );
  }

  async getGenreById(id: number) {
    console.log(id);
    const category = await this.genreRepo.findOne({ where: { id: id } });
    console.log(category);
    const data = JSON.parse(JSON.stringify(category));
    return data;
  }

  async createGenre(data) {
    try {
      await this.genreRepo.save({ name: data.name });

      return { success: true };
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
