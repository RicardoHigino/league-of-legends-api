import { CommonBaseEntity } from 'src/shared/entity/common-base.entity';
import { Summoner } from 'src/summoner/entities/summoner.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('leaderboard')
export class Leaderboard extends CommonBaseEntity {
  @ManyToOne(() => Summoner)
  summoner: Summoner;

  @Column({ type: 'int', default: 0 })
  leaguePoints: number;

  @Column({ type: 'int', default: 0 })
  winRate: number;
}
