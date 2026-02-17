import { Injectable, UseGuards } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../data/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionsController {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    @Roles(Role.Admin)
    async findAll() {
        return this.prisma.permission.findMany({
            orderBy: {
                name: 'asc'
            }
        });
    }
}
