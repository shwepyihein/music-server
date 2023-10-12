import { ApiProperty } from '@nestjs/swagger';

export class createGenreDto {
  @ApiProperty()
  name: string;
}
