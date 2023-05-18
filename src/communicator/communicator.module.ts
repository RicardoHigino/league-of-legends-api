import { Module } from '@nestjs/common';
import { CommunicatorService } from './communicator.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CommunicatorService],
  exports: [CommunicatorService],
})
export class CommunicatorModule {}
