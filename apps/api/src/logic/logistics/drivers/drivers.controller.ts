import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/role.enum';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DriversController {
    constructor(private readonly driversService: DriversService) { }

    @Post()
    @Roles(Role.Admin, Role.Manager)
    create(@Request() req: any, @Body() createDriverDto: CreateDriverDto) {
        return this.driversService.create(req.user.tenantId, createDriverDto);
    }

    @Get()
    @Roles(Role.Admin, Role.Manager, Role.User)
    findAll(@Request() req: any) {
        return this.driversService.findAll(req.user.tenantId);
    }

    @Delete(':id')
    @Roles(Role.Admin, Role.Manager)
    remove(@Request() req: any, @Param('id') id: string) {
        return this.driversService.remove(id, req.user.tenantId);
    }
}
