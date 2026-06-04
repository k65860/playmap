import { Controller, Get, Param } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOneCodeDto } from './common.dto';

@Controller('common')
@ApiTags('공통 모듈')
export class CommonController {
  constructor(private service: CommonService) {}

  @Get('review')
  @ApiOperation({ summary: '리뷰 전체 조회' })
  public getAllReview() {
    return this.service.getAllReview();
  }

  @Get()
  @ApiOperation({
    summary: '공통코드 전체 조회',
    description: `
    - CC_GRP 필드로 값을 찾아서 사용
    `,
  })
  public getAllCode() {
    return this.service.getAllCode();
  }

  @Get(':CC_GRP')
  @ApiOperation({
    summary: '공통코드 분류별 조회',
    description: `
    - 공통코드 전체 조회가 있기때문에 사용 비추천, 하지만 꼭 사용해야할 경우를 위해 API 제공
    `,
  })
  public getOneCode(@Param() { CC_GRP }: GetOneCodeDto) {
    return this.service.getOneCode(CC_GRP);
  }
}
