import { AudioEntity } from 'src/audio/model/audio.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('playlist')
export class PlayListEntity {
  @PrimaryGeneratedColumn()
  @Generated('increment')
  id: number;

  @Column()
  name: string;

  @OneToMany(() => PlayListToAudio, (b) => b.playlist)
  playlist_to_audio: PlayListToAudio[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}

@Entity('playlist-to-audio')
export class PlayListToAudio {
  @PrimaryGeneratedColumn()
  @Generated('increment')
  public playList_audio_id: number;

  @ManyToOne(() => PlayListEntity, (playList) => playList.playlist_to_audio)
  public playlist: PlayListEntity;

  @ManyToOne(() => AudioEntity, (book) => book.playlist_to_audio)
  public audios: AudioEntity;
}
