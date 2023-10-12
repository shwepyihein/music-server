import { AudioEntity } from 'src/audio/model/audio.entity';
import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('genre')
export class GenreEntity {
  @PrimaryGeneratedColumn()
  @Generated('increment')
  id: number;

  @Column()
  name: string;

  @OneToMany(() => AudioToGenreEntity, (b) => b.genres)
  genre_to_audio: AudioToGenreEntity[];
}

@Entity('audio-to-genre')
export class AudioToGenreEntity {
  @PrimaryGeneratedColumn()
  @Generated('increment')
  public audio_genre_id: number;

  @ManyToOne(() => GenreEntity, (cate) => cate.genre_to_audio)
  public genres: GenreEntity;

  @ManyToOne(() => AudioEntity, (book) => book.genre_to_audio)
  public audios: AudioEntity;
}
