import { ApiProperty } from '@nestjs/swagger';

export class createPlayListDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  playList: string[];
}
