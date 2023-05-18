import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CommunicatorService } from 'src/communicator/communicator.service';
import { RequestDto } from 'src/communicator/dto/request.dto';
import { MatchService } from 'src/match/match.service';
import { Summoner } from './entities/summoner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SummonerRepository } from './entities/repositories';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';
import { SummonerDto } from './dto/create-summoner.dto';
import { Queue } from 'src/shared/enums/queue.dto';

@Injectable()
export class SummonerService {
  constructor(
    private readonly communicatorService: CommunicatorService,

    private readonly leaderboardService: LeaderboardService,

    @InjectRepository(SummonerRepository)
    private readonly repository: SummonerRepository,

    @Inject(forwardRef(() => MatchService))
    private readonly matchService: MatchService,
  ) {}

  async getSummaryPlayer(name: string, region: string, queue: number) {
    const summoner = await this.getSummonerByName(name, region);

    let summonerStats = await this.getSummonerLeague(summoner.id, region);

    if (queue) {
      summonerStats = [summonerStats.filter((s) => s.queueType === Queue[queue])[0]];
    }
    
    const summonerStatArray = [];

    for (const summonerStat of summonerStats) {
      const summary = {
        rank: {
          name: summonerStat.tier,
          // image: "https://opgg-static.akamaized.net/images/medals/" + summonerStat.tier.toLowerCase() + "_" + summonerStat.rank + ".png?image=q_auto:best&v=1"
          image: `https://static.bigbrain.gg/assets/lol/s12_rank_icons/${summonerStat.tier.toLowerCase()}.png`
        },
        leaguePoints: summonerStat.leaguePoints,
        wins: summonerStat.wins,
        losses: summonerStat.losses,
        kda: "",
        csPerMinute: "",
        visionScore: "",
      };

      const matchData = await this.matchService.getMatchesBySummoner({
        name,
        region,
        queue
      })

      let kda = 0;
      let csPerMinute = 0;
      let visionScore = 0;
      let totalMatches = 0;

      for (const match of matchData) {
        const participant = match.info.participants.find((p) => p.summonerId === summoner.id);

        if (participant) {
          kda += (participant.kills + participant.assists) / Math.max(1, participant.deaths);
          csPerMinute += participant.totalMinionsKilled / (match.info.gameDuration / 60);
          visionScore += participant.visionScore;
          totalMatches++;
        }
      }
  
      summary.kda = totalMatches > 0 ? (kda / totalMatches).toFixed(2) : "0";
      summary.csPerMinute = totalMatches > 0 ? (csPerMinute / totalMatches).toFixed(2) : "0";
      summary.visionScore = totalMatches > 0 ? (visionScore / totalMatches).toFixed(2) : "0";
  
      summonerStatArray.push(summary);
    }

    return summonerStatArray;
  }

  async getSummonerByName(name: string, region: string) {
    const encodedSummonerName = encodeURIComponent(name);

    const request: RequestDto = {
      method: 'GET',
      url: `lol/summoner/v4/summoners/by-name/${encodedSummonerName}`,
      region: region.toLowerCase(),
    };

    const summoner = await this.communicatorService.request(request);

    if (!summoner) {
      throw new NotFoundException('Summoner not found');
    }
    
    try {
      await this.saveLeaderboardPlayer(summoner.id, region);
    } catch (err) {
      console.log(err.response.message);
    }

    return summoner;
  }

  async getSummonerLeague(id: string, region: string) {
    const request: RequestDto = {
      method: 'GET',
      url: `lol/league/v4/entries/by-summoner/${id}`,
      region: region.toLowerCase(),
    };

    return await this.communicatorService.request(request);
  }

  async saveLeaderboardPlayer(summonerId: string, region: string) {
    const summonerStats = await this.getSummonerLeague(summonerId, region);

    if (!summonerStats || summonerStats.length === 0) {
      throw new NotFoundException('Summoner Stats not found');
    }

    const summonerStat = summonerStats.filter((s) => s.queueType === "RANKED_SOLO_5x5")[0];

    const summonerDto: SummonerDto = {
      summonerId: summonerStat.summonerId,
      name: summonerStat.summonerName,
      region: region,
      wins: summonerStat.wins,
      losses: summonerStat.losses,
      totalGames: summonerStat.wins + summonerStat.losses,
      rank: summonerStat.rank,
      tier: summonerStat.tier,
      leaguePoints: summonerStat.leaguePoints,
      winRate: +((summonerStat.wins / (summonerStat.wins + summonerStat.losses)) * 100).toFixed(3),
      queue: +Queue[summonerStat.queueType],
    };

    const savedSummoner = await this.saveSummoner(summonerDto);

    await this.leaderboardService.saveLeaderboard(savedSummoner.uid);

    return;
  }

  async saveSummoner(summonerDto: SummonerDto) {
    const summonerExists = await this.repository.findOne({summonerId : summonerDto.summonerId})

    const summoner = summonerExists ? summonerExists : new Summoner();

    summoner.summonerId = summonerDto.summonerId;
    summoner.name = summonerDto.name;
    summoner.region = summonerDto.region;
    summoner.wins = summonerDto.wins;
    summoner.losses = summonerDto.losses;
    summoner.totalGames = summonerDto.totalGames;
    summoner.rank = summonerDto.rank;
    summoner.tier = summonerDto.tier;
    summoner.leaguePoints = summonerDto.leaguePoints;
    summoner.winRate = summonerDto.winRate;
    summoner.queue = summonerDto.queue;

    try {
      return await summoner.save();
    } catch (err) {
      throw new InternalServerErrorException('Error saving summoner');
    }
  }
}
