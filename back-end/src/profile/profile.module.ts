import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileDao } from './profile.dao';
import { CommonModule } from 'src/common/common.module';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [CommonModule, WsModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileDao],
  exports: [ProfileService, ProfileDao],
})
export class ProfileModule {}
