import { Controller, Get, Param, Query } from '@nestjs/common';
import { SummonerService } from './summoner.service';

@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @Get(':name/:region')
  async getSummaryPlayer(
    @Param('name') name: string,
    @Param('region') region: string,
    @Query('queue') queue: number,
  ) {
    return this.summonerService.getSummaryPlayer(name, region, queue);
  }
}
