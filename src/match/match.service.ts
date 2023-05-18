import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CommunicatorService } from 'src/communicator/communicator.service';
import { RequestDto } from 'src/communicator/dto/request.dto';
import { Region } from 'src/shared/enums/region.enum';
import { SummonerService } from 'src/summoner/summoner.service';
import { GetMatchesBySummonerDto } from './dto/get-matches-by-user-name.dto';
import { GetPuuidMatch } from './dto/get-puuid-match.dto';

@Injectable()
export class MatchService {
  constructor(
    private readonly communicatorService: CommunicatorService,

    @Inject(forwardRef(() => SummonerService))
    private readonly summonerService: SummonerService,
  ) {}

  async getMatchesBySummoner(dto: GetMatchesBySummonerDto) {
    const { name, region, queue, start, count } = dto;

    const summoner = await this.summonerService.getSummonerByName(name, region);

    if (!summoner) {
      throw new NotFoundException('Summoner not found');
    }

    const matchesUids = await this.getPuuidMatches({
      puuid: summoner.puuid,
      region,
      queue,
      start,
      count,
    });

    if (!matchesUids) {
      throw new NotFoundException('Matches not found');
    }

    const matches = [];

    for (const matchUid of matchesUids) {
      const match = await this.getMatchById(matchUid, region);

      if (match) {
        matches.push(match);
      }
    }

    return matches;
  }

  async getPuuidMatches(dto: GetPuuidMatch) {
    const { puuid, region, queue, start, count } = dto;

    let url = `lol/match/v5/matches/by-puuid/${puuid}/ids`;

    if (queue || start || count) {
      url += '?';

      if (queue && queue != 0) {
        url += `queue=${queue}`;
      }

      if (start) {
        url += `${queue ? '&' : ''}start=${start}`;
      }

      if (count) {
        url += `${queue || start ? '&' : ''}count=${count}`;
      }
    }

    const request: RequestDto = {
      method: 'GET',
      url: url,
      region: Region[`${region.toLowerCase()}`],
    };

    return await this.communicatorService.request(request);
  }

  async getMatchById(matchId: string, region: string) {
    const request: RequestDto = {
      method: 'GET',
      url: `lol/match/v5/matches/${matchId}`,
      region: Region[`${region.toLowerCase()}`],
    };

    return await this.communicatorService.request(request);
  }
}
