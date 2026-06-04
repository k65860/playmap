import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { CommonDao } from './common.dao';

@Module({
  imports: [],
  controllers: [CommonController],
  providers: [CommonService, CommonDao],
  exports: [CommonService, CommonDao],
})
export class CommonModule {}
