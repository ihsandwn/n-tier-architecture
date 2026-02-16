import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('warehouses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WarehousesController {
    constructor(private readonly warehousesService: WarehousesService) { }

    @Post()
    @Roles(Role.Admin, Role.Manager)
    create(@Body() createWarehouseDto: CreateWarehouseDto) {
        return this.warehousesService.create(createWarehouseDto);
    }

    @Get()
    @Roles(Role.Admin, Role.Manager)
    findAll() {
        return this.warehousesService.findAll();
    }

    @Get(':id')
    @Roles(Role.Admin, Role.Manager)
    findOne(@Param('id') id: string) {
        return this.warehousesService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.Admin, Role.Manager)
    update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
        return this.warehousesService.update(id, updateWarehouseDto);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    remove(@Param('id') id: string) {
        return this.warehousesService.remove(id);
    }
}
