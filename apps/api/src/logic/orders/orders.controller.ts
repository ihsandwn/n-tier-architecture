import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @Roles(Role.Admin, Role.Manager, Role.User)
    create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
        console.log('OrdersController.create called');
        console.log('User:', req.user);
        console.log('DTO:', createOrderDto);
        return this.ordersService.create(req.user.id, req.user.tenantId, createOrderDto);
    }

    @Get()
    @Roles(Role.Admin, Role.Manager, Role.User)
    findAll(@Request() req: any) {
        return this.ordersService.findAll(req.user.tenantId);
    }

    @Get(':id')
    @Roles(Role.Admin, Role.Manager, Role.User)
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.ordersService.findOne(id, req.user.tenantId);
    }

    @Patch(':id/status')
    @Roles(Role.Admin, Role.Manager)
    updateStatus(@Request() req: any, @Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
        return this.ordersService.updateStatus(id, req.user.tenantId, req.user.id, updateOrderStatusDto);
    }
}
