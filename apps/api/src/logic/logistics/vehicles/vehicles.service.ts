import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../data/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(tenantId: string, createVehicleDto: CreateVehicleDto) {
        return this.prisma.vehicle.create({
            data: {
                ...createVehicleDto,
                tenantId,
            }
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.vehicle.findMany({
            where: { tenantId },
            orderBy: { plateNumber: 'asc' }
        });
    }

    async findOne(id: string, tenantId: string) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id, tenantId },
        });
        if (!vehicle) throw new NotFoundException('Vehicle not found');
        return vehicle;
    }

    async remove(id: string, tenantId: string) {
        // Check if used in shipments
        // If MVP, maybe just allow delete or fail if constraint
        return this.prisma.vehicle.delete({
            where: { id, tenantId }
        });
    }
}
