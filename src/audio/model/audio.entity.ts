import { AuthorEntity } from 'src/author/model/author.entity';
import { AudioToGenreEntity } from 'src/genre/model/genre.entity';
import { PlayListToAudio } from 'src/playlist/model/playlist.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('audio')
export class AudioEntity {
  @PrimaryGeneratedColumn()
  @Generated('increment')
  id: number;

  @Column({})
  title: string;

  @Column({ nullable: true })
  album: string;

  @Column()
  file_path: string;

  @Column()
  image_path: string;

  @Column({
    type: 'text',
  })
  duration: number | string;

  @Column()
  year: string;

  @Column()
  description: string;

  @OneToMany(() => AudioToGenreEntity, (b) => b.audios)
  genre_to_audio: AudioToGenreEntity[];

  @ManyToOne((type) => AuthorEntity, (author) => author.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author_id: number;

  @OneToMany(() => PlayListToAudio, (b) => b.audios)
  playlist_to_audio: PlayListToAudio[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}
