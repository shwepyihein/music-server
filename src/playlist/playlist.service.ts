import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map } from 'rxjs';
import { AudioEntity } from 'src/audio/model/audio.entity';
import { Repository } from 'typeorm';
import { UpdatePlayListDto, createPlayListDto } from './model/playlist.dto';
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
        select: ['id', 'name', 'created_at', 'deleted_at', 'updated_at'],
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

  async getPlayListAndAudio(page, limit, order) {
    const skip = limit * (page - 1);
    const orderAsc = order ? order : 'desc';
    const orderData = { order: {} };
    orderData.order[`${'id'}`] = orderAsc;
    return from(
      this.playListRepo.findAndCount({
        select: [
          'id',
          'name',
          'created_at',
          'deleted_at',
          'updated_at',
          'playlist_to_audio',
        ],
        relations: ['playlist_to_audio', 'playlist_to_audio.audios'],
        skip: skip,
        take: limit,
        ...orderData,
      }),
    ).pipe(
      map(async ([orders, count]) => {
        console.log(orders);

        const playListData = JSON.parse(JSON.stringify(orders));
        const newPlayList = playListData.map((item) => ({
          ...item,
          audioList: item.playlist_to_audio,
        }));
        delete playListData.playlist_to_audio;

        return {
          data: newPlayList,
          total_page: Math.round(count / limit),
        };
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

  async CreatePlayList(data: createPlayListDto) {
    console.log(data, 'data');
    try {
      const PlayListRooms = [];
      const savePlayList = await this.playListRepo.save(data);
      for (const id of data.playList) {
        console.log(id, 'id');
        const oldGenre = await this.audioRepo.findOne({
          where: { id: id },
        });
        console.log(oldGenre);
        const genreRoom = new PlayListToAudio();
        genreRoom.playlist = savePlayList;
        genreRoom.audios = oldGenre;
        PlayListRooms.push(genreRoom);
      }
      await this.playListToAudioRepo.save(PlayListRooms);
      return { success: true };
    } catch (error) {
      throw new BadRequestException({ error: error });
    }
  }

  async UpdatePlayList(id: number, updatePlayListDto: UpdatePlayListDto) {
    const { name, audioIds } = updatePlayListDto;
    const existingPlayList = await this.playListRepo.findOne({
      where: {
        id: id,
      },
      relations: ['playlist_to_audio'],
    });

    if (!existingPlayList) {
      throw new NotFoundException('Playlist not found');
    }
    // Update playlist properties
    existingPlayList.name = name;
    existingPlayList.id = id;

    // Remove existing relationships
    const playlist_to_audio = [];

    await this.playListToAudioRepo.delete({
      playlist: existingPlayList,
    });

    await this.playListRepo.save(existingPlayList);

    // Add new relationship
    for (const audioId of audioIds) {
      const audio = await this.audioRepo.findOne({ where: { id: audioId } });
      if (!audio) {
        throw new NotFoundException(`Audio with ID ${audioId} not found`);
      }

      const playlistToAudio = new PlayListToAudio();
      playlistToAudio.playlist = existingPlayList;
      playlistToAudio.audios = audio;
      playlist_to_audio.push(playlistToAudio);
    }
    await this.playListToAudioRepo.save(playlist_to_audio);

    return existingPlayList;
  }

  async remove(id: number) {
    // Find the playlist
    const existingPlayList = await this.playListRepo.findOne({
      where: { id: id },
      relations: ['playlist_to_audio'], // Load the related audios
    });

    if (!existingPlayList) {
      throw new NotFoundException('Playlist not found');
    }
    try {
      for (const playlistToAudio of existingPlayList.playlist_to_audio) {
        await this.playListToAudioRepo.remove(playlistToAudio);
      }

      // Delete the playlist
      await this.playListRepo.remove(existingPlayList);
      return { success: true };
    } catch (error) {
      throw new BadRequestException({ success: false, message: error });
    }
    // Remove the Many-to-Many relationships
  }
}
