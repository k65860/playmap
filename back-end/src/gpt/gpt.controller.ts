import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import {
  GetAllGptHistoryDto,
  GetOneGptHistoryDto,
  CreateGptDto,
} from './gpt.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/gpt')
@ApiTags('GPT')
export class GptController {
  constructor(private readonly service: GptService) {}

  @Get()
  @ApiOperation({ summary: 'GPT 채팅 전체 조회' })
  getAllGpt(@Query() { PRF_SQ }: GetAllGptHistoryDto) {
    return this.service.getAllGpt(PRF_SQ);
  }

  @Get('keyword')
  @ApiOperation({ summary: 'GPT 질문 키워드 전체 조회' })
  getAllGptKeyword() {
    return this.service.getAllGptKeyword();
  }

  @Post()
  @ApiOperation({
    summary: 'GPT 채팅 생성',
    description: `
      - TEST_SQ 항목의 값이 0일 경우 분석결과에 저장하지 않음
    `,
  })
  createGpt(@Body() body: CreateGptDto) {
    return this.service.createGpt(body);
  }

  @Delete(':GPT_SQ')
  @ApiOperation({ summary: 'GPT 채팅 삭제' })
  deleteGpt(@Param() { GPT_SQ }: GetOneGptHistoryDto) {
    return this.service.deleteGpt(GPT_SQ);
  }
}
