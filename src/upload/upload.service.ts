import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { AudioEntity } from 'src/audio/model/audio.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FileUploadDto } from './model/upload.dto';

@Injectable()
export class UploadService {
  private imageS3Bucket: string;

  private s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
  });

  constructor(
    @InjectRepository(AudioEntity)
    private readonly MangaRepo: Repository<AudioEntity>,
    private readonly configService: ConfigService,
  ) {
    this.imageS3Bucket = this.configService.get('AWS_BUCKET');
  }
  async generateSignedUrl(data: FileUploadDto) {
    const { content_type, file_type } = data;

    if (!content_type) {
      throw new BadRequestException('content_type is required');
    }
    if (!file_type) {
      throw new BadRequestException('file_path is required');
    }

    const filename = `${content_type}/${uuid()}.${file_type}`;

    console.log(this.imageS3Bucket);
    const params = {
      Bucket: this.imageS3Bucket,
      Key: filename,
      Expires: 3600,
      ContentType: content_type,
    };

    const s3Url = await this.s3.getSignedUrlPromise('putObject', params);
    return {
      url: s3Url,
      filename: filename,
    };
  }

  async deleteFile(filePath: string) {
    // Specify the bucket name and the file path you want to delete
    console.log(filePath);
    // Perform the file deletion
    try {
      const data = await this.s3.deleteObject({
        Bucket: this.imageS3Bucket,
        Key: filePath,
      });

      console.log(data);
      return { success: true };
    } catch (error) {
      console.error('Error deleting the file:', error);
      throw new BadRequestException('Error deleting the file');
    }
  }
}
