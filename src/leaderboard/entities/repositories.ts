import { EntityRepository, Repository } from 'typeorm';
import { Leaderboard } from './leaderboard.entity';

@EntityRepository(Leaderboard)
export class LeaderboardRepository extends Repository<Leaderboard> {}
