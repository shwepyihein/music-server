import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map } from 'rxjs';
import { AudioEntity } from 'src/audio/model/audio.entity';
import { Repository } from 'typeorm';
import { PlayListEntity, PlayListToAudio } from './model/playlist.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(AudioEntity)
    private readonly audioRepo: Repository<AudioEntity>,
    @InjectRepository(PlayListToAudio)
    private readonly playListToAudioRepo: Repository<PlayListToAudio>,
    @InjectRepository(PlayListEntity)
    private readonly playListRepo: Repository<PlayListEntity>,
  ) {}
  getPlayList(page, limit, order) {
    const skip = limit * (page - 1);
    const orderAsc = order ? order : 'desc';
    const orderData = { order: {} };
    orderData.order[`${'id'}`] = orderAsc;
    return from(
      this.playListRepo.findAndCount({
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

  async getPlayListById(id: number) {
    try {
      const queryResult = await this.playListRepo.findOne({
        where: { id },
        relations: ['playlist_to_audio', 'playlist_to_audio.audios'],
      });

      const playList = [];

      for (const data of queryResult.playlist_to_audio) {
        const listResult = await this.audioRepo.findOne({
          where: { id: data.audios.id },
          relations: ['author_id', 'genre_to_audio', 'genre_to_audio.genres'],
        });
        const genre_list = listResult.genre_to_audio.map((item) => ({
          id: item.genres?.id,
          name: item.genres?.name,
        }));

        delete listResult.genre_to_audio;
        const newFormat = {
          ...listResult,
          genre_list: genre_list,
        };
        playList.push(newFormat);
      }
      delete queryResult.playlist_to_audio;

      const data = JSON.parse(JSON.stringify({ ...queryResult, playList }));
      return data;
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }

  async CreatePlayList(data) {
    try {
      const PlayListRooms = [];
      const savePlayList = await this.playListRepo.save(data);
      for (const id of data.playList) {
        const oldGenre = await this.audioRepo.findOne({
          where: { id: id },
        });
        const genreRoom = new PlayListToAudio();
        genreRoom.playlist = savePlayList;
        genreRoom.audios = oldGenre;
        PlayListRooms.push(genreRoom);
      }
      await this.playListToAudioRepo.save(PlayListRooms);
      return { success: true };
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
