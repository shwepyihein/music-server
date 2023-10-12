import { AudioEntity } from 'src/audio/model/audio.entity';
import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('author')
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  @Generated('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  degree: string;

  @Column()
  decription: string;

  @OneToMany((type) => AudioEntity, (AudioEntity) => AudioEntity.author_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  audio: AudioEntity[];
}
