import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummonerService } from './summoner.service';
import { SummonerController } from './summoner.controller';
import { SummonerRepository } from './entities/repositories';
import { CommunicatorModule } from 'src/communicator/communicator.module';
import { MatchModule } from 'src/match/match.module';
import { LeaderboardModule } from 'src/leaderboard/leaderboard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SummonerRepository]),
    CommunicatorModule,
    forwardRef(() => MatchModule),
    LeaderboardModule,
  ],
  controllers: [SummonerController],
  providers: [SummonerService],
  exports: [SummonerService],
})
export class SummonerModule {}
