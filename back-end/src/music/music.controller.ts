import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllMusicDto } from './music.dto';
import { MusicService } from './music.service';

@Controller('music')
@ApiTags('음원 모듈')
export class MusicController {
  constructor(private service: MusicService) {}

  @Get()
  @ApiOperation({ summary: '음원 전체 조회' })
  public getAllMusic(@Query() { CHAR_SQ }: GetAllMusicDto) {
    return this.service.getAllMusic(CHAR_SQ);
  }
}
