import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MlService {
  private mlUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {
    this.mlUrl = this.configService.get('ML_SERVICE_URL') || 'http://ml-service:8000';
  }

  async predictDefaultRisk(data: any) {
    try {
      const response = await firstValueFrom(this.httpService.post(`${this.mlUrl}/predict/default-risk`, data));
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('ML Service unavailable');
    }
  }

  async analyzeBnplCluster(data: any) {
    try {
      const response = await firstValueFrom(this.httpService.post(`${this.mlUrl}/predict/bnpl-cluster`, data));
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('ML Service unavailable');
    }
  }

  async getHealthScoreMl(data: any) {
    try {
      const response = await firstValueFrom(this.httpService.post(`${this.mlUrl}/predict/health-score`, data));
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('ML Service unavailable');
    }
  }
}
