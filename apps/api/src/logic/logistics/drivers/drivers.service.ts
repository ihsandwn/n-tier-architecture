import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../data/prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class DriversService {
    constructor(private readonly prisma: PrismaService) { }

    async create(tenantId: string, createDriverDto: CreateDriverDto) {
        return this.prisma.driver.create({
            data: {
                ...createDriverDto,
                tenantId,
            }
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.driver.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' }
        });
    }

    async findOne(id: string, tenantId: string) {
        const driver = await this.prisma.driver.findUnique({
            where: { id, tenantId },
        });
        if (!driver) throw new NotFoundException('Driver not found');
        return driver;
    }

    async remove(id: string, tenantId: string) {
        return this.prisma.driver.delete({
            where: { id, tenantId }
        });
    }
}
