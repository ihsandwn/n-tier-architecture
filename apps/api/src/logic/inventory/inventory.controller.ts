import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('stock')
    @Roles(Role.Admin, Role.Manager)
    updateStock(@Body() updateStockDto: UpdateStockDto) {
        return this.inventoryService.updateStock(updateStockDto);
    }

    @Get('warehouse/:warehouseId')
    @Roles(Role.Admin, Role.Manager, Role.User)
    getWarehouseInventory(@Param('warehouseId') warehouseId: string) {
        return this.inventoryService.getWarehouseInventory(warehouseId);
    }
}
