import { Controller, Get, Param, Query } from '@nestjs/common';
import { DevService } from './dev.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetDelayResponseDto } from './dev.dto';

@Controller('dev')
@ApiTags('개발 모듈')
export class DevController {
  constructor(private service: DevService) {}

  @Get('delay')
  @ApiOperation({ summary: '딜레이 응답' })
  public getDelayResponse(@Query() { ms }: GetDelayResponseDto) {
    return this.service.getDelayResponse(ms);
  }
}
