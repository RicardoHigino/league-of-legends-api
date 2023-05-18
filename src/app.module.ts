import { Module } from '@nestjs/common';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { SummonerModule } from './summoner/summoner.module';
import { MatchModule } from './match/match.module';
import { CommunicatorModule } from './communicator/communicator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    LeaderboardModule,
    SummonerModule,
    MatchModule,
    CommunicatorModule,
  ],
})
export class AppModule {}
