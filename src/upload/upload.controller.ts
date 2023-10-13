import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileDeleteDto, FileUploadDto } from './model/upload.dto';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('signed-url')
  async generateSignedUrl(@Body() data: FileUploadDto) {
    return this.uploadService.generateSignedUrl(data);
  }

  @Post('file/delete')
  async deleteFile(@Body() body: FileDeleteDto) {
    const { file_path } = body;
    await this.uploadService.deleteFile(file_path);
  }
}
