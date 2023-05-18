import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}
  @Get(':name/:region')
  async getLeaderboardPlayer(
    @Param('name') name: string,
    @Param('region') region: string,
  ) {
    return this.leaderboardService.getLeaderboardPlayer(name, region);
  }

  @Get()
  async getLeaderboard() {
    return this.leaderboardService.getLeaderboard();
  }
}
