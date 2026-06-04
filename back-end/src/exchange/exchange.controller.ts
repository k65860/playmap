import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ExecExchangeDto,
  GetAllExchangeDto,
  GetOneExchangeHistoryDto,
} from './exchange.dto';

@Controller('exchange')
@ApiTags('추천인 상품 모듈')
export class ExchangeController {
  constructor(private readonly service: ExchangeService) {}

  @Get('item')
  @ApiOperation({ summary: '추천인 상품 전체 조회' })
  public async getAllExchangeItem() {
    return this.service.getAllExchangeItem();
  }

  @Get()
  @ApiOperation({ summary: '추천인 상품 교환 이력 전체 조회' })
  public async getAllExchange(@Query() { USR_SQ }: GetAllExchangeDto) {
    return this.service.getAllExchange(USR_SQ);
  }

  @Post()
  @ApiOperation({ summary: '추천인 상품 교환 신청' })
  public async execExchange(@Body() body: ExecExchangeDto) {
    return this.service.execExchange(body);
  }

  @Patch(':ECHIS_SQ')
  @ApiOperation({ summary: '추천인 상품 교환 이력 확인 토글' })
  public async execExchangeHistoryCheck(
    @Param() { ECHIS_SQ }: GetOneExchangeHistoryDto,
  ) {
    return this.service.execExchangeHistoryCheck(ECHIS_SQ);
  }
}
