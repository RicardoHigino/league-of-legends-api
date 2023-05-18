import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SummonerRepository } from 'src/summoner/entities/repositories';
import { LeaderboardRepository } from './entities/repositories';
import { Leaderboard } from './entities/leaderboard.entity';
import { Queue } from 'src/shared/enums/queue.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(LeaderboardRepository)
    private readonly leaderboardRepository: LeaderboardRepository,

    @InjectRepository(SummonerRepository)
    private readonly repository: SummonerRepository,
  ) {}

  async saveLeaderboard(summonerUid: any) {
    const summoner = await this.repository
      .createQueryBuilder('summoner')
      .where('summoner.uid = :uid', { uid: summonerUid })
      .getOne();

    const { leaguePointsRank, winRateRank } = await this.calculateLeaderboard(summoner);

    const leaderboardExists = await this.leaderboardRepository.findOne({
      where: { summoner: summoner },
    });

    // Save leaderboard
    const leaderboard = leaderboardExists ? leaderboardExists : new Leaderboard();
    leaderboard.leaguePoints = leaguePointsRank ? leaguePointsRank : 0;
    leaderboard.winRate = winRateRank ? winRateRank : 0;
    leaderboard.summoner = summoner;

    try {
      await this.leaderboardRepository.save(leaderboard);
    } catch (err) {
      throw new InternalServerErrorException('Error saving leaderboard');
    }
  }

  async getLeaderboardPlayer(name: string, region: string) {
    const summoner = await this.repository.findOne({
      where: { name: name, region: region },
    });

    if (!summoner) {
      throw new InternalServerErrorException('Summoner not found');
    }

    const leaderboard = await this.leaderboardRepository.findOne({
      where: { summoner: summoner },
    });

    if (!leaderboard) {
      throw new InternalServerErrorException('Leaderboard not found');
    }

    const { leaguePointsRank, winRateRank } = await this.calculateLeaderboard(summoner);

    // Update leaderboard
    leaderboard.leaguePoints = leaguePointsRank ? leaguePointsRank : 0;
    leaderboard.winRate = winRateRank ? winRateRank : 0;

    try {
      await this.leaderboardRepository.save(leaderboard);

      return {
        leaguePoints: {
          top: leaderboard.leaguePoints
        },
        winRate: {
          top: leaderboard.winRate
        },
      };
    } catch (err) {
      throw new InternalServerErrorException('Error getting leaderboard');
    }
  }

  async calculateLeaderboard(summoner: any) {
    // LeaguePoint rank
    const summonersByLeaguePoints = await this.repository.find({
      order: { leaguePoints: 'DESC' },
    });
    const leaguePointsRank = summonersByLeaguePoints.findIndex((s) => s.uid === summoner.uid) + 1;

    // WinRate rank
    const summonersByWinRate = await this.repository.find({
      order: { winRate: 'DESC' },
    });
    const winRateRank = summonersByWinRate.findIndex((s) => s.uid === summoner.uid) + 1;

    return {
      leaguePointsRank,
      winRateRank,
    }
  }

  async getLeaderboard() {
    const result = await this.leaderboardRepository.createQueryBuilder('leaderboard')
      .leftJoinAndSelect('leaderboard.summoner', 'summoner')
      .orderBy('leaderboard.leaguePoints', 'ASC')
      .getMany();

    return result.map((l) => ({
        queueType: Queue[l.summoner.queue],
        leaguePoints: {
          top: l.leaguePoints
        },
        winRate: {
          top: l.winRate
        },
        summoner: {
          name: l.summoner.name,
          region: l.summoner.region,
        },
      }));
  }
}
