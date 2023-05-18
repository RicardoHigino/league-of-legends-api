import { Module, forwardRef } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { SummonerModule } from 'src/summoner/summoner.module';
import { CommunicatorModule } from 'src/communicator/communicator.module';

@Module({
  imports: [
    CommunicatorModule,
    forwardRef(() => SummonerModule),
  ],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
