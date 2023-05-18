import { Controller, Get, Param, Query } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get(':name/:region')
  async getMatchesBySummoner(
    @Param('name') name: string,
    @Param('region') region: string,
    @Query('queue') queue?: number,
    @Query('start') start?: number,
    @Query('count') count?: number,
  ) {
    return this.matchService.getMatchesBySummoner({
      name,
      region,
      queue,
      start,
      count,
    });
  }
}
