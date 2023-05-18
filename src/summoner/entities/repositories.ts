import { EntityRepository, Repository } from 'typeorm';
import { Summoner } from './summoner.entity';

@EntityRepository(Summoner)
export class SummonerRepository extends Repository<Summoner> {}
