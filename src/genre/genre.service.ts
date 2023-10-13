import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map } from 'rxjs';
import { Repository } from 'typeorm';
import { AudioToGenreEntity, GenreEntity } from './model/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepo: Repository<GenreEntity>,
    @InjectRepository(AudioToGenreEntity)
    private readonly AudioToGenreRepo: Repository<AudioToGenreEntity>,
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

  async getAllGenre() {
    const res = await this.genreRepo.find({
      select: ['id', 'name'],
    });

    return res;
  }

  async getGenreById(id: number) {
    console.log(id);
    const category = await this.genreRepo.findOne({ where: { id: id } });
    const data = JSON.parse(JSON.stringify(category));
    return data;
  }

  async UpdateGenreById(id: number, data: any) {
    try {
      const gerne = await this.genreRepo.findOne({ where: { id: id } });
      if (!gerne) {
        return new BadRequestException({ message: 'Gerne not Found' });
      }
      await this.genreRepo.save({ ...gerne, ...data });
      return { success: true };
    } catch (error) {
      return new BadRequestException({ success: false });
    }
  }

  async createGenre(data) {
    try {
      await this.genreRepo.save({ name: data.name });

      return { success: true };
    } catch (error) {
      throw new BadRequestException();
    }
  }
  async deleteGenreWithCascade(id: number) {
    try {
      const genre = await this.genreRepo.findOne({
        where: { id: id },
        relations: ['genre_to_audio', 'genre_to_audio.audios'],
      });

      if (genre) {
        // Delete related AudioToGenreEntity records first
        if (genre.genre_to_audio && genre.genre_to_audio.length > 0) {
          await this.AudioToGenreRepo.remove(genre.genre_to_audio);
        }

        // Now delete the GenreEntity
        await this.genreRepo.remove(genre);
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
