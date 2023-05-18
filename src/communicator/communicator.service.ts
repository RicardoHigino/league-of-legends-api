import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as config from 'config';
import { RequestDto } from './dto/request.dto';
import { lastValueFrom, map } from 'rxjs';
const riot = config.get('riot');

@Injectable()
export class CommunicatorService {
  constructor(private readonly httpService: HttpService) {}

  async request(requestDto: RequestDto) {
    const { method, url, region } = requestDto;

    const config = {
      method: method,
      url: `https://${region}.${riot.domain}/${url}`,
      headers: {
        'X-Riot-Token': riot.key,
      },
    };

    try {
      const data = await lastValueFrom(
        this.httpService.request(config).pipe(map((response) => response.data)),
      );

      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.response?.data?.status?.message);
    }
  }
}
