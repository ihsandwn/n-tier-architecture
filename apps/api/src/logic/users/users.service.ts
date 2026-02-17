import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../data/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { roleIds, ...userData } = createUserDto;
    const existing = await this.findByEmail(userData.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await (this.prisma.user as any).create({
      data: {
        ...userData,
        password: hashedPassword,
        roles: roleIds ? {
          connect: roleIds.map(id => ({ id }))
        } : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        roles: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                id: true,
                name: true
              }
            }
          }
        } as any,
        createdAt: true,
      } as any,
    });

    // Notify Admins
    await this.notificationsService.notifyRole(
      'admin',
      'New User Registered',
      `${user.name || user.email} has just joined the platform.`,
      'SUCCESS'
    );

    return user;
  }

  async findByEmail(email: string) {
    return (this.prisma.user as any).findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            permissions: true
          }
        }
      }
    });
  }

  findAll() {
    return (this.prisma as any).user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        roles: {
          select: {
            id: true,
            name: true,
          }
        } as any,
        createdAt: true,
      } as any,
    });
  }

  findOne(id: string) {
    return (this.prisma as any).user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        roles: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                id: true,
                name: true
              }
            }
          }
        } as any,
      } as any,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { roleIds, ...userData } = updateUserDto;

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Safety Check: Prevent removing the last admin
    if (roleIds) {
      const userToUpdate = await (this.prisma.user as any).findUnique({
        where: { id },
        include: { roles: true }
      });

      const wasAdmin = userToUpdate?.roles.some((r: any) => r.name === 'admin');

      const newRoles = await (this.prisma as any).role.findMany({
        where: { id: { in: roleIds } }
      });
      const isStillAdmin = newRoles.some((r: any) => r.name === 'admin');

      if (wasAdmin && !isStillAdmin) {
        const adminsCount = await (this.prisma as any).user.count({
          where: { roles: { some: { name: 'admin' } } }
        });
        if (adminsCount <= 1) {
          throw new ConflictException('Security Rule: Cannot demote the last system administrator.');
        }
      }
    }

    return (this.prisma.user as any).update({
      where: { id },
      data: {
        ...userData,
        roles: roleIds ? {
          set: roleIds.map(id => ({ id })),
        } : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        twoFactorEnabled: true,
        roles: {
          select: {
            id: true,
            name: true,
          }
        } as any,
        updatedAt: true,
      } as any,
    });
  }

  async enable2FA(userId: string, secret: string) {
    return (this.prisma.user as any).update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: true,
      },
    });
  }

  async disable2FA(userId: string) {
    return (this.prisma.user as any).update({
      where: { id: userId },
      data: {
        twoFactorSecret: null,
        twoFactorEnabled: false,
      },
    });
  }

  async remove(id: string) {
    const userToDelete = await (this.prisma.user as any).findUnique({
      where: { id },
      include: { roles: true }
    });

    if (userToDelete?.roles.some((r: any) => r.name === 'admin')) {
      const adminsCount = await (this.prisma as any).user.count({
        where: { roles: { some: { name: 'admin' } } }
      });
      if (adminsCount <= 1) {
        throw new ConflictException('Security Rule: Cannot delete the last system administrator.');
      }
    }

    return (this.prisma.user as any).delete({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });
  }
}
