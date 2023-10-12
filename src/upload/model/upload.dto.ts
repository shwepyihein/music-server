import { ApiProperty } from '@nestjs/swagger';
export class FileDeleteDto {
  @ApiProperty()
  file_path: string;
}

export class FileUploadDto {
  @ApiProperty()
  file_type: string;
  @ApiProperty()
  content_type: 'image' | 'mp3';
}
