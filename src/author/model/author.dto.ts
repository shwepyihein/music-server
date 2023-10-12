import { ApiProperty } from '@nestjs/swagger';

export class createAuthorDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  degree: string;

  @ApiProperty()
  decription: string;
}
