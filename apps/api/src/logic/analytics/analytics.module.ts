import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { DataModule } from '../../data/data.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [DataModule, AuthModule],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    exports: [AnalyticsService],
})
export class AnalyticsModule { }
