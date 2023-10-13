import { ApiProperty } from '@nestjs/swagger';

export class createAudioDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  file_path: string;

  @ApiProperty()
  image_path: string;

  @ApiProperty()
  duration: string;

  @ApiProperty()
  year: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  author_id: number;

  @ApiProperty()
  genre_list: number[];
}
