import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardRepository } from './entities/repositories';
import { SummonerRepository } from 'src/summoner/entities/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([LeaderboardRepository, SummonerRepository])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
