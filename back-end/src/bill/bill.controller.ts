import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateBillDto,
  CreatePaymentDto,
  GetOneBillDto,
  GetOnePaymentDto,
} from './bill.dto';
import { GetOneAuthDto } from 'src/auth/auth.dto';

@Controller('bill')
@ApiTags('청구서 모듈')
export class BillController {
  constructor(private service: BillService) {}

  @Get()
  @ApiOperation({
    summary: '청구서 전체 조회',
    description: `
    - BILL_CRT_DT 항목은 청구서 발행 일시
    - PYMT_CRT_DT 항목은 결제 완료 일시
    - BILL_DEL_DT 항목이 null이 아닐 경우 청구서 파기를 의미
    - PYMT_DEL_DT 항목이 null이 아닐 경우 결제 취소를 의미
    - PYMT_DEL_DT와 BILL_DEL_DT가 둘 다 값이 있을 수 없음
    - PYMT_SQ가 없을 경우 아직 결제되지 않음
    - BILL_EXPR_DT 항목은 청구서 만료일
    - USR_SQ가 0일 경우 전체 회원의 데이터
    `,
  })
  public getAllBill(@Query() { USR_SQ }: GetOneAuthDto) {
    return this.service.getAllBill(USR_SQ);
  }

  @Post('req')
  @ApiOperation({ summary: '청구서 요청' })
  public createBill(@Body() body: CreateBillDto) {
    return this.service.createBill(body);
  }

  @Post('res')
  @ApiOperation({ summary: '청구서 응답' })
  public responseBill(@Body() body: CreatePaymentDto) {
    return this.service.responseBill(body);
  }

  @Delete('req/:BILL_SQ')
  @ApiOperation({ summary: '청구서 파기' })
  public deleteBill(@Param() { BILL_SQ }: GetOneBillDto) {
    return this.service.deleteBill(BILL_SQ);
  }

  @Delete('res/:PYMT_SQ')
  @ApiOperation({ summary: '결제 취소' })
  public deletePayment(@Param() { PYMT_SQ }: GetOnePaymentDto) {
    return this.service.deletePayment(PYMT_SQ);
  }
}
