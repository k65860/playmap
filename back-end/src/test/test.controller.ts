import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestService } from './test.service';
import {
  CreateTestSubmitDto,
  CreateUserTestReviewDto,
  GetOneTestDto,
  GetOneUserTestDto,
  GetOneUserTestOptionDto,
} from './test.dto';
import { GetOneProfileDto } from 'src/profile/profile.dto';

@Controller('test')
@ApiTags('분석 모듈')
export class TestController {
  constructor(private service: TestService) {}

  @Get('standard')
  @ApiOperation({ summary: '분석 종류 전체 조회' })
  public getAllTestType() {
    return this.service.getAllTestType();
  }

  @Get()
  @ApiOperation({ summary: '분석 결과 전체 조회' })
  public getAllUserTest(@Query() { PRF_SQ }: GetOneProfileDto) {
    return this.service.getAllUserTest(PRF_SQ);
  }

  @Get(':TEST_SQ')
  @ApiOperation({
    summary: '분석 결과 상세 조회',
    description: `
    - USE_CPN 값 true: 쿠폰을 이미 사용했음 / 유료 솔루션
    - USE_CPN 값 false: 쿠폰을 사용하지 않았음 / 무료 솔루션
    `,
  })
  public getOneUserTest(
    @Param() { TEST_SQ }: GetOneUserTestDto,
    @Query() { IS_ADM }: GetOneUserTestOptionDto,
  ) {
    return this.service.getOneUserTest(TEST_SQ, IS_ADM);
  }

  @Post(':TEST_SQ')
  @ApiOperation({
    summary: '분석 결과에 쿠폰 사용',
    description: `
    - API 요청전 '쿠폰을 사용하여 분석결과를 상세하게 보시겠어요?' 확인창 필요
    `,
  })
  public execUserTestUseCoupon(@Param() { TEST_SQ }: GetOneUserTestDto) {
    return this.service.execUserTestUseCoupon(TEST_SQ);
  }

  @Post(':TEST_SQ/review')
  @ApiOperation({ summary: '분석 결과에 리뷰 등록 및 수정' })
  public createUserTestReview(
    @Param() { TEST_SQ }: GetOneUserTestDto,
    @Body() { TEST_RVW }: CreateUserTestReviewDto,
  ) {
    return this.service.createUserTestReview(TEST_SQ, TEST_RVW);
  }

  @Delete(':TEST_SQ/review')
  @ApiOperation({ summary: '분석 결과에 리뷰 등록 및 수정' })
  public deleteUserTestReview(@Param() { TEST_SQ }: GetOneUserTestDto) {
    return this.service.createUserTestReview(TEST_SQ, null);
  }
}
