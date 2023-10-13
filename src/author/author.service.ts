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
        select: [
          'id',
          'name',
          'created_at',
          'deleted_at',
          'updated_at',
          'description',
          'degree',
        ],
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

  async getAllAuthor() {
    const res = await this.authorRepo.find({
      select: ['id', 'name', 'degree', 'author_image', 'description'],
      order: {
        created_at: 'DESC',
      },
    });
    return res;
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

  async UpdateAuthorById(id: number, data: any) {
    try {
      const gerne = await this.authorRepo.findOne({ where: { id: id } });
      if (!gerne) {
        return new BadRequestException({ message: 'Gerne not Found' });
      }
      await this.authorRepo.save({ ...gerne, ...data });
      return { success: true };
    } catch (error) {
      return new BadRequestException({ success: false });
    }
  }

  async deleteGenreWithCascade(id: number) {
    try {
      const author = await this.authorRepo.findOne({
        where: { id: id },
      });

      if (author) {
        // Delete related AudioToGenreEntity records first

        // Now delete the GenreEntity
        await this.authorRepo.remove(author);
        return { success: true };
      } else {
        return new BadRequestException({ message: 'Gerne not Found' });
      }
    } catch (error) {
      console.error('Error deleting genre and related records:', error);
      return new BadRequestException({ message: error });
    }
  }
}
