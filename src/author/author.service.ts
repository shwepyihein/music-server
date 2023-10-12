import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map } from 'rxjs';
import { Repository } from 'typeorm';
import { AuthorEntity } from './model/author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepo: Repository<AuthorEntity>,
  ) {}

  getAuthorList(page, limit, order) {
    const skip = limit * (page - 1);
    const orderAsc = order ? order : 'desc';
    const orderData = { order: {} };
    orderData.order[`${'id'}`] = orderAsc;
    return from(
      this.authorRepo.findAndCount({
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

  async getAuthorById(id: number) {
    console.log(id);
    const category = await this.authorRepo.findOne({
      where: { id: id },
      relations: ['audio'],
    });
    console.log(category);
    const data = JSON.parse(JSON.stringify(category));
    return data;
  }

  async creatAuthor(data) {
    try {
      await this.authorRepo.save(data);

      return { success: true };
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
