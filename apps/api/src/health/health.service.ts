import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../data/prisma/prisma.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  check() {
    return {
      status: 'ok',
      service: 'omni-logistics-api',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  liveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }

  async readiness() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ready',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Readiness check failed', error);
      return {
        status: 'not_ready',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
