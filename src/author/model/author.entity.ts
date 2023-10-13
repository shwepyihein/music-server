import { AudioEntity } from 'src/audio/model/audio.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column({ nullable: true })
  author_image: string;

  @Column()
  description: string;

  @OneToMany((type) => AudioEntity, (AudioEntity) => AudioEntity.author_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  audio: AudioEntity[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}
