import { Injectable, UseGuards } from '@nestjs/common';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrismaService } from '../../data/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role as RoleEnum } from '../auth/role.enum';
import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsString({ each: true })
    permissionIds: string[];
}

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
    constructor(private readonly prisma: PrismaService) { }

    @Post()
    @Roles(RoleEnum.Admin)
    async create(@Body() dto: CreateRoleDto) {
        return this.prisma.role.create({
            data: {
                name: dto.name,
                description: dto.description,
                permissions: {
                    connect: dto.permissionIds.map(id => ({ id }))
                }
            },
            include: {
                permissions: true
            }
        });
    }

    @Get()
    @Roles(RoleEnum.Admin)
    async findAll() {
        return this.prisma.role.findMany({
            include: {
                permissions: true
            }
        });
    }

    @Get(':id')
    @Roles(RoleEnum.Admin)
    async findOne(@Param('id') id: string) {
        return this.prisma.role.findUnique({
            where: { id },
            include: {
                permissions: true
            }
        });
    }

    @Patch(':id')
    @Roles(RoleEnum.Admin)
    async update(@Param('id') id: string, @Body() dto: Partial<CreateRoleDto>) {
        return this.prisma.role.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                permissions: dto.permissionIds ? {
                    set: dto.permissionIds.map(id => ({ id }))
                } : undefined
            },
            include: {
                permissions: true
            }
        });
    }

    @Delete(':id')
    @Roles(RoleEnum.Admin)
    async remove(@Param('id') id: string) {
        return this.prisma.role.delete({
            where: { id }
        });
    }
}
