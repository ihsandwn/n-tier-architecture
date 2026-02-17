import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/role.enum';

@Controller('shipments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShipmentsController {
    constructor(private readonly shipmentsService: ShipmentsService) { }

    @Post()
    @Roles(Role.Admin, Role.Manager)
    create(@Request() req: any, @Body() createShipmentDto: CreateShipmentDto) {
        return this.shipmentsService.create(req.user.tenantId, req.user.id, createShipmentDto);
    }

    @Get()
    @Roles(Role.Admin, Role.Manager, Role.User)
    findAll(@Request() req: any) {
        return this.shipmentsService.findAll(req.user.tenantId);
    }
}
