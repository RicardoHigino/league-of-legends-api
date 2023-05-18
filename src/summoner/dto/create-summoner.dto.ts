export class SummonerDto {
  summonerId: string;
  name: string;
  region: string;
  wins: number;
  losses: number;
  totalGames: number;
  rank: string;
  tier: string;
  leaguePoints: number;
  winRate: number;
  queue?: number;
}
