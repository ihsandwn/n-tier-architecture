import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get('dashboard')
    async getDashboardStats(@Req() req: any) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getDashboardStats(tenantId);
    }

    @Get('trends')
    async getOrderTrends(@Req() req: any) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getOrderTrends(tenantId);
    }

    @Get('inventory-health')
    async getInventoryHealth(@Req() req: any) {
        const tenantId = req.user.tenantId;
        return this.analyticsService.getInventoryHealth(tenantId);
    }
}
