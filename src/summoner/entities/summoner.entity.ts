import { Leaderboard } from 'src/leaderboard/entities/leaderboard.entity';
import { CommonBaseEntity } from 'src/shared/entity/common-base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('summoner')
export class Summoner extends CommonBaseEntity {
  @OneToMany(() => Leaderboard, (leaderboard) => leaderboard.summoner)
  leaderboard: Leaderboard;

  @Column({ nullable: true })
  summonerId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  region: string;

  @Column({ type: 'int', default: 0 })
  wins: number;

  @Column({ type: 'int', default: 0 })
  losses: number;

  @Column({ type: 'int', default: 0 })
  totalGames: number;

  @Column({ nullable: true })
  rank: string;

  @Column({ nullable: true })
  tier: string;

  @Column({ type: 'int', default: 0 })
  leaguePoints: number;

  @Column({ type: 'decimal', default: 0 })
  winRate: number;

  @Column({ type: 'int', default: 0 })
  queue: number;
}
