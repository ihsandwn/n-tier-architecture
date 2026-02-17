import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth() {
    return this.healthService.check();
  }

  @Get('ready')
  async getReady() {
    return await this.healthService.readiness();
  }

  @Get('live')
  getLive() {
    return this.healthService.liveness();
  }
}
