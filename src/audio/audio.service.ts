import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map } from 'rxjs';
import { AudioToGenreEntity, GenreEntity } from 'src/genre/model/genre.entity';
import { Repository } from 'typeorm';
import { AudioEntity } from './model/audio.entity';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(AudioEntity)
    private readonly audioRepo: Repository<AudioEntity>,

    @InjectRepository(GenreEntity)
    private GenreRepo: Repository<GenreEntity>,

    @InjectRepository(AudioToGenreEntity)
    private AudioToGenreEntityRepo: Repository<AudioToGenreEntity>,
  ) {}

  getAudioList(page, limit, order) {
    const skip = limit * (page - 1);
    const orderAsc = order ? order : 'desc';
    const orderData = { order: {} };
    orderData.order[`${'id'}`] = orderAsc;
    return from(
      this.audioRepo.findAndCount({
        select: [
          'id',
          'title',
          'description',
          'deleted_at',
          'deleted_at',
          'genre_to_audio',
          'author_id',
          'image_path',
          'duration',
          'year',
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

  async getAudioById(id: number) {
    try {
      const queryResult = await this.audioRepo.findOne({
        where: { id },
        relations: ['author_id', 'genre_to_audio', 'genre_to_audio.genres'],
      });

      const genre_list = queryResult.genre_to_audio.map((item) => ({
        id: item.genres?.id,
        name: item.genres?.name,
      }));

      delete queryResult.genre_to_audio;
      const newFormat = {
        ...queryResult,
        genre_list: genre_list,
      };

      const data = JSON.parse(JSON.stringify(newFormat));
      return data;
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }

  async CreateAudio(data) {
    const genreRooms = [];
    const saveAudio = await this.audioRepo.save(data);
    for (const id of data.genre_list) {
      const oldGenre = await this.GenreRepo.findOne({
        where: { id: id },
      });
      const genreRoom = new AudioToGenreEntity();
      genreRoom.audios = saveAudio;
      genreRoom.genres = oldGenre;
      genreRooms.push(genreRoom);
    }
    await this.AudioToGenreEntityRepo.save(genreRooms);
    try {
      return { success: true };
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
