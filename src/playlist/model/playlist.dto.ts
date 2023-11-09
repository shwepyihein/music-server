import { ApiProperty } from '@nestjs/swagger';

export class createPlayListDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  playList: number[];
}

export class UpdatePlayListDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  audioIds: number[];
}
