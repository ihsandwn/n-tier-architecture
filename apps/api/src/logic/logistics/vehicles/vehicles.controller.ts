import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/role.enum';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) { }

    @Post()
    @Roles(Role.Admin, Role.Manager)
    create(@Request() req: any, @Body() createVehicleDto: CreateVehicleDto) {
        return this.vehiclesService.create(req.user.tenantId, createVehicleDto);
    }

    @Get()
    @Roles(Role.Admin, Role.Manager, Role.User)
    findAll(@Request() req: any) {
        return this.vehiclesService.findAll(req.user.tenantId);
    }

    @Delete(':id')
    @Roles(Role.Admin, Role.Manager)
    remove(@Request() req: any, @Param('id') id: string) {
        return this.vehiclesService.remove(id, req.user.tenantId);
    }
}
