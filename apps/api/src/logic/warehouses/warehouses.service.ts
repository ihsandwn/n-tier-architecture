import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../data/prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
    constructor(private readonly prisma: PrismaService) { }

    create(createWarehouseDto: CreateWarehouseDto) {
        return this.prisma.warehouse.create({
            data: createWarehouseDto,
        });
    }

    findAll() {
        return this.prisma.warehouse.findMany({
            include: {
                tenant: true,
            },
        });
    }

    findOne(id: string) {
        return this.prisma.warehouse.findUnique({
            where: { id },
            include: {
                tenant: true,
                inventory: true,
            },
        });
    }

    update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
        return this.prisma.warehouse.update({
            where: { id },
            data: updateWarehouseDto,
        });
    }

    remove(id: string) {
        return this.prisma.warehouse.delete({
            where: { id },
        });
    }
}
